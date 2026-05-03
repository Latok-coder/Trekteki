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
 * Deck shape:
 *   missions   string[]                     plain IDs, max 5, always unique
 *   deck       { definitionId, count }[]    max 3 copies per title
 *   dilemmas   { definitionId, count }[]    max 3 copies per title
 *
 * Missions are intentionally kept as a plain string array because the
 * rulebook treats each mission as appearing exactly once — there is no
 * "count" concept for missions.
 */

export const useDeckStore = create((set, get) => ({
  savedDecks:  loadFromStorage(),
  activeDeck:  null,

  // ── Active deck lifecycle ──────────────────────────────────────────

  newDeck: () => set({
    activeDeck: {
      formatVersion: 1,
      id:          `deck-${Date.now()}`,
      name:        'New Deck',
      affiliation: '',
      missions:    [],   // string[]
      deck:        [],   // { definitionId, count }[]
      dilemmas:    [],   // { definitionId, count }[]
    },
  }),

  loadDeck: (deckId) => {
    const deck = get().savedDecks.find(d => d.id === deckId) ?? null;
    set({ activeDeck: deck ? structuredClone(deck) : null });
  },

  updateActiveName: (name) =>
    set(s => ({ activeDeck: s.activeDeck ? { ...s.activeDeck, name } : null })),

  // ── Card manipulation ──────────────────────────────────────────────

  /**
   * addCard(section, definitionId)
   * Missions: push the plain ID (string) if not already present, max 5
   * Deck/Dilemmas: increment count (max 3) or push new entry
   */
  addCard: (section, definitionId) => {
    const s = get();
    if (!s.activeDeck) return;
    const deck = structuredClone(s.activeDeck);

    if (section === 'missions') {
      if (!deck.missions.includes(definitionId) && deck.missions.length < 5) {
        deck.missions = [...deck.missions, definitionId];
      }
    } else {
      const list     = deck[section];
      const existing = list.find(e => e.definitionId === definitionId);
      if (existing) {
        existing.count = Math.min(existing.count + 1, 3);
      } else {
        list.push({ definitionId, count: 1 });
      }
    }

    set({ activeDeck: deck });
  },

  /**
   * removeCard(section, definitionId)
   * Missions: remove the ID from the string array
   * Deck/Dilemmas: decrement count; remove entry when it reaches 0
   */
  removeCard: (section, definitionId) => {
    const s = get();
    if (!s.activeDeck) return;
    const deck = structuredClone(s.activeDeck);

    if (section === 'missions') {
      deck.missions = deck.missions.filter(id => id !== definitionId);
    } else {
      deck[section] = deck[section]
        .map(e => e.definitionId === definitionId
          ? { ...e, count: e.count - 1 }
          : e)
        .filter(e => e.count > 0);
    }

    set({ activeDeck: deck });
  },

  /**
   * setCardCount(section, definitionId, count)
   * Missions: count 0 = remove, count 1 = add (idempotent)
   * Deck/Dilemmas: set exact count, 0 removes the entry
   */
  setCardCount: (section, definitionId, count) => {
    const s = get();
    if (!s.activeDeck) return;
    const deck = structuredClone(s.activeDeck);

    if (section === 'missions') {
      if (count <= 0) {
        deck.missions = deck.missions.filter(id => id !== definitionId);
      } else if (!deck.missions.includes(definitionId)) {
        deck.missions = [...deck.missions, definitionId];
      }
    } else {
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
    }

    set({ activeDeck: deck });
  },

  // ── Save / delete ──────────────────────────────────────────────────

  saveDeck: () => {
    const { activeDeck, savedDecks } = get();
    if (!activeDeck) return;

    const now     = new Date().toISOString();
    const updated = {
      ...activeDeck,
      updatedAt: now,
      createdAt: activeDeck.createdAt ?? now,
    };

    const exists = savedDecks.findIndex(d => d.id === updated.id);
    const next   = exists >= 0
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

  closeActiveDeck: () => set({ activeDeck: null }),

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
