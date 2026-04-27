import { create } from 'zustand';

/**
 * gameStore — will hold the full mirrored game state once Phase 5 is built.
 * For now it just tracks whether a game is starting.
 */
export const useGameStore = create((set) => ({
  gameState: null,
  myPlayerId: null,
  starting: false,

  setGameStarting: (roomCode) => set({ starting: true, roomCode }),

  setGameState: (gameState, myPlayerId) =>
    set({ gameState, myPlayerId, starting: false }),

  reset: () => set({ gameState: null, myPlayerId: null, starting: false }),
}));
