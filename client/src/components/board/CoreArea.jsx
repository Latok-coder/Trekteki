import CardComponent from '../card/CardComponent.jsx';

/**
 * CoreArea — displays events currently in play in a player's core.
 */
export default function CoreArea({ events = [], onCardClick }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-card-dim text-[9px] uppercase tracking-wider">Core</span>
      <div className={`
        min-w-[72px] min-h-[40px] rounded border border-dashed border-board-border
        p-1 flex flex-wrap gap-1 bg-board-bg/30
      `}>
        {events.length === 0 ? (
          <span className="text-card-dim text-[9px] italic self-center mx-auto">Empty</span>
        ) : (
          events.map((card) => (
            <CardComponent
              key={card.instanceId}
              card={card}
              size="sm"
              onClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
