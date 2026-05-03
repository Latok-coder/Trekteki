/**
 * DeckStats — compact cost curve bar chart for the deck editor.
 * Shows how many cards of each cost (0–6+) are in the deck.
 *
 * Props:
 *   entries   [{ definitionId, count }]   deck section entries only (not missions/dilemmas)
 *   cardDefs  { [id]: CardDefinition }
 */
export default function DeckStats({ entries = [], cardDefs = {} }) {
  if (entries.length === 0) return null;

  // Build cost buckets 0–6 (6 = "6+")
  const buckets = Array(7).fill(0);
  for (const entry of entries) {
    const card = cardDefs[entry.definitionId];
    if (!card) continue;
    const cost = Math.min(card.cost ?? 0, 6);
    buckets[cost] += entry.count;
  }

  const maxCount = Math.max(...buckets, 1);

  return (
    <div className="px-3 py-2 border-b border-board-border">
      <p className="text-[9px] uppercase tracking-widest text-card-dim mb-2">
        Cost curve
      </p>
      <div className="flex items-end gap-1 h-10">
        {buckets.map((count, cost) => (
          <div key={cost} className="flex-1 flex flex-col items-center gap-0.5">
            {/* Bar */}
            <div
              className="w-full rounded-sm bg-lcars-blue/50 transition-all duration-300"
              style={{ height: `${Math.round((count / maxCount) * 32)}px` }}
              title={`Cost ${cost === 6 ? '6+' : cost}: ${count} cards`}
            />
            {/* Count label (only if non-zero) */}
            {count > 0 && (
              <span className="text-[8px] text-card-dim leading-none">{count}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-0.5">
        {buckets.map((_, cost) => (
          <span key={cost} className="flex-1 text-center text-[8px] text-board-border">
            {cost === 6 ? '6+' : cost}
          </span>
        ))}
      </div>
    </div>
  );
}
