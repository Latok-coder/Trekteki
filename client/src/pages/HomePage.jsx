import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket, connectSocket } from '../socket.js';
import { useLobbyStore } from '../store/lobbyStore.js';

export default function HomePage() {
  const navigate = useNavigate();
  const { connected, error, clearError, room } = useLobbyStore();

  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState(null); // null | 'create' | 'join'

  // If we already have a room, redirect to lobby
  if (room) {
    navigate(`/lobby/${room.code}`);
  }

  function ensureConnected() {
    if (!connected) connectSocket();
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!playerName.trim()) return;
    clearError();
    ensureConnected();

    // Wait for connection then emit
    if (socket.connected) {
      socket.emit('lobby:create', { playerName: playerName.trim() });
    } else {
      socket.once('connect', () => {
        socket.emit('lobby:create', { playerName: playerName.trim() });
      });
    }
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim()) return;
    clearError();
    ensureConnected();

    const emit = () =>
      socket.emit('lobby:join', {
        playerName: playerName.trim(),
        roomCode: roomCode.trim().toUpperCase(),
      });

    if (socket.connected) emit();
    else socket.once('connect', emit);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-widest text-federation">
            ST:CCG
          </h1>
          <p className="text-card-dim text-sm tracking-wider uppercase">
            Second Edition · Online
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="panel border-klingon text-klingon text-sm">
            {error}
          </div>
        )}

        {/* Name input (always visible) */}
        <div className="panel space-y-3">
          <label className="block text-card-dim text-xs uppercase tracking-wider">
            Your Name
          </label>
          <input
            className="input-field"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={24}
          />
        </div>

        {/* Mode selector */}
        {!mode && (
          <div className="grid grid-cols-2 gap-3">
            <button
              className="btn-primary py-4 text-lg"
              onClick={() => setMode('create')}
              disabled={!playerName.trim()}
            >
              Create Game
            </button>
            <button
              className="btn-secondary py-4 text-lg"
              onClick={() => setMode('join')}
              disabled={!playerName.trim()}
            >
              Join Game
            </button>
          </div>
        )}

        {/* Create form */}
        {mode === 'create' && (
          <form onSubmit={handleCreate} className="panel space-y-4">
            <p className="text-card-dim text-sm">
              A 4-character room code will be generated. Share it with your opponent.
            </p>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                Create Room
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMode(null)}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* Join form */}
        {mode === 'join' && (
          <form onSubmit={handleJoin} className="panel space-y-4">
            <label className="block text-card-dim text-xs uppercase tracking-wider">
              Room Code
            </label>
            <input
              className="input-field text-center text-xl tracking-widest uppercase"
              placeholder="XXXX"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={4}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={roomCode.trim().length < 4}
              >
                Join Room
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMode(null)}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {/* Connection indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-card-dim">
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-phase-active' : 'bg-card-dim'
            }`}
          />
          {connected ? 'Connected' : 'Not connected'}
        </div>

      </div>
    </div>
  );
}
