import CardBack from '../card/CardBack.jsx';

/**
 * PersonnelStack — face-down pile of personnel (and equipment)
 * at a mission or on a planet surface.
 *
 * Deliberately reveals NO count or stopped information on the board —
 * that is private to the stack's owner and only visible via the inspect modal.
 *
 * The visual depth (offset card backs) indicates "more than one card" without
 * giving away the exact number.
 *
 * Props:
 *   hasCards    bool    true if the stack is non-empty (all we need to render)
 *   hasMultiple bool    show stacked-depth effect (2+ cards present)
 *   onClick     fn      open the inspect modal
 *   isYours     bool    affects hover accent colour only
 */
export default function PersonnelStack({
  hasCards = true,
  hasMultiple = false,
  onClick,
  isYours = true,
}) {
  if (!hasCards) return null;

  return (
    <button
      className="relative flex-shrink-0 cursor-pointer group
                 hover:brightness-125 transition-all duration-150"
      onClick={onClick}
      title="Personnel — click to inspect"
    >
      {/* Depth shadow cards (presence only, no count) */}
      {hasMultiple && (
        <>
          <div className="absolute top-1 left-1 w-10 h-14 rounded
                          border border-lcars-gold/20 bg-board-surface opacity-40" />
          <div className="absolute top-0.5 left-0.5 w-10 h-14 rounded
                          border border-lcars-gold/30 bg-board-surface opacity-60" />
        </>
      )}

      {/* Top card face-down */}
      <CardBack size="sm" />

      {/* Hover label */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity
                      bg-board-bg/70 rounded">
        <span className={`text-[8px] uppercase tracking-wider text-center px-1
                          ${isYours ? 'text-lcars-gold' : 'text-red-400'}`}>
          Inspect
        </span>
      </div>
    </button>
  );
}
