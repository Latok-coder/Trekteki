import { useState } from 'react';
import CardTooltip from '../card/CardTooltip.jsx';

/**
 * DeckCardRow — one card entry in the deck editor.
 *
 * Shows: count · title · – / + controls · remove (×)
 * Hovering shows full CardTooltip.
 *
 * Props:
 *   card        CardDefinition   full card object (may be null if definition not loaded yet)
 *   definitionId string
 *   count       number
 *   onIncrement fn()
 *   onDecrement fn()
 *   onRemove    fn()
 */
export default function DeckCardRow({
  card,
  definitionId,
  count,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const [tooltip, setTooltip] = useState(null);

  const title = card?.title ?? definitionId;
  const atMax = count >= 3;
  const atMin = count <= 1;

  return (
    <>
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded
                   hover:bg-board-accent/40 transition-colors group"
        onMouseEnter={e => card && setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseMove={e => tooltip && setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Count badge */}
        <span className={`
          w-5 h-5 rounded flex items-center justify-center flex-shrink-0
          text-[10px] font-bold border
          ${count >= 3
            ? 'bg-lcars-gold/20 border-lcars-gold/50 text-lcars-gold'
            : 'bg-board-surface border-board-border text-card-dim'}
        `}>
          {count}
        </span>

        {/* Title */}
        <span className={`flex-1 text-xs truncate min-w-0
                          ${card?.unique ? 'text-lcars-gold' : 'text-card-text'}`}>
          {card?.unique ? '• ' : ''}{title}
        </span>

        {/* – / + controls (visible on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100
                        transition-opacity flex-shrink-0">
          <button
            onClick={onDecrement}
            disabled={atMin}
            className="w-4 h-4 rounded border border-board-border text-card-dim
                       hover:border-lcars-blue/50 hover:text-lcars-blue
                       disabled:opacity-30 disabled:cursor-not-allowed
                       text-[10px] flex items-center justify-center transition-colors"
            title="Remove one copy"
          >
            −
          </button>
          <button
            onClick={onIncrement}
            disabled={atMax}
            className="w-4 h-4 rounded border border-board-border text-card-dim
                       hover:border-lcars-gold/50 hover:text-lcars-gold
                       disabled:opacity-30 disabled:cursor-not-allowed
                       text-[10px] flex items-center justify-center transition-colors"
            title="Add one copy"
          >
            +
          </button>
        </div>

        {/* Remove entirely */}
        <button
          onClick={onRemove}
          className="w-4 h-4 flex items-center justify-center flex-shrink-0
                     text-card-dim hover:text-klingon opacity-0 group-hover:opacity-100
                     transition-all text-[10px]"
          title="Remove from deck"
        >
          ×
        </button>
      </div>

      {tooltip && <CardTooltip card={card} pos={tooltip} />}
    </>
  );
}
