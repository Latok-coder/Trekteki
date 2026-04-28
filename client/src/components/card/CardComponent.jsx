import { useState, useCallback } from 'react';
import CardBack from './CardBack.jsx';
import CardTooltip from './CardTooltip.jsx';

const TYPE_BORDER = {
  personnel:  'border-lcars-blue/60',
  ship:       'border-cyan-600/60',
  equipment:  'border-amber-600/60',
  event:      'border-purple-600/60',
  interrupt:  'border-orange-500/60',
  mission:    'border-lcars-gold/60',
  dilemma:    'border-red-700/60',
};

const TYPE_BADGE = {
  personnel:  'bg-lcars-blue/20 text-lcars-blue',
  ship:       'bg-cyan-900/40 text-cyan-400',
  equipment:  'bg-amber-900/40 text-amber-400',
  event:      'bg-purple-900/40 text-purple-400',
  interrupt:  'bg-orange-900/40 text-orange-400',
  mission:    'bg-lcars-gold/20 text-lcars-gold',
  dilemma:    'bg-red-900/40 text-red-400',
};

/**
 * CardComponent — renders a single card instance.
 *
 * Props:
 *   card          CardDefinition | null   full card data (face-up)
 *   faceDown      bool                    render as CardBack
 *   size          'sm' | 'md' | 'lg'
 *   selected      bool                    highlight border
 *   stopped       bool                    dim + rotate slightly
 *   onClick       fn(card)
 *   className     string
 */
export default function CardComponent({
  card,
  faceDown = false,
  size = 'md',
  selected = false,
  stopped = false,
  onClick,
  className = '',
}) {
  const [tooltip, setTooltip] = useState(null); // { x, y } | null

  const handleMouseEnter = useCallback((e) => {
    if (faceDown || !card) return;
    setTooltip({ x: e.clientX, y: e.clientY });
  }, [faceDown, card]);

  const handleMouseMove = useCallback((e) => {
    if (tooltip) setTooltip({ x: e.clientX, y: e.clientY });
  }, [tooltip]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  if (faceDown || !card) {
    return <CardBack size={size} className={className} />;
  }

  const sizes = {
    sm:   'w-10 h-14 text-[8px]',
    md:   'w-16 h-24 text-[9px]',
    lg:   'w-20 h-28 text-[10px]',
  };

  const borderColor = selected
    ? 'border-lcars-gold shadow-lcars-gold/40 shadow-md'
    : (TYPE_BORDER[card.type] ?? 'border-board-border');

  return (
    <>
      <div
        className={`
          ${sizes[size] ?? sizes.md}
          ${className}
          relative rounded border ${borderColor}
          bg-gradient-to-b from-board-surface to-board-bg
          overflow-hidden flex-shrink-0 select-none
          transition-all duration-150
          ${onClick ? 'cursor-pointer hover:brightness-125 hover:-translate-y-0.5' : 'cursor-default'}
          ${stopped ? 'opacity-50 rotate-3' : ''}
        `}
        onClick={() => onClick?.(card)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* LCARS top bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          TYPE_BADGE[card.type]?.includes('bg-') 
            ? TYPE_BADGE[card.type].split(' ')[0].replace('/20','/80').replace('/40','/80') 
            : 'bg-lcars-gold/60'
        }`} />

        {/* Card image (if available) */}
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-2/3 object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-2/3 bg-board-accent/30 flex items-center justify-center">
            <span className="text-card-dim text-[8px] uppercase tracking-wider text-center px-1">
              {card.type}
            </span>
          </div>
        )}

        {/* Title area */}
        <div className="absolute bottom-0 left-0 right-0 bg-board-bg/90 px-1 py-0.5">
          <p className="truncate font-bold leading-tight text-card-text">
            {card.unique ? '• ' : ''}{card.title}
          </p>
          {/* Attributes inline for personnel/ship */}
          {card.type === 'personnel' && (
            <p className="text-card-dim leading-tight">
              {card.integrity}/{card.cunning}/{card.strength}
            </p>
          )}
          {card.type === 'ship' && (
            <p className="text-card-dim leading-tight">
              R{card.range} W{card.weapons} S{card.shields}
            </p>
          )}
          {card.type === 'mission' && card.points && (
            <p className="text-lcars-gold font-bold leading-tight">{card.points}pts</p>
          )}
        </div>

        {/* Cost badge */}
        {card.cost != null && (
          <div className="absolute top-1.5 left-1 w-4 h-4 rounded-full bg-board-bg/80
                          flex items-center justify-center border border-lcars-gold/50">
            <span className="text-lcars-gold font-bold leading-none" style={{fontSize:'7px'}}>
              {card.cost}
            </span>
          </div>
        )}

        {/* Stopped indicator */}
        {stopped && (
          <div className="absolute inset-0 border-2 border-red-500/40 rounded" />
        )}
      </div>

      {/* Tooltip rendered into portal */}
      {tooltip && <CardTooltip card={card} pos={tooltip} />}
    </>
  );
}
