import CardComponent from '../card/CardComponent.jsx';
import PersonnelStack from './PersonnelStack.jsx';
import ShipCard from './ShipCard.jsx';

const MISSION_TYPE_COLOR = {
  headquarters: 'border-lcars-gold/60',
  planet:       'border-amber-600/50',
  space:        'border-lcars-blue/50',
};

const MISSION_TYPE_LABEL = {
};

/**
 * MissionSlot — one column in a mission row.
 *
 * Personnel counts are intentionally NOT passed down to PersonnelStack —
 * the board only knows "present" or "not present" and "more than one".
 * Actual counts and identities are only revealed in the inspect modal.
 *
 * Props:
 *   mission             CardDefinition
 *   completed           bool
 *   overcomeCount       number
 *   hasPersonnel        bool    any personnel on this planet surface
 *   hasMultiplePersonnel bool   more than one (for depth effect only)
 *   ships               []      { card, hasCrew, damage, rangeUsed, stopped }
 *   visitingShips       []      same shape, opponent's ships at your mission
 *   isYours             bool
 *   onMissionClick      fn
 *   onPersonnelClick    fn      opens inspect modal
 *   onShipClick         fn      opens crew inspect modal
 */
export default function MissionSlot({
  mission,
  completed = false,
  overcomeCount = 0,
  hasPersonnel = false,
  hasMultiplePersonnel = false,
  ships = [],
  visitingShips = [],
  isYours = true,
  onMissionClick,
  onPersonnelClick,
  onShipClick,
}) {
  const missionType = mission?.missionType ?? 'space';
  const borderClass = MISSION_TYPE_COLOR[missionType] ?? 'border-board-border';

  const ownerShipsAbove   = !isYours && ships.length > 0;
  const ownerShipsBelow   = isYours  && ships.length > 0;
  const visitorShipsAbove = isYours  && visitingShips.length > 0;
  const visitorShipsBelow = !isYours && visitingShips.length > 0;
  const personnelAbove    = !isYours && hasPersonnel && missionType !== 'space';
  const personnelBelow    = isYours  && hasPersonnel && missionType !== 'space';

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[80px]">

      {ownerShipsAbove && (
        <ShipGroup ships={ships} isYours={false} onShipClick={onShipClick} />
      )}
      {personnelAbove && (
        <PersonnelStack
          hasCards
          hasMultiple={hasMultiplePersonnel}
          onClick={onPersonnelClick}
          isYours={false}
        />
      )}
      {visitorShipsAbove && (
        <ShipGroup ships={visitingShips} isYours={true} isVisiting onShipClick={onShipClick} />
      )}

      {/* Mission card */}
      <div className="relative">
        <div className={`rounded border ${borderClass}`}>
          <CardComponent card={mission} size="lg" onClick={onMissionClick} />
        </div>

        <div className="absolute top-1.5 right-1.5 text-sm leading-none">
          {MISSION_TYPE_LABEL[missionType]}
        </div>

        {completed && (
          <div className="absolute inset-0 bg-lcars-gold/20 rounded border-2 border-lcars-gold
                          flex items-center justify-center">
            <span className="text-lcars-gold font-bold text-[10px] uppercase tracking-wider
                             bg-board-bg/80 px-1.5 py-0.5 rounded">
              ✓ Done
            </span>
          </div>
        )}

        {overcomeCount > 0 && (
          <div className="absolute -bottom-2 left-0 right-0 flex justify-center z-10">
            <div className="bg-red-900/80 border border-red-700 rounded-full px-1.5 py-0.5">
              <span className="text-red-300 text-[9px]">↓{overcomeCount}</span>
            </div>
          </div>
        )}
      </div>

      {personnelBelow && (
        <PersonnelStack
          hasCards
          hasMultiple={hasMultiplePersonnel}
          onClick={onPersonnelClick}
          isYours={true}
        />
      )}
      {ownerShipsBelow && (
        <ShipGroup ships={ships} isYours={true} onShipClick={onShipClick} />
      )}
      {visitorShipsBelow && (
        <ShipGroup ships={visitingShips} isYours={false} isVisiting onShipClick={onShipClick} />
      )}

    </div>
  );
}

function ShipGroup({ ships, isYours, isVisiting = false, onShipClick }) {
  return (
    <div className={`flex gap-1.5 justify-center flex-wrap ${isVisiting ? 'opacity-80' : ''}`}>
      {isVisiting && (
        <div className="w-full text-center">
          <span className={`text-[8px] uppercase tracking-wider
                            ${isYours ? 'text-lcars-blue/60' : 'text-red-400/60'}`}>
            {isYours ? '↑ visiting' : '↑ enemy'}
          </span>
        </div>
      )}
      {ships.map((s, i) => (
        <ShipCard
          key={i}
          ship={s.card}
          hasCrew={s.hasCrew ?? (s.aboardCount > 0)}
          damage={s.damage ?? 0}
          rangeUsed={s.rangeUsed ?? 0}
          stopped={s.stopped ?? false}
          isYours={isYours}
          onShipClick={() => onShipClick?.(s)}
        />
      ))}
    </div>
  );
}
