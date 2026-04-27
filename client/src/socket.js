import { io } from 'socket.io-client';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

// Single shared socket instance for the whole app.
// autoConnect: false so we connect explicitly (avoids noise on the home page).
export const socket = io(SERVER_URL, {
  autoConnect: false,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}
