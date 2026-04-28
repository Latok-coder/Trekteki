/**
 * CounterBudget — shows 7 counter pips, greying out spent ones.
 * Only shown during the active player's Play & Draw phase.
 */
export default function CounterBudget({ remaining = 7, total = 7, isActive = false }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-card-dim text-[9px] uppercase tracking-wider">Counters</span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`
              w-3.5 h-3.5 rounded-full border transition-all duration-200
              ${i < remaining
                ? isActive
                  ? 'bg-lcars-gold border-lcars-gold shadow-sm shadow-lcars-gold/50'
                  : 'bg-lcars-gold/60 border-lcars-gold/60'
                : 'bg-board-border border-board-border opacity-40'}
            `}
          />
        ))}
      </div>
      <span className={`text-[9px] font-bold ${isActive ? 'text-lcars-gold' : 'text-card-dim'}`}>
        {remaining}/{total}
      </span>
    </div>
  );
}
