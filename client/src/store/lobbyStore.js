import { create } from 'zustand';

/**
 * lobbyStore — mirrors the server-side room state for the current player.
 *
 * Shape:
 *   connected     bool         socket connection status
 *   roomCode      string|null  current room code
 *   room          object|null  public room snapshot from server
 *   mySocketId    string|null
 *   error         string|null  last lobby error message
 */
export const useLobbyStore = create((set) => ({
  connected: false,
  roomCode: null,
  room: null,
  mySocketId: null,
  error: null,

  setConnected: (connected) => set({ connected }),
  setMySocketId: (id) => set({ mySocketId: id }),

  setRoom: (room) =>
    set({ room, roomCode: room?.code ?? null, error: null }),

  setError: (message) => set({ error: message }),
  clearError: () => set({ error: null }),

  reset: () =>
    set({ roomCode: null, room: null, error: null }),
}));
