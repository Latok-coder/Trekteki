import { useEffect } from 'react';
import { socket } from '../socket.js';
import { useLobbyStore } from '../store/lobbyStore.js';
import { useGameStore } from '../store/gameStore.js';

/**
 * useSocket — call once at the app root.
 * Registers all global socket event listeners and keeps Zustand stores in sync.
 * Listeners are cleaned up on unmount.
 */
export function useSocket() {
  const { setConnected, setMySocketId, setRoom, setError, reset: resetLobby } =
    useLobbyStore();
  const { setGameStarting, reset: resetGame } = useGameStore();

  useEffect(() => {
    // ── Connection lifecycle ──────────────────────────────────────────
    function onConnect() {
      setConnected(true);
      setMySocketId(socket.id);
      console.log('[socket] connected', socket.id);
    }

    function onDisconnect(reason) {
      setConnected(false);
      setMySocketId(null);
      console.log('[socket] disconnected', reason);
    }

    function onConnectError(err) {
      setError(`Connection failed: ${err.message}`);
    }

    // ── Lobby events ─────────────────────────────────────────────────
    function onLobbyCreated({ room }) {
      setRoom(room);
    }

    function onLobbyJoined({ room }) {
      setRoom(room);
    }

    function onLobbyUpdate({ room }) {
      setRoom(room);
    }

    function onLobbyError({ message }) {
      setError(message);
    }

    function onPlayerLeft({ message }) {
      // Keep room state but surface the notification
      setError(message);
    }

    // ── Game events (Phase 5 will fill these in) ──────────────────────
    function onGameStarting({ roomCode }) {
      setGameStarting(roomCode);
    }

    // ── Register ────────────────────────────────────────────────────
    socket.on('connect',            onConnect);
    socket.on('disconnect',         onDisconnect);
    socket.on('connect_error',      onConnectError);
    socket.on('lobby:created',      onLobbyCreated);
    socket.on('lobby:joined',       onLobbyJoined);
    socket.on('lobby:update',       onLobbyUpdate);
    socket.on('lobby:error',        onLobbyError);
    socket.on('lobby:player_left',  onPlayerLeft);
    socket.on('game:starting',      onGameStarting);

    return () => {
      socket.off('connect',           onConnect);
      socket.off('disconnect',        onDisconnect);
      socket.off('connect_error',     onConnectError);
      socket.off('lobby:created',     onLobbyCreated);
      socket.off('lobby:joined',      onLobbyJoined);
      socket.off('lobby:update',      onLobbyUpdate);
      socket.off('lobby:error',       onLobbyError);
      socket.off('lobby:player_left', onPlayerLeft);
      socket.off('game:starting',     onGameStarting);
    };
  }, [setConnected, setMySocketId, setRoom, setError, resetLobby, setGameStarting]);
}
