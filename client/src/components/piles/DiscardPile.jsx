import { useState } from 'react';
import CardComponent from '../card/CardComponent.jsx';

/**
 * DiscardPile — shows the top card face-up and a count.
 * Clicking opens a browse modal (wired in Phase 7).
 */
export default function DiscardPile({ count = 0, topCard = null, onBrowse }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        className={`
          relative w-16 h-24 rounded border border-board-border
          bg-board-bg overflow-hidden transition-all duration-150
          ${onBrowse && count > 0 ? 'cursor-pointer hover:border-lcars-gold/60' : 'cursor-default'}
        `}
        onClick={count > 0 ? onBrowse : undefined}
        title="Discard pile (click to browse)"
        disabled={count === 0}
      >
        {count === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-card-dim text-[9px] uppercase tracking-wider text-center">
              Empty
            </span>
          </div>
        ) : (
          topCard && (
            <CardComponent
              card={topCard}
              size="md"
              className="w-full h-full"
            />
          )
        )}
      </button>

      <span className="text-card-dim text-[10px] uppercase tracking-wider">
        Discard · {count}
      </span>
    </div>
  );
}
