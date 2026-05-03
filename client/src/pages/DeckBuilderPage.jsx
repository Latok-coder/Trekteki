import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardBrowser from '../components/deckbuilder/CardBrowser.jsx';
import DeckList from '../components/deckbuilder/DeckList.jsx';
import DeckImportModal from '../components/deckbuilder/DeckImportModal.jsx';
import DeckExportModal from '../components/deckbuilder/DeckExportModal.jsx';
import { useDeckStore } from '../store/deckStore.js';

export default function DeckBuilderPage() {
  const navigate = useNavigate();
  const {
    activeDeck,
    newDeck,
    saveDeck,
    loadDeck,
    deleteDeck,
    closeActiveDeck,
    addCard,
    removeCard,
    setCardCount,
    updateActiveName,
    savedDecks,
    importDeck,
  } = useDeckStore();

  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // cardDefs cache — shared between DeckList and DeckExportModal
  const [cardDefs, setCardDefs] = useState({});
  const [cardIndex, setCardIndex] = useState([]);

  // Fetch full card list once for the import name-matcher
  useEffect(() => {
    const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    fetch(`${SERVER}/api/cards`)
      .then(r => r.json())
      .then(data => {
        setCardIndex(data.cards ?? []);
        const defs = {};
        for (const c of (data.cards ?? [])) defs[c.id] = c;
        setCardDefs(defs);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleIncrement(section, definitionId) { addCard(section, definitionId); }
  function handleDecrement(section, definitionId) { removeCard(section, definitionId); }
  function handleRemove(section, definitionId)    { setCardCount(section, definitionId, 0); }

  function handleImportConfirm(deck) {
    importDeck(deck);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-board-bg">

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10
                      flex items-center gap-3 px-4 py-2
                      bg-board-surface border-b border-board-border">
        <button onClick={() => navigate('/')} className="btn-secondary text-xs px-3 py-1.5">
          ← Back
        </button>

        <h1 className="text-lcars-gold font-bold uppercase tracking-widest text-sm">
          Deck Builder
        </h1>

        <div className="flex-1" />

        {/* Import — always available */}
        <button
          onClick={() => setImportOpen(true)}
          className="btn-secondary text-xs px-3 py-1.5"
        >
          ⬆ Import
        </button>

        {/* Export — only when a deck is open */}
        {activeDeck && (
          <>
            <button
              onClick={() => setExportOpen(true)}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              ⬇ Export
            </button>
            <span className="text-card-dim text-xs">
              Editing: <strong className="text-lcars-blue">{activeDeck.name}</strong>
            </span>
            <button onClick={closeActiveDeck} className="btn-secondary text-xs px-3 py-1.5">
              Close
            </button>
          </>
        )}
      </div>

      {/* ── Main two-panel layout ── */}
      <div className="flex flex-1 mt-10 overflow-hidden">

        {/* Left — card browser */}
        <div className="flex-1 flex flex-col border-r border-board-border overflow-hidden">
          <CardBrowser activeDeck={activeDeck} onAddCard={handleIncrement} />
        </div>

        {/* Right — deck editor */}
        <div className="w-72 flex-shrink-0 flex flex-col overflow-hidden bg-board-surface">
          <DeckList
            deck={activeDeck}
            savedDecks={savedDecks}
            cardDefs={cardDefs}
            onNameChange={updateActiveName}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onSave={saveDeck}
            onNew={newDeck}
            onLoad={loadDeck}
            onDelete={deleteDeck}
          />
        </div>

      </div>

      {/* ── Modals ── */}
      <DeckImportModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImportConfirm}
        cardIndex={cardIndex}
      />

      <DeckExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        deck={activeDeck}
        cardDefs={cardDefs}
      />

    </div>
  );
}
