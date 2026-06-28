import { useSelector } from 'react-redux';
import { useSocketContext } from '../context/SocketContext.jsx';
import {
  subscribeToTopic,
  unsubscribeFromTopic,
  subscribeToCategory,
  unsubscribeFromCategory,
} from '../api/socket.js';

export function useSocket() {
  const { connected } = useSocketContext();
  const token = useSelector((state) => state.auth.token);

  return {
    connected,
    isReady: connected && Boolean(token),
    subscribeToTopic,
    unsubscribeFromTopic,
    subscribeToCategory,
    unsubscribeFromCategory,
  };
}

export default useSocket;
