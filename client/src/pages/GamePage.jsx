import { useParams } from 'react-router-dom';

/**
 * GamePage — placeholder until Phase 5 (game board).
 * Confirms the room code was received and the routing works.
 */
export default function GamePage() {
  const { code } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="panel text-center space-y-2">
        <h2 className="text-federation text-xl tracking-widest">GAME STARTING</h2>
        <p className="text-card-dim text-sm">Room: {code}</p>
        <p className="text-card-dim text-xs mt-4">
          Board UI coming in Phase 2. Both players are connected ✓
        </p>
      </div>
    </div>
  );
}
