import { useMemo } from 'react';
import CardSearchBar from './CardSearchBar.jsx';
import CardBrowserFilters from './CardBrowserFilters.jsx';
import BrowserCardTile from './BrowserCardTile.jsx';
import { useCardSearch } from '../../hooks/useCardSearch.js';

// Which deck section a card type belongs to
function sectionForType(type) {
  if (type === 'mission')  return 'missions';
  if (type === 'dilemma')  return 'dilemmas';
  return 'deck';
}

/**
 * CardBrowser — the left panel of the Deck Builder.
 *
 * Props:
 *   activeDeck    object|null   the deck currently being edited
 *   onAddCard     fn(section, definitionId)
 */
export default function CardBrowser({ activeDeck, onAddCard }) {
  const { cards, total, loading, error, filters, setFilter } = useCardSearch();

  // Build a quick lookup: definitionId → count already in active deck
  const deckCounts = useMemo(() => {
    if (!activeDeck) return {};
    const counts = {};
    for (const section of ['missions', 'deck', 'dilemmas']) {
      for (const entry of (activeDeck[section] ?? [])) {
        counts[entry.definitionId] = (counts[entry.definitionId] ?? 0) + entry.count;
      }
    }
    return counts;
  }, [activeDeck]);

  function handleAdd(card) {
    const section = sectionForType(card.type);
    onAddCard?.(section, card.id);
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Search + filters bar ── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-board-border space-y-2">
        <CardSearchBar
          value={filters.title}
          onChange={v => setFilter('title', v)}
        />
        <CardBrowserFilters filters={filters} onFilter={setFilter} />

        {/* Result count */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-card-dim">
            {loading ? 'Searching…' : `${total} card${total !== 1 ? 's' : ''}`}
          </span>
          {!activeDeck && (
            <span className="text-[10px] text-lcars-gold/70 italic">
              Open or create a deck to add cards
            </span>
          )}
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">

        {/* Error state */}
        {error && (
          <div className="panel border-klingon text-klingon text-xs p-3">
            Failed to load cards: {error}
            <p className="text-card-dim mt-1">
              Make sure the server is running at localhost:3001
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}
                   className="h-8 rounded border border-board-border bg-board-surface/40
                              animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && cards.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-card-dim text-sm italic">No cards match your search.</p>
          </div>
        )}

        {/* Card tiles */}
        {!loading && !error && cards.map(card => (
          <BrowserCardTile
            key={card.id}
            card={card}
            countInDeck={deckCounts[card.id] ?? 0}
            onAdd={activeDeck ? handleAdd : undefined}
          />
        ))}
      </div>

    </div>
  );
}
