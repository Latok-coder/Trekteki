import { useEffect, useState } from 'react';
import DeckSection from './DeckSection.jsx';
import DeckStats from './DeckStats.jsx';
import DeckValidationBar from './DeckValidationBar.jsx';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

/**
 * DeckList — right panel of the deck builder.
 *
 * Accepts an optional `cardDefs` prop pre-populated by the parent page.
 * Falls back to fetching missing definitions itself for any IDs not covered.
 */
export default function DeckList({
  deck,
  savedDecks = [],
  cardDefs: externalCardDefs = {},
  onNameChange,
  onIncrement,
  onDecrement,
  onRemove,
  onSave,
  onNew,
  onLoad,
  onDelete,
}) {
  // Local cache for any definitions the parent hasn't provided
  const [localDefs, setLocalDefs] = useState({});

  // Merge parent defs with locally fetched ones
  const cardDefs = { ...externalCardDefs, ...localDefs };

  useEffect(() => {
    if (!deck) return;
    const allIds = [
      ...deck.missions,
      ...deck.deck.map(e => e.definitionId),
      ...deck.dilemmas.map(e => e.definitionId),
    ];
    const missing = allIds.filter(id => id && !cardDefs[id]);
    if (missing.length === 0) return;

    Promise.all(
      missing.map(id =>
        fetch(`${SERVER}/api/cards/${id}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      const next = { ...localDefs };
      results.forEach((card, i) => { if (card) next[missing[i]] = card; });
      setLocalDefs(next);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

  // ── No active deck: saved deck list ───────────────────────────────
  if (!deck) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-board-border">
          <p className="text-lcars-gold text-xs font-bold uppercase tracking-widest">
            Your Decks
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {savedDecks.length === 0 ? (
            <p className="text-card-dim text-xs italic text-center mt-8">
              No saved decks yet.<br/>
              Create a new deck or import one.
            </p>
          ) : (
            savedDecks.map(d => {
              const deckCount    = d.deck.reduce((n, e) => n + e.count, 0);
              const dilemmaCount = d.dilemmas.reduce((n, e) => n + e.count, 0);
              return (
                <div key={d.id}
                     className="panel p-2 space-y-1 hover:border-lcars-blue/40
                                transition-colors">
                  <p className="text-lcars-blue text-xs font-bold truncate">{d.name}</p>
                  <p className="text-card-dim text-[10px]">
                    {d.missions.length}/5 missions · {deckCount} deck · {dilemmaCount} dilemmas
                  </p>
                  <div className="flex gap-1.5 mt-1">
                    <button
                      onClick={() => onLoad(d.id)}
                      className="btn-primary text-[10px] px-2 py-1 flex-1"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete "${d.name}"?`)) onDelete(d.id); }}
                      className="btn-danger text-[10px] px-2 py-1"
                      title="Delete deck"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex-shrink-0 p-3 border-t border-board-border">
          <button onClick={onNew} className="btn-primary w-full text-xs py-2">
            + New Deck
          </button>
        </div>
      </div>
    );
  }

  // ── Active deck: editor ────────────────────────────────────────────
  const missionEntries = deck.missions.map(id => ({ definitionId: id, count: 1 }));

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Deck name */}
      <div className="flex-shrink-0 px-3 pt-3 pb-2 border-b border-board-border">
        <input
          className="w-full bg-transparent border-b border-board-border
                     text-lcars-gold font-bold text-sm focus:outline-none
                     focus:border-lcars-gold/60 pb-0.5 transition-colors"
          value={deck.name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="Deck name…"
        />
        <p className="text-card-dim text-[10px] mt-1">
          {deck.affiliation
            ? deck.affiliation.charAt(0).toUpperCase() + deck.affiliation.slice(1)
            : 'No affiliation set'}
        </p>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        <DeckSection
          section="missions"
          entries={missionEntries}
          cardDefs={cardDefs}
          onIncrement={() => {}}
          onDecrement={id => onRemove('missions', id)}
          onRemove={id => onRemove('missions', id)}
        />
        <DeckSection
          section="deck"
          entries={deck.deck}
          cardDefs={cardDefs}
          onIncrement={id => onIncrement('deck', id)}
          onDecrement={id => onDecrement('deck', id)}
          onRemove={id => onRemove('deck', id)}
        />
        <DeckSection
          section="dilemmas"
          entries={deck.dilemmas}
          cardDefs={cardDefs}
          onIncrement={id => onIncrement('dilemmas', id)}
          onDecrement={id => onDecrement('dilemmas', id)}
          onRemove={id => onRemove('dilemmas', id)}
        />
        <DeckStats entries={deck.deck} cardDefs={cardDefs} />
      </div>

      {/* Validation + save */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-board-border space-y-3
                      bg-board-surface">
        <DeckValidationBar deck={deck} />
        <button onClick={onSave} className="btn-gold w-full text-xs py-2">
          Save Deck
        </button>
      </div>

    </div>
  );
}
