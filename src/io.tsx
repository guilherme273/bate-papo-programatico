import { io } from 'socket.io-client'
export const Socket = io('http://localhost:3000',{
    transports: ['websocket'],
    reconnectionAttempts: 0,
  });
