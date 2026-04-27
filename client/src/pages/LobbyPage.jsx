import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../socket.js';
import { useLobbyStore } from '../store/lobbyStore.js';
import { useGameStore } from '../store/gameStore.js';

// Starter decks available before the deck builder is complete (Phase 3)
const STARTER_DECKS = [
  { id: 'tng-starter',     label: 'TNG Starter (Federation)' },
  { id: 'klingon-starter', label: 'Klingon Starter' },
];

export default function LobbyPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { room, mySocketId, error, clearError, reset: resetLobby } = useLobbyStore();
  const { starting } = useGameStore();

  // Redirect to game when it starts
  useEffect(() => {
    if (starting) navigate(`/game/${code}`);
  }, [starting, code, navigate]);

  // If no room in store (e.g. page refresh), redirect home
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="panel text-center space-y-4">
          <p className="text-card-dim">Room not found or session lost.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const me = room.players.find((p) => p.isYou);
  const opponent = room.players.find((p) => !p.isYou);

  function handleDeckSelect(deckId) {
    // In Phase 3 this will send real deck JSON.
    // For now, send a minimal valid placeholder so the server accepts it.
    socket.emit('lobby:deck', {
      deck: { id: deckId, missions: ['placeholder'], cards: [], dilemmas: [] },
    });
  }

  function handleReady() {
    socket.emit('lobby:ready', { ready: !me?.ready });
  }

  function handleLeave() {
    socket.emit('lobby:leave');
    resetLobby();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-xl tracking-widest text-federation">ROOM</h2>
          <p className="text-4xl font-bold tracking-widest">{code}</p>
          <p className="text-card-dim text-xs">Share this code with your opponent</p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="panel border-klingon text-klingon text-sm cursor-pointer"
            onClick={clearError}
          >
            {error} <span className="float-right opacity-60">✕</span>
          </div>
        )}

        {/* Players */}
        <div className="panel space-y-3">
          <h3 className="text-card-dim text-xs uppercase tracking-wider mb-2">Players</h3>

          <PlayerRow player={me} isYou />
          {opponent
            ? <PlayerRow player={opponent} />
            : (
              <div className="flex items-center gap-3 p-2 rounded border border-dashed border-board-border">
                <div className="w-2 h-2 rounded-full bg-card-dim animate-pulse" />
                <span className="text-card-dim text-sm italic">
                  Waiting for opponent…
                </span>
              </div>
            )
          }
        </div>

        {/* Deck selection */}
        <div className="panel space-y-3">
          <h3 className="text-card-dim text-xs uppercase tracking-wider">
            Select Deck
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {STARTER_DECKS.map((d) => {
              const selected = me?.hasDeck; // simplified — will track deckId in Phase 3
              return (
                <button
                  key={d.id}
                  className="btn-secondary text-left"
                  onClick={() => handleDeckSelect(d.id)}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          {me?.hasDeck && (
            <p className="text-phase-active text-xs">✓ Deck selected</p>
          )}
        </div>

        {/* Ready / Leave */}
        <div className="flex gap-3">
          <button
            className={me?.ready ? 'btn-danger flex-1' : 'btn-primary flex-1'}
            onClick={handleReady}
            disabled={!me?.hasDeck}
          >
            {me?.ready ? 'Cancel Ready' : 'Ready'}
          </button>
          <button className="btn-secondary" onClick={handleLeave}>
            Leave
          </button>
        </div>

        {/* Status hint */}
        {room.players.length < 2 && (
          <p className="text-center text-card-dim text-xs">
            Waiting for a second player to join…
          </p>
        )}
        {room.players.length === 2 && !me?.ready && (
          <p className="text-center text-card-dim text-xs">
            Select a deck and click Ready when you're set.
          </p>
        )}
        {me?.ready && !opponent?.ready && (
          <p className="text-center text-phase-active text-xs animate-pulse">
            Waiting for opponent to ready up…
          </p>
        )}

      </div>
    </div>
  );
}

function PlayerRow({ player, isYou }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded bg-board-bg">
      <div
        className={`w-2 h-2 rounded-full ${
          player.ready ? 'bg-phase-active' : 'bg-card-dim'
        }`}
      />
      <span className="flex-1 text-sm">
        {player.name}
        {isYou && <span className="text-card-dim ml-1">(you)</span>}
      </span>
      <span className="text-xs text-card-dim">
        {player.hasDeck ? '🃏 Deck ready' : 'No deck'}
      </span>
      <span
        className={`text-xs px-2 py-0.5 rounded ${
          player.ready
            ? 'bg-phase-active text-board-bg'
            : 'bg-board-border text-card-dim'
        }`}
      >
        {player.ready ? 'READY' : 'NOT READY'}
      </span>
    </div>
  );
}
