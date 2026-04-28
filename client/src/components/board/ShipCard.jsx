import CardComponent from '../card/CardComponent.jsx';

/**
 * ShipCard — a ship card in play.
 *
 * Crew (personnel + equipment aboard) are NOT shown on the board.
 * Only visible information is:
 *   - The ship card itself (face-up — ships are always public)
 *   - Damage pips (public)
 *   - Remaining range (public, your ships only)
 *   - A subtle crew-present dot (indicates someone is aboard, no count)
 *
 * Clicking the ship opens the crew inspect modal (handled by parent).
 *
 * Props:
 *   ship          CardDefinition
 *   hasCrew       bool    someone is aboard (shows indicator dot)
 *   damage        0|1|2   damage cards on ship (3 = destroyed, handled upstream)
 *   rangeUsed     number
 *   stopped       bool
 *   isYours       bool
 *   onShipClick   fn      open crew inspect modal
 */
export default function ShipCard({
  ship,
  hasCrew = false,
  damage = 0,
  rangeUsed = 0,
  stopped = false,
  isYours = true,
  onShipClick,
}) {
  const rangeRemaining = ship ? Math.max(0, (ship.range ?? 0) - rangeUsed) : 0;
  const rangeTotal     = ship?.range ?? 0;

  return (
    <div className={`flex flex-col items-center gap-1 ${stopped ? 'opacity-60' : ''}`}>

      {/* Ship card */}
      <div className="relative">
        <CardComponent
          card={ship}
          size="md"
          stopped={stopped}
          onClick={onShipClick}
        />

        {/* Damage pips — bottom edge of card */}
        {damage > 0 && (
          <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-0.5 z-10">
            {Array.from({ length: damage }).map((_, i) => (
              <div key={i}
                   className="w-2 h-2 rounded-full bg-red-500 border border-red-300
                              shadow-sm shadow-red-900" />
            ))}
          </div>
        )}

        {/* Crew-present indicator — top-left corner dot */}
        {hasCrew && (
          <div
            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border
                        ${isYours
                          ? 'bg-lcars-blue border-lcars-blue/60'
                          : 'bg-red-500 border-red-400/60'}
                        shadow-sm`}
            title="Has crew aboard — click ship to inspect"
          />
        )}

        {/* Click-to-inspect hover hint */}
        {hasCrew && (
          <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-1
                          opacity-0 hover:opacity-100 transition-opacity
                          bg-board-bg/50 rounded">
            <span className="text-[8px] text-lcars-gold uppercase tracking-wider
                             bg-board-bg/80 px-1 rounded">
              Crew
            </span>
          </div>
        )}
      </div>

      {/* Range pips — your ships only, public info */}
      {isYours && rangeTotal > 0 && (
        <div className="flex flex-col items-center gap-0.5 w-16">
          <div className="flex gap-0.5 justify-center flex-wrap">
            {Array.from({ length: rangeTotal }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-sm transition-colors ${
                  i < rangeRemaining ? 'bg-cyan-400' : 'bg-board-border'
                }`}
              />
            ))}
          </div>
          <p className="text-[9px] text-card-dim">
            RNG {rangeRemaining}/{rangeTotal}
          </p>
        </div>
      )}

    </div>
  );
}
