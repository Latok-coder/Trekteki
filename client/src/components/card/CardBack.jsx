/**
 * CardBack — generic face-down card.
 * Used for opponent's hand cards, face-down personnel/equipment stacks,
 * and any card whose identity is hidden from the viewing player.
 */
export default function CardBack({ size = 'md', className = '' }) {
  const sizes = {
    sm:   'w-10 h-14',
    md:   'w-16 h-24',
    lg:   'w-20 h-28',
    hand: 'w-20 h-28',
  };

  return (
    <div
      className={`
        ${sizes[size] ?? sizes.md}
        ${className}
        relative rounded border border-lcars-gold/40
        bg-gradient-to-br from-board-surface to-board-bg
        overflow-hidden flex-shrink-0 cursor-default select-none
      `}
    >
      {/* LCARS corner bar top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-lcars-gold/60 rounded-t" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 8px,#7c9cbf 8px,#7c9cbf 9px), repeating-linear-gradient(90deg,transparent,transparent 8px,#7c9cbf 8px,#7c9cbf 9px)',
        }}
      />

      {/* Centre delta/emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 28" className="w-5 h-5 opacity-30 fill-lcars-gold">
          <polygon points="12,1 23,27 12,21 1,27" />
        </svg>
      </div>

      {/* LCARS corner bar bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-lcars-blue/50 rounded-b" />
    </div>
  );
}
