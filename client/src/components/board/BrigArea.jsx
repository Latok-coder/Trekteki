import CardComponent from '../card/CardComponent.jsx';

/**
 * BrigArea — opponent's personnel being held captive.
 */
export default function BrigArea({ captives = [], onCardClick }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-card-dim text-[9px] uppercase tracking-wider">Brig</span>
      <div className={`
        min-w-[72px] min-h-[40px] rounded border border-dashed border-red-900/50
        p-1 flex flex-wrap gap-1 bg-red-950/10
      `}>
        {captives.length === 0 ? (
          <span className="text-card-dim text-[9px] italic self-center mx-auto">Empty</span>
        ) : (
          captives.map((card) => (
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
