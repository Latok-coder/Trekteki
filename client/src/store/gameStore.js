import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  gameState:   null,
  myPlayerId:  null,
  starting:    false,
  roomCode:    null,
  chatMessages: [],
  logEntries:  [],

  setGameStarting: (roomCode) => set({ starting: true, roomCode }),

  setGameState: (gameState, myPlayerId) =>
    set({ gameState, myPlayerId, starting: false }),

  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

  addLogEntry: (entry) =>
    set((s) => ({ logEntries: [...s.logEntries, entry] })),

  reset: () => set({
    gameState: null, myPlayerId: null, starting: false,
    chatMessages: [], logEntries: [],
  }),
}));
