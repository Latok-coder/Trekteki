import MissionSlot from './MissionSlot.jsx';

/**
 * MissionRow — 5 mission slots in a horizontal row.
 * Each slot receives both `ships` (owner's) and `visitingShips` (opponent's)
 * so ships from either side can be shown at any mission.
 */
export default function MissionRow({ missions = [], isYours = true }) {
  return (
    <div className="relative flex items-start justify-center gap-0 min-h-[160px]">
      {/* Connecting spacelane */}
      <div className={`
        absolute top-[60px] left-4 right-4 h-px pointer-events-none
        ${isYours ? 'bg-lcars-blue/15' : 'bg-red-900/15'}
      `} />

      {missions.map((m, i) => (
        <div key={i} className="flex items-start">
          <MissionSlot
            mission={m.mission}
            completed={m.completed}
            overcomeCount={m.overcomeCount}
            personnelCount={m.personnelCount}
            stoppedCount={m.stoppedCount}
            ships={m.ships ?? []}
            visitingShips={m.visitingShips ?? []}
            isYours={isYours}
            onMissionClick={m.onMissionClick}
            onPersonnelClick={m.onPersonnelClick}
            onShipClick={m.onShipClick}
            onCrewClick={m.onCrewClick}
          />
          {i < missions.length - 1 && (
            <div className="flex-shrink-0 w-6 flex items-center justify-center"
                 style={{ marginTop: '60px' }}>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
