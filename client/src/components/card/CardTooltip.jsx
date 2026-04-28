import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const AFFILIATION_COLORS = {
  federation: 'text-blue-400',
  klingon:    'text-red-400',
  romulan:    'text-green-400',
  cardassian: 'text-yellow-600',
  dominion:   'text-purple-400',
  bajoran:    'text-amber-400',
  borg:       'text-slate-300',
  ferengi:    'text-yellow-400',
  default:    'text-card-text',
};

/**
 * CardTooltip — a portal-based full card detail overlay.
 * Positioning is supplied by the parent via `pos { x, y }`.
 * The tooltip auto-flips left/right and up/down to stay on screen.
 */
export default function CardTooltip({ card, pos }) {
  const ref = useRef(null);

  // After render, clamp position so tooltip doesn't overflow viewport
  useEffect(() => {
    if (!ref.current || !pos) return;
    const el = ref.current;
    const { innerWidth, innerHeight } = window;
    const rect = el.getBoundingClientRect();

    let left = pos.x + 12;
    let top  = pos.y - 20;

    if (left + rect.width  > innerWidth  - 8) left = pos.x - rect.width  - 12;
    if (top  + rect.height > innerHeight - 8) top  = innerHeight - rect.height - 8;
    if (top < 8) top = 8;
    if (left < 8) left = 8;

    el.style.left = `${left}px`;
    el.style.top  = `${top}px`;
  }, [pos, card]);

  if (!card || !pos) return null;

  const affColor = AFFILIATION_COLORS[card.affiliation] ?? AFFILIATION_COLORS.default;

  return createPortal(
    <div
      ref={ref}
      className="fixed z-50 w-72 pointer-events-none"
      style={{ left: pos.x + 12, top: pos.y - 20 }}
    >
      <div className="
        bg-board-surface border border-lcars-gold/50 rounded-lg overflow-hidden
        shadow-2xl shadow-black/80 text-xs
      ">
        {/* Card image */}
        {card.imageUrl && (
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-36 object-cover object-top"
          />
        )}

        {/* Header strip */}
        <div className="px-3 pt-2 pb-1 border-b border-board-border">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`font-bold text-sm ${card.unique ? 'text-lcars-gold' : 'text-card-text'}`}>
                {card.unique ? '• ' : ''}{card.title}
              </span>
              {card.subtitle && (
                <p className="text-card-dim italic text-xs">{card.subtitle}</p>
              )}
            </div>
            {card.cost != null && (
              <span className="text-lcars-gold font-bold text-base leading-none mt-0.5 flex-shrink-0">
                {card.cost}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`uppercase tracking-wider text-[10px] ${affColor}`}>
              {card.affiliation ?? card.type}
            </span>
            {card.species && (
              <span className="text-card-dim text-[10px]">· {card.species}</span>
            )}
            {card.shipClass && (
              <span className="text-card-dim text-[10px]">· {card.shipClass}</span>
            )}
          </div>
        </div>

        {/* Skills (personnel) */}
        {card.skills?.length > 0 && (
          <div className="px-3 py-1.5 border-b border-board-border flex flex-wrap gap-1">
            {card.skills.map((s) => (
              <span key={s} className="
                px-1.5 py-0.5 rounded text-[10px] bg-board-accent
                text-lcars-blue border border-lcars-blue/30
              ">
                {card.skillLevels?.[s] > 1 ? `${card.skillLevels[s]} ` : ''}{s}
              </span>
            ))}
          </div>
        )}

        {/* Game text */}
        {card.gameText && (
          <div className="px-3 py-2 border-b border-board-border">
            <p className="text-card-text leading-relaxed whitespace-pre-line">
              {card.gameText}
            </p>
          </div>
        )}

        {/* Attributes row */}
        <AttributeRow card={card} />

        {/* Mission requirements */}
        {card.type === 'mission' && card.requirements && (
          <div className="px-3 py-1.5 bg-board-bg/50">
            <p className="text-card-dim text-[10px] uppercase tracking-wider mb-0.5">Requirements</p>
            <p className="text-card-text">{card.requirements}</p>
            {card.points && (
              <p className="text-lcars-gold font-bold mt-1">{card.points} pts</p>
            )}
          </div>
        )}

        {/* Collector info */}
        {card.collectorInfo && (
          <div className="px-3 py-1 bg-board-bg/80">
            <p className="text-card-dim text-[10px] text-right">{card.collectorInfo}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function AttributeRow({ card }) {
  if (card.type === 'personnel') {
    return (
      <div className="px-3 py-1.5 flex gap-3 bg-board-bg/50 border-b border-board-border">
        <Attr label="INT" value={card.integrity} color="text-green-400" />
        <Attr label="CUN" value={card.cunning}   color="text-blue-400" />
        <Attr label="STR" value={card.strength}  color="text-red-400" />
      </div>
    );
  }
  if (card.type === 'ship') {
    return (
      <div className="px-3 py-1.5 flex gap-3 bg-board-bg/50 border-b border-board-border">
        <Attr label="RNG" value={card.range}   color="text-cyan-400" />
        <Attr label="WPN" value={card.weapons} color="text-red-400" />
        <Attr label="SHD" value={card.shields} color="text-blue-400" />
      </div>
    );
  }
  return null;
}

function Attr({ label, value, color }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-card-dim text-[10px] uppercase">{label}</span>
      <span className={`font-bold text-sm ${color}`}>{value}</span>
    </div>
  );
}
