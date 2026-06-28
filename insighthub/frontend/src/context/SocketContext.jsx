import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  connectSocket,
  disconnectSocket,
  onNewsUpdate,
  onTrendingUpdate,
  onBreakingNews,
  onSourceStatus,
  onBriefUpdate,
} from '../api/socket.js';
import { queryClient } from '../lib/queryClient.js';
import { invalidateBriefQueries, invalidateNewsQueries } from '../lib/invalidateQueries.js';
import { queryKeys } from '../constants/queryKeys.js';
import { addLiveArticle, addBreakingAlert } from '../store/newsSlice.js';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setConnected(false);
      return undefined;
    }

    const socket = connectSocket(token);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    const unsubNews = onNewsUpdate(({ article }) => {
      dispatch(addLiveArticle(article));
      invalidateNewsQueries();
    });

    const unsubTrending = onTrendingUpdate(({ articles }) => {
      queryClient.setQueryData(queryKeys.trending.list(20), articles);
      queryClient.setQueryData(queryKeys.trending.list(50), articles);
    });

    const unsubBreaking = onBreakingNews(({ article, reason }) => {
      dispatch(addBreakingAlert({ article, reason }));
      toast(`Breaking: ${article.title}`, { icon: '🔴', duration: 5000 });
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
