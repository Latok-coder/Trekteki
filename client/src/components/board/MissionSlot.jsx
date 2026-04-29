import CardComponent from '../card/CardComponent.jsx';
import PersonnelStack from './PersonnelStack.jsx';
import ShipCard from './ShipCard.jsx';

const MISSION_TYPE_COLOR = {
  headquarters: 'border-lcars-gold/60',
  planet:       'border-amber-600/50',
  space:        'border-lcars-blue/50',
};

/**
 * MissionSlot — one column in a mission row.
 *
 * Layout is three fixed-height zones so the mission card always sits at the
 * same vertical position regardless of ships or personnel present:
 *
 *   ┌─────────────────────────┐  ← ABOVE ZONE  h-24, content pinned to bottom
 *   │  (ships / personnel)    │
 *   ├─────────────────────────┤  ← MISSION CARD  always here
 *   │  mission card           │
 *   ├─────────────────────────┤  ← BELOW ZONE  h-24, content pinned to top
 *   │  (ships / personnel)    │
 *   └─────────────────────────┘
 *
 * For your missions:   your ships/personnel go in BELOW, visiting enemy above
 * For opp missions:    their ships/personnel go in ABOVE, your visiting below
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

  // What lives in each zone
  // ABOVE: opponent's own ships+personnel (their stuff faces downward toward the lane)
  //        OR your visiting ships at opponent's mission
  // BELOW: your own ships+personnel
  //        OR enemy visiting ships at your mission
  const aboveShips     = isYours ? visitingShips : ships;
  const abovePersonnel = !isYours && hasPersonnel && missionType !== 'space';
  const belowShips     = isYours ? ships : visitingShips;
  const belowPersonnel = isYours && hasPersonnel && missionType !== 'space';

  const aboveHasContent = aboveShips.length > 0 || abovePersonnel;
  const belowHasContent = belowShips.length > 0 || belowPersonnel;

  return (
    <div className="flex flex-col items-center w-24">

      {/* ── ABOVE ZONE — fixed height, content sticks to bottom ── */}
      <div className="h-24 w-full flex flex-col justify-end items-center gap-1 pb-1">
        {abovePersonnel && (
          <PersonnelStack
            hasCards
            hasMultiple={hasMultiplePersonnel}
            onClick={onPersonnelClick}
            isYours={false}
          />
        )}
        {aboveShips.length > 0 && (
          <ShipGroup
            ships={aboveShips}
            isYours={isYours ? false : true}
            isVisiting={isYours}
            onShipClick={onShipClick}
          />
        )}
      </div>

      {/* ── MISSION CARD — always at fixed row ── */}
      <div className="relative flex-shrink-0">
        <div className={`rounded border ${borderClass}`}>
          <CardComponent card={mission} size="lg" onClick={onMissionClick} />
        </div>

        {/* Completed overlay */}
        {completed && (
          <div className="absolute inset-0 bg-lcars-gold/20 rounded border-2 border-lcars-gold
                          flex items-center justify-center pointer-events-none">
            <span className="text-lcars-gold font-bold text-[10px] uppercase tracking-wider
                             bg-board-bg/80 px-1.5 py-0.5 rounded">
              ✓ Done
            </span>
          </div>
        )}

        {/* Overcome dilemma count — sits just below the card */}
        {overcomeCount > 0 && (
          <div className="absolute -bottom-2.5 left-0 right-0 flex justify-center z-10">
            <div className="bg-red-900/80 border border-red-700 rounded-full px-1.5 py-0.5">
              <span className="text-red-300 text-[9px]">↓{overcomeCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── BELOW ZONE — fixed height, content sticks to top ── */}
      <div className="h-24 w-full flex flex-col justify-start items-center gap-1 pt-2">
        {belowShips.length > 0 && (
          <ShipGroup
            ships={belowShips}
            isYours={isYours ? true : false}
            isVisiting={!isYours}
            onShipClick={onShipClick}
          />
        )}
        {belowPersonnel && (
          <PersonnelStack
            hasCards
            hasMultiple={hasMultiplePersonnel}
            onClick={onPersonnelClick}
            isYours={true}
          />
        )}
      </div>

    </div>
  );
}

function ShipGroup({ ships, isYours, isVisiting = false, onShipClick }) {
  return (
    <div className="flex gap-1 justify-center flex-wrap">
      {isVisiting && (
        <div className="w-full text-center">
          <span className={`text-[8px] uppercase tracking-wider
                            ${isYours ? 'text-lcars-blue/50' : 'text-red-400/50'}`}>
            {isYours ? 'visiting' : 'enemy'}
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
