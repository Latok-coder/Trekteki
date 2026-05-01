import { useNavigate } from 'react-router-dom';

/**
 * DeckBuilderPage — Stage 1 shell.
 * Two-panel layout is stubbed out; panels will be filled in Stage 3 & 4.
 */
export default function DeckBuilderPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-board-bg">

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10
                      flex items-center gap-4 px-4 py-2
                      bg-board-surface border-b border-board-border">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          ← Back
        </button>
        <h1 className="text-lcars-gold font-bold uppercase tracking-widest text-sm">
          Deck Builder
        </h1>
        {/* Action buttons will go here in Stage 4/5 */}
        <div className="flex-1" />
        <span className="text-card-dim text-xs">Stage 1 — shell</span>
      </div>

      {/* ── Main content (offset by top bar) ── */}
      <div className="flex flex-1 pt-10 overflow-hidden">

        {/* Left panel — card browser (Stage 3) */}
        <div className="flex-1 flex flex-col border-r border-board-border overflow-hidden bg-board-bg">
          <div className="flex items-center justify-center h-full">
            <p className="text-card-dim text-sm italic">Card browser — coming in Stage 3</p>
          </div>
        </div>

        {/* Right panel — deck editor (Stage 4) */}
        <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden bg-board-surface">
          <div className="flex items-center justify-center h-full">
            <p className="text-card-dim text-sm italic">Deck editor — coming in Stage 4</p>
          </div>
        </div>

      </div>
    </div>
  );
}
