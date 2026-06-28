import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  onNewsUpdate,
  onTrendingUpdate,
  onBreakingNews,
  onSourceStatus,
  onBriefUpdate,
  resubscribeAll,
} from '../api/socket.js';
import { queryClient } from '../lib/queryClient.js';
import { invalidateBriefQueries, invalidateNewsQueries } from '../lib/invalidateQueries.js';
import { queryKeys } from '../constants/queryKeys.js';
import {
  getSubscriptionMatches,
  formatSubscriptionAlertReason,
  hasActiveSubscriptions,
} from '../helpers/alertMatching.js';
import { loadAlertSubscriptions } from '../helpers/alertSubscriptionsStorage.js';
import { loadAlertHistory } from '../helpers/alertHistoryStorage.js';
import { store } from '../store/index.js';
import {
  addLiveArticle,
  addBreakingAlert,
  addSubscriptionAlert,
  hydrateSubscriptions,
  resetSubscriptions,
  setSubscriptionAlerts,
} from '../store/newsSlice.js';

const SocketContext = createContext(null);

function dispatchSubscriptionAlert(article, { breakingReason, isBreakingEvent }) {
  const { subscribedTopics, subscribedCategories } = store.getState().news;

  if (!hasActiveSubscriptions(subscribedTopics, subscribedCategories)) {
    return;
  }

  const matches = getSubscriptionMatches(article, subscribedTopics, subscribedCategories, {
    isBreakingEvent,
  });

  if (matches.length === 0) {
    return;
  }

  const matchLabel = matches.map((match) => match.label).join(' · ');
  const reason = formatSubscriptionAlertReason({ matches, breakingReason });

  store.dispatch(
    addSubscriptionAlert({
      article,
      matches,
      matchLabel,
      breakingReason,
      reason,
    }),
  );

  toast(`Alert · ${matchLabel}: ${article.title}`, { icon: '📰', duration: 5000 });
}

export function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!userId) {
      dispatch(resetSubscriptions());
      return;
    }

    const saved = loadAlertSubscriptions(userId);
    dispatch(hydrateSubscriptions(saved));
    dispatch(setSubscriptionAlerts(loadAlertHistory(userId)));

    if (getSocket()?.connected) {
      resubscribeAll(saved.topics, saved.categories);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setConnected(false);
      return undefined;
    }

    const socket = connectSocket(token);

    const handleConnect = () => {
      setConnected(true);
      const { subscribedTopics, subscribedCategories } = store.getState().news;
      resubscribeAll(subscribedTopics, subscribedCategories);
    };

    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    const unsubNews = onNewsUpdate(({ article }) => {
      dispatch(addLiveArticle(article));
      invalidateNewsQueries();
      dispatchSubscriptionAlert(article, { isBreakingEvent: false });
    });

    const unsubTrending = onTrendingUpdate(({ articles }) => {
      queryClient.setQueryData(queryKeys.trending.list(20), articles);
      queryClient.setQueryData(queryKeys.trending.list(50), articles);
    });

    const unsubBreaking = onBreakingNews(({ article, reason }) => {
      dispatch(addBreakingAlert({ article, reason }));
      dispatchSubscriptionAlert(article, { breakingReason: reason, isBreakingEvent: true });
    });

    const unsubBrief = onBriefUpdate(() => {
      invalidateBriefQueries();
    });

    const unsubSource = onSourceStatus(({ source }) => {
      if (source.status !== 'active') {
        toast(`${source.name} is ${source.status}`, { icon: '⚠️' });
      }
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      unsubNews?.();
      unsubTrending?.();
      unsubBreaking?.();
      unsubBrief?.();
      unsubSource?.();
      disconnectSocket();
      setConnected(false);
    };
  }, [token, dispatch]);

  const value = useMemo(() => ({ connected }), [connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within SocketProvider');
  return context;
}

export default SocketContext;
