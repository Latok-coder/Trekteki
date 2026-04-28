/**
 * RemovedPile — cards removed from the game entirely.
 * Per the rulebook these are kept separate and returned to owner after the game.
 */
export default function RemovedPile({ count = 0 }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative w-14 h-20 rounded border border-board-border/40
                   bg-board-bg/50 overflow-hidden"
        title="Removed from game"
      >
        {count === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-board-border text-[8px] text-center leading-tight px-1">
              RFG
            </span>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 4px,#334155 4px,#334155 5px)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-card-dim text-xs font-bold">{count}</span>
            </div>
          </>
        )}
        <div className="absolute top-0 left-0 right-0 h-1 bg-board-border/60 rounded-t" />
      </div>
      <span className="text-card-dim text-[9px] uppercase tracking-wider">
        RFG · {count}
      </span>
    </div>
  );
}
