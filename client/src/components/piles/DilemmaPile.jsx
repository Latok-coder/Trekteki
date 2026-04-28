/**
 * DilemmaP ile — separate dilemma pile, always face-down.
 * Shows count and a "face-up" count (already reached face-up cards at bottom).
 */
export default function DilemmaPile({ count = 0, faceUpCount = 0, isOpponent = false }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative w-16 h-24 rounded border border-red-900/50
                   bg-gradient-to-br from-red-950/40 to-board-bg overflow-hidden"
        title="Dilemma pile"
      >
        {/* Stacked depth effect */}
        <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 rounded
                        border border-red-900/30 bg-red-950/20 opacity-60" />

        {/* Face */}
        <div className="absolute inset-0 rounded border border-red-800/30
                        bg-gradient-to-br from-red-950/50 to-board-bg flex items-center justify-center">
          {/* Dilemma icon */}
          <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-30 fill-red-500">
            <path d="M12 2L2 19h20L12 2zm0 3l7.5 13h-15L12 5zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z"/>
          </svg>
        </div>

        {/* LCARS bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-800/60 rounded-t" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-900/40" />

        {/* Face-up indicator */}
        {faceUpCount > 0 && (
          <div className="absolute bottom-1.5 right-1 w-4 h-4 rounded-full
                          bg-red-900/80 border border-red-600/50 flex items-center justify-center">
            <span className="text-red-400 font-bold" style={{fontSize:'7px'}}>{faceUpCount}</span>
          </div>
        )}
      </div>

      <span className="text-card-dim text-[10px] uppercase tracking-wider">
        {isOpponent ? 'Opp. ' : ''}Dilemma · {count}
      </span>
    </div>
  );
}
