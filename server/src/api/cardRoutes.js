import { cardDB } from '../data/CardDatabase.js';

/**
 * registerCardRoutes — mounts all card-related REST endpoints on the
 * Express app. Called once at server startup after cardDB.load().
 *
 * Endpoints:
 *   GET /api/cards              search / list cards
 *   GET /api/cards/:id          single card by ID
 *   GET /api/decks              list starter decks
 *   GET /api/decks/:id          single starter deck
 */
export function registerCardRoutes(app) {

  // ── GET /api/cards ─────────────────────────────────────────────────
  // Query params: title, type, affiliation, set, skill, unique, costMax
  app.get('/api/cards', (req, res) => {
    try {
      const { title, type, affiliation, set, skill, costMax, unique } = req.query;

      const results = cardDB.search({
        title,
        type,
        affiliation,
        set,
        skill,
        costMax: costMax != null ? Number(costMax) : undefined,
        unique:  unique  != null ? unique === 'true' : undefined,
      });

      res.json({
        total: results.length,
        cards: results,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/cards/:id ─────────────────────────────────────────────
  app.get('/api/cards/:id', (req, res) => {
    const card = cardDB.getById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  });

  // ── GET /api/decks ─────────────────────────────────────────────────
  app.get('/api/decks', (_req, res) => {
    // Return deck summaries (no card lists — keep payload small)
    const decks = cardDB.getAllDecks().map(d => ({
      id:          d.id,
      name:        d.name,
      affiliation: d.affiliation,
      deckSize:    d.deck.reduce((n, e) => n + e.count, 0),
      dilemmaSize: d.dilemmas.reduce((n, e) => n + e.count, 0),
    }));
    res.json(decks);
  });

  // ── GET /api/decks/:id ─────────────────────────────────────────────
  app.get('/api/decks/:id', (req, res) => {
    const deck = cardDB.getDeck(req.params.id);
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json(deck);
  });
}
