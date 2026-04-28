/**
 * DeckPile — shows the draw deck as a face-down stack with a card count.
 * Clicking triggers a draw action (when legal).
 */
export default function DeckPile({ count = 0, canDraw = false, onDraw }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        className={`
          relative w-16 h-24 rounded border
          ${canDraw
            ? 'border-lcars-gold/60 hover:border-lcars-gold cursor-pointer hover:brightness-125'
            : 'border-board-border cursor-default'}
          bg-gradient-to-br from-board-surface to-board-bg overflow-hidden
          transition-all duration-150 group
        `}
        onClick={canDraw ? onDraw : undefined}
        title={canDraw ? 'Draw a card (1 counter)' : 'Draw deck'}
        disabled={!canDraw || count === 0}
      >
        {/* Stacked depth effect */}
        <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded
                        border border-board-border bg-board-surface opacity-60" />
        <div className="absolute inset-0 translate-x-1 translate-y-1 rounded
                        border border-board-border bg-board-surface opacity-30" />

        {/* Top face */}
        <div className="absolute inset-0 rounded border border-lcars-gold/30
                        bg-gradient-to-br from-board-surface to-board-bg">
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 8px,#7c9cbf 8px,#7c9cbf 9px),repeating-linear-gradient(90deg,transparent,transparent 8px,#7c9cbf 8px,#7c9cbf 9px)',
            }}
          />
          {/* Delta */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 28" className="w-6 h-6 opacity-25 fill-lcars-gold">
              <polygon points="12,1 23,27 12,21 1,27" />
            </svg>
          </div>
          {/* Draw hint */}
          {canDraw && (
            <div className="absolute inset-0 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition-opacity bg-board-bg/60">
              <span className="text-lcars-gold text-[10px] font-bold">DRAW</span>
            </div>
          )}
        </div>

        {/* LCARS bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-lcars-gold/50 rounded-t" />
      </button>

      <span className="text-card-dim text-[10px] uppercase tracking-wider">
        Deck · {count}
      </span>
    </div>
  );
}
