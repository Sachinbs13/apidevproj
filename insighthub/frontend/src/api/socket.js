import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket = null;

export function connectSocket(token) {
  if (socket?.connected) return socket;

  socket = io(WS_URL, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export function subscribeToTopic(topic) {
  socket?.emit('subscribe:topic', { topic });
}

export function unsubscribeFromTopic(topic) {
  socket?.emit('unsubscribe:topic', { topic });
}

export function unsubscribeFromCategory(category) {
  socket?.emit('unsubscribe:topic', { category });
}

export function subscribeToCategory(category) {
  socket?.emit('subscribe:topic', { category });
}

export function resubscribeAll(topics = [], categories = []) {
  topics.forEach((topic) => subscribeToTopic(topic));
  categories.forEach((category) => subscribeToCategory(category));
}

export function onNewsUpdate(callback) {
  socket?.on('live:news_update', callback);
  return () => socket?.off('live:news_update', callback);
}

export function onTrendingUpdate(callback) {
  socket?.on('live:trending', callback);
  return () => socket?.off('live:trending', callback);
}

export function onBreakingNews(callback) {
  socket?.on('live:breaking', callback);
  return () => socket?.off('live:breaking', callback);
}

export function onSourceStatus(callback) {
  socket?.on('live:source_status', callback);
  return () => socket?.off('live:source_status', callback);
}

export function onBriefUpdate(callback) {
  socket?.on('live:brief', callback);
  return () => socket?.off('live:brief', callback);
}

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  subscribeToTopic,
  unsubscribeFromTopic,
  unsubscribeFromCategory,
  subscribeToCategory,
  resubscribeAll,
  onNewsUpdate,
  onTrendingUpdate,
  onBreakingNews,
  onSourceStatus,
  onBriefUpdate,
};
