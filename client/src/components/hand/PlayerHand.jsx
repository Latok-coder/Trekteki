import CardComponent from '../card/CardComponent.jsx';
import CardBack from '../card/CardBack.jsx';

/**
 * PlayerHand — renders the active player's hand of cards.
 * Cards fan out on hover for easier reading.
 *
 * For the opponent we only show N face-down cards.
 */
export function PlayerHand({ cards = [], selectedId, onCardClick }) {
  return (
    <div className="flex items-end justify-center gap-1 px-4 py-2 min-h-[112px]
                    border-t border-board-border bg-board-bg/60 overflow-x-auto">
      {cards.length === 0 ? (
        <p className="text-card-dim text-xs italic self-center">No cards in hand</p>
      ) : (
        cards.map((card) => (
          <div
            key={card.instanceId}
            className="transition-transform duration-150 hover:-translate-y-3 flex-shrink-0"
          >
            <CardComponent
              card={card}
              size="hand"
              selected={card.instanceId === selectedId}
              onClick={() => onCardClick?.(card)}
            />
          </div>
        ))
      )}
    </div>
  );
}

/**
 * OpponentHandCount — shows N face-down cards for the opponent.
 */
export function OpponentHandCount({ count = 0 }) {
  const visible = Math.min(count, 7); // cap display at 7

  return (
    <div className="flex items-start justify-center gap-1 px-4 py-2 min-h-[72px]
                    border-b border-board-border bg-board-bg/60 overflow-x-auto">
      {count === 0 ? (
        <p className="text-card-dim text-xs italic self-center">No cards in hand</p>
      ) : (
        <>
          {Array.from({ length: visible }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <CardBack size="sm" />
            </div>
          ))}
          {count > visible && (
            <div className="self-center ml-1">
              <span className="text-card-dim text-xs">+{count - visible}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
