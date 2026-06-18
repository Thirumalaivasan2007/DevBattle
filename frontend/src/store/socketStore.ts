import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (url?: string) => void;
  disconnect: () => void;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  
  connect: (url = SOCKET_URL) => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) return;

    const socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      set({ isConnected: true });
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Socket disconnected');
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  }
}));
