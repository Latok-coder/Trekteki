import { create } from 'zustand';

const STORAGE_KEY = 'st-ccg-decks';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(decks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch {
    console.warn('[deckStore] Failed to save decks to localStorage');
  }
}

/**
 * useDeckStore — manages saved decks and the currently-edited deck.
 *
 * savedDecks   DeckList[]   persisted to localStorage
 * activeDeck   DeckList|null  deck currently open in the editor
 */
export const useDeckStore = create((set, get) => ({
  savedDecks:  loadFromStorage(),
  activeDeck:  null,

  // ── Active deck ────────────────────────────────────────────────────

  newDeck: () => set({
    activeDeck: {
      formatVersion: 1,
      id:          `deck-${Date.now()}`,
      name:        'New Deck',
      affiliation: '',
      missions:    [],
      deck:        [],
      dilemmas:    [],
    },
  }),

  loadDeck: (deckId) => {
    const deck = get().savedDecks.find(d => d.id === deckId) ?? null;
    set({ activeDeck: deck ? { ...deck } : null });
  },

  setActiveDeck: (deck) => set({ activeDeck: deck }),

  updateActiveName: (name) =>
    set(s => ({ activeDeck: s.activeDeck ? { ...s.activeDeck, name } : null })),

  // ── Card manipulation ──────────────────────────────────────────────

  addCard: (section, definitionId) => {
    const s = get();
    if (!s.activeDeck) return;
    const deck   = { ...s.activeDeck };
    const list   = [...deck[section]];
    const existing = list.find(e => e.definitionId === definitionId);

    if (existing) {
      existing.count = Math.min(existing.count + 1, 3);
    } else {
      list.push({ definitionId, count: 1 });
    }
    deck[section] = list;
    set({ activeDeck: deck });
  },

  removeCard: (section, definitionId) => {
    const s = get();
    if (!s.activeDeck) return;
    const deck = { ...s.activeDeck };
    const list = deck[section]
      .map(e => e.definitionId === definitionId ? { ...e, count: e.count - 1 } : e)
      .filter(e => e.count > 0);
    deck[section] = list;
    set({ activeDeck: deck });
  },

  setCardCount: (section, definitionId, count) => {
    const s = get();
    if (!s.activeDeck) return;
    const deck = { ...s.activeDeck };
    if (count <= 0) {
      deck[section] = deck[section].filter(e => e.definitionId !== definitionId);
    } else {
      const existing = deck[section].find(e => e.definitionId === definitionId);
      if (existing) {
        existing.count = Math.min(count, 3);
      } else {
        deck[section] = [...deck[section], { definitionId, count: Math.min(count, 3) }];
      }
    }
    set({ activeDeck: deck });
  },

  // ── Save / delete ──────────────────────────────────────────────────

  saveDeck: () => {
    const { activeDeck, savedDecks } = get();
    if (!activeDeck) return;
    const updated = activeDeck.updatedAt
      ? { ...activeDeck, updatedAt: new Date().toISOString() }
      : { ...activeDeck, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

    const existing = savedDecks.findIndex(d => d.id === updated.id);
    const next = existing >= 0
      ? savedDecks.map(d => d.id === updated.id ? updated : d)
      : [...savedDecks, updated];

    saveToStorage(next);
    set({ savedDecks: next, activeDeck: updated });
  },

  deleteDeck: (deckId) => {
    const next = get().savedDecks.filter(d => d.id !== deckId);
    saveToStorage(next);
    set(s => ({
      savedDecks: next,
      activeDeck: s.activeDeck?.id === deckId ? null : s.activeDeck,
    }));
  },

  // ── Import / Export ────────────────────────────────────────────────

  importDeck: (deckJson) => {
    try {
      const deck = typeof deckJson === 'string' ? JSON.parse(deckJson) : deckJson;
      deck.id = `deck-${Date.now()}`;
      deck.formatVersion = 1;
      set({ activeDeck: deck });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  exportDeckJson: () => {
    const { activeDeck } = get();
    if (!activeDeck) return null;
    return JSON.stringify(activeDeck, null, 2);
  },
}));
