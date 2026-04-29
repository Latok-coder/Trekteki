import MissionSlot from './MissionSlot.jsx';

/**
 * MissionRow — 5 mission slots laid out horizontally with consistent spacing.
 *
 * Accepts either numeric counts (personnelCount / stoppedCount — from the game
 * engine) or boolean flags (hasPersonnel / hasMultiplePersonnel — from mock data).
 * Both are normalised here so MissionSlot stays clean.
 */
export default function MissionRow({ missions = [], isYours = true }) {
  return (
    <div className="flex items-start justify-center gap-3 px-2">
      {missions.map((m, i) => {
        const hasPersonnel         = m.hasPersonnel         ?? ((m.personnelCount ?? 0) > 0);
        const hasMultiplePersonnel = m.hasMultiplePersonnel ?? ((m.personnelCount ?? 0) > 1);

        return (
          <MissionSlot
            key={i}
            mission={m.mission}
            completed={m.completed}
            overcomeCount={m.overcomeCount}
            hasPersonnel={hasPersonnel}
            hasMultiplePersonnel={hasMultiplePersonnel}
            ships={m.ships ?? []}
            visitingShips={m.visitingShips ?? []}
            isYours={isYours}
            onMissionClick={m.onMissionClick}
            onPersonnelClick={m.onPersonnelClick}
            onShipClick={m.onShipClick}
          />
        );
      })}
    </div>
  );
}
