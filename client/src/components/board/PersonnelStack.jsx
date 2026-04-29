import CardBack from '../card/CardBack.jsx';

/**
 * PersonnelStack — face-down pile of personnel (and equipment)
 * at a mission or on a planet surface.
 *
 * Deliberately reveals NO count or stopped information on the board.
 *
 * The key rendering rule: all inner elements are pointer-events-none so
 * every click in the stack area reaches the outer button, not a child.
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
      {/* Depth shadow cards — pointer-events-none so they never block the button */}
      {hasMultiple && (
        <>
          <div className="absolute top-1 left-1 w-10 h-14 rounded
                          border border-lcars-gold/20 bg-board-surface
                          opacity-40 pointer-events-none" />
          <div className="absolute top-0.5 left-0.5 w-10 h-14 rounded
                          border border-lcars-gold/30 bg-board-surface
                          opacity-60 pointer-events-none" />
        </>
      )}

      {/* Top card face — pointer-events-none so clicks reach the button */}
      <div className="pointer-events-none">
        <CardBack size="sm" />
      </div>

      {/* Hover label */}
      <div className="absolute inset-0 flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity
                      bg-board-bg/70 rounded pointer-events-none">
        <span className={`text-[8px] uppercase tracking-wider text-center px-1
                          ${isYours ? 'text-lcars-gold' : 'text-red-400'}`}>
          Inspect
        </span>
      </div>
    </button>
  );
}
