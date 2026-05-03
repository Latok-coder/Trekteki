import { useState } from 'react';
import CardTooltip from '../card/CardTooltip.jsx';

const TYPE_COLOR = {
  personnel: 'border-lcars-blue/40  bg-lcars-blue/5',
  ship:      'border-cyan-700/40    bg-cyan-900/10',
  equipment: 'border-amber-700/40   bg-amber-900/10',
  event:     'border-purple-700/40  bg-purple-900/10',
  interrupt: 'border-orange-700/40  bg-orange-900/10',
  mission:   'border-lcars-gold/40  bg-lcars-gold/5',
  dilemma:   'border-red-800/40     bg-red-950/20',
};

const TYPE_BADGE = {
  personnel: 'text-lcars-blue',
  ship:      'text-cyan-400',
  equipment: 'text-amber-400',
  event:     'text-purple-400',
  interrupt: 'text-orange-400',
  mission:   'text-lcars-gold',
  dilemma:   'text-red-400',
};

const AFFIL_DOT = {
  federation: 'bg-blue-500',
  klingon:    'bg-red-600',
  romulan:    'bg-green-600',
  cardassian: 'bg-yellow-600',
  dominion:   'bg-purple-600',
  bajoran:    'bg-amber-500',
  borg:       'bg-slate-400',
  ferengi:    'bg-yellow-400',
};

/**
 * BrowserCardTile — compact row tile used in the card browser grid.
 *
 * Shows: affiliation dot · title · subtitle · type badge · cost · add button
 * Hovering shows the full CardTooltip.
 * onAdd(card) is called when the + button is clicked.
 * countInDeck shows how many copies are already in the active deck.
 */
export default function BrowserCardTile({ card, countInDeck = 0, onAdd }) {
  const [tooltip, setTooltip] = useState(null);

  const atMax    = countInDeck >= 3;
  const typeStyle = TYPE_COLOR[card.type] ?? 'border-board-border bg-board-bg/30';
  const badgeColor = TYPE_BADGE[card.type] ?? 'text-card-dim';
  const dotColor   = AFFIL_DOT[card.affiliation] ?? 'bg-card-dim';

  return (
    <>
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 rounded border
          ${typeStyle}
          hover:brightness-110 transition-all duration-100
          cursor-default group
        `}
        onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseMove={e => tooltip && setTooltip({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Affiliation dot */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-bold truncate block
                            ${card.unique ? 'text-lcars-gold' : 'text-card-text'}`}>
            {card.unique ? '• ' : ''}{card.title}
          </span>
          {card.subtitle && (
            <span className="text-[10px] text-card-dim italic truncate block">
              {card.subtitle}
            </span>
          )}
        </div>

        {/* Type badge */}
        <span className={`text-[9px] uppercase tracking-wider flex-shrink-0 ${badgeColor}`}>
          {card.type}
        </span>

        {/* Cost */}
        {card.cost != null && (
          <span className="text-[10px] text-lcars-gold font-bold w-4 text-center flex-shrink-0">
            {card.cost}
          </span>
        )}

        {/* Count in deck */}
        <span className={`text-[10px] w-5 text-center flex-shrink-0 font-bold
                          ${countInDeck > 0 ? 'text-lcars-blue' : 'text-board-border'}`}>
          {countInDeck > 0 ? `×${countInDeck}` : ''}
        </span>

        {/* Add button */}
        <button
          onClick={() => !atMax && onAdd?.(card)}
          disabled={atMax}
          className={`
            w-5 h-5 rounded flex items-center justify-center flex-shrink-0
            text-xs font-bold border transition-all duration-100
            ${atMax
              ? 'border-board-border text-board-border cursor-not-allowed opacity-40'
              : 'border-lcars-gold/50 text-lcars-gold hover:bg-lcars-gold/20 cursor-pointer'}
          `}
          title={atMax ? 'Max 3 copies' : 'Add to deck'}
        >
          +
        </button>
      </div>

      {tooltip && <CardTooltip card={card} pos={tooltip} />}
    </>
  );
}
