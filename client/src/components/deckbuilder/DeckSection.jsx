import { useState } from 'react';
import DeckCardRow from './DeckCardRow.jsx';

const SECTION_COLORS = {
  missions: 'text-lcars-gold  border-lcars-gold/30',
  deck:     'text-lcars-blue  border-lcars-blue/30',
  dilemmas: 'text-red-400     border-red-800/30',
};

const SECTION_LABELS = {
  missions: 'Missions',
  deck:     'Deck',
  dilemmas: 'Dilemmas',
};

const SECTION_LIMITS = {
  missions: 5,
  deck:     null,  // min 35
  dilemmas: null,  // min 20
};

/**
 * DeckSection — one collapsible section in the deck editor.
 *
 * Props:
 *   section      'missions' | 'deck' | 'dilemmas'
 *   entries      [{ definitionId, count }]
 *   cardDefs     { [id]: CardDefinition }  resolved card definitions
 *   onIncrement  fn(definitionId)
 *   onDecrement  fn(definitionId)
 *   onRemove     fn(definitionId)
 */
export default function DeckSection({
  section,
  entries = [],
  cardDefs = {},
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const totalCount = entries.reduce((n, e) => n + e.count, 0);
  const limit      = SECTION_LIMITS[section];
  const colorClass = SECTION_COLORS[section] ?? 'text-card-text border-board-border';
  const label      = SECTION_LABELS[section] ?? section;

  // For missions the "count" is just the number of distinct mission IDs
  const displayCount = section === 'missions' ? entries.length : totalCount;
  const displayLimit = section === 'missions' ? 5 : (section === 'deck' ? '35+' : '20+');

  // Sort entries: missions by title, others by cost desc then title
  const sorted = [...entries].sort((a, b) => {
    const ca = cardDefs[a.definitionId];
    const cb = cardDefs[b.definitionId];
    if (!ca || !cb) return 0;
    if (section !== 'missions') {
      const costDiff = (cb.cost ?? 0) - (ca.cost ?? 0);
      if (costDiff !== 0) return costDiff;
    }
    return ca.title.localeCompare(cb.title);
  });

  return (
    <div className={`border-b ${colorClass.split(' ')[1]}`}>
      {/* Section header */}
      <button
        className="w-full flex items-center justify-between px-3 py-2
                   hover:bg-board-accent/30 transition-colors"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass.split(' ')[0]}`}>
            {label}
          </span>
          <span className={`text-[10px] font-bold tabular-nums ${
            section === 'missions' && displayCount === 5 ? 'text-green-400' :
            section === 'deck'     && totalCount >= 35  ? 'text-green-400' :
            section === 'dilemmas' && totalCount >= 20  ? 'text-green-400' :
            'text-card-dim'
          }`}>
            {displayCount} / {displayLimit}
          </span>
        </div>
        <span className="text-card-dim text-[10px]">
          {collapsed ? '▶' : '▼'}
        </span>
      </button>

      {/* Card rows */}
      {!collapsed && (
        <div className="pb-1">
          {entries.length === 0 ? (
            <p className="px-3 py-2 text-[10px] text-card-dim italic">
              No {label.toLowerCase()} added yet.
            </p>
          ) : (
            sorted.map(entry => (
              <DeckCardRow
                key={entry.definitionId}
                definitionId={entry.definitionId}
                card={cardDefs[entry.definitionId] ?? null}
                count={entry.count}
                onIncrement={() => onIncrement(entry.definitionId)}
                onDecrement={() => onDecrement(entry.definitionId)}
                onRemove={()    => onRemove(entry.definitionId)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
