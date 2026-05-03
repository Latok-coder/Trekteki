/**
 * DeckValidationBar — shows pass/fail status for every deck construction rule.
 * Derived entirely from the activeDeck object — no server call needed.
 */
export default function DeckValidationBar({ deck }) {
  if (!deck) return null;

  const deckCount    = deck.deck.reduce((n, e) => n + e.count, 0);
  const dilemmaCount = deck.dilemmas.reduce((n, e) => n + e.count, 0);
  const missionCount = deck.missions.length;

  const nonHqMissions = deck.missions.filter(id => {
    // We can only check this properly once we have card definitions available.
    // For now mark as unknown — the server re-validates before game start.
    return true; // optimistic; server enforces strictly
  }).length;

  // Count copies per title (ignoring subtitles — rulebook rule)
  // We only have IDs here so title checking is done server-side;
  // locally we check the simpler per-ID rule (max 3 per definitionId).
  const maxCopiesOk = (() => {
    const all = [
      ...deck.missions.map(id => ({ definitionId: id, count: 1 })),
      ...deck.deck,
      ...deck.dilemmas,
    ];
    return all.every(e => e.count <= 3);
  })();

  const rules = [
    {
      id:      'missions',
      label:   'Exactly 5 missions',
      ok:      missionCount === 5,
      detail:  `${missionCount}/5`,
    },
    {
      id:      'deck-min',
      label:   'At least 35 deck cards',
      ok:      deckCount >= 35,
      detail:  `${deckCount} cards`,
    },
    {
      id:      'dilemmas-min',
      label:   'At least 20 dilemmas',
      ok:      dilemmaCount >= 20,
      detail:  `${dilemmaCount} dilemmas`,
    },
    {
      id:      'max-copies',
      label:   'Max 3 copies per card',
      ok:      maxCopiesOk,
      detail:  maxCopiesOk ? 'OK' : 'Exceeded',
    },
  ];

  const allOk = rules.every(r => r.ok);

  return (
    <div className="space-y-1">
      {/* Summary badge */}
      <div className={`
        flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold
        uppercase tracking-wider
        ${allOk
          ? 'bg-green-900/30 border border-green-700/50 text-green-400'
          : 'bg-red-900/20 border border-red-800/50 text-red-400'}
      `}>
        <span>{allOk ? '✓' : '✗'}</span>
        <span>{allOk ? 'Deck is legal' : 'Deck is not legal'}</span>
      </div>

      {/* Individual rules */}
      {rules.map(rule => (
        <div key={rule.id}
             className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-[10px] flex-shrink-0 ${
              rule.ok ? 'text-green-400' : 'text-red-400'
            }`}>
              {rule.ok ? '✓' : '✗'}
            </span>
            <span className="text-[10px] text-card-dim truncate">
              {rule.label}
            </span>
          </div>
          <span className={`text-[10px] flex-shrink-0 font-bold ${
            rule.ok ? 'text-green-400' : 'text-red-400'
          }`}>
            {rule.detail}
          </span>
        </div>
      ))}
    </div>
  );
}
