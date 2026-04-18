import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useSocket = (boardId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!boardId) return;
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('joinBoard', boardId);

    return () => {
      socketRef.current.emit('leaveBoard', boardId);
      socketRef.current.disconnect();
    };
  }, [boardId]);

  return socketRef.current;
};

export default useSocket;