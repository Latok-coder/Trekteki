import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFS_DIR = join(__dirname, "cards", "definitions");
const DECKS_DIR = join(__dirname, "cards", "decks");

/**
 * CardDatabase — singleton that loads all card definitions at startup
 * and exposes fast lookup indexes.
 *
 * Indexes built:
 *   byId          { id → CardDefinition }
 *   byTitle       { normalisedTitle → CardDefinition[] }
 *   byType        { type → CardDefinition[] }
 *   byAffiliation { affiliation → CardDefinition[] }
 *   bySet         { set → CardDefinition[] }
 *   bySkill       { skill → CardDefinition[] }
 */
export class CardDatabase {
  constructor() {
    this.cards = new Map(); // id → definition
    this.byTitle = new Map();
    this.byType = new Map();
    this.byAffiliation = new Map();
    this.bySet = new Map();
    this.bySkill = new Map();
    this.decks = new Map(); // deckId → deck list
    this._loaded = false;
  }

  /** Load all cards from disk. Call once at server startup. */
  load() {
    if (this._loaded) return this;

    // Read master index
    const indexPath = join(DEFS_DIR, "index.json");
    const index = JSON.parse(readFileSync(indexPath, "utf8"));

    for (const entry of index) {
      try {
        const filePath = join(DEFS_DIR, entry.file);
        const card = JSON.parse(readFileSync(filePath, "utf8"));
        this._index(card);
      } catch (err) {
        console.warn(
          `[CardDatabase] Failed to load ${entry.file}: ${err.message}`,
        );
      }
    }

    // Load starter deck lists
    for (const file of readdirSync(DECKS_DIR)) {
      if (!file.endsWith(".json")) continue;
      try {
        const deck = JSON.parse(readFileSync(join(DECKS_DIR, file), "utf8"));
        this.decks.set(deck.id, deck);
      } catch (err) {
        console.warn(
          `[CardDatabase] Failed to load deck ${file}: ${err.message}`,
        );
      }
    }

    this._loaded = true;
    console.log(
      `[CardDatabase] Loaded ${this.cards.size} cards, ` +
        `${this.decks.size} starter decks`,
    );
    return this;
  }

  // ── Queries ─────────────────────────────────────────────────────────

  getById(id) {
    return this.cards.get(id) ?? null;
  }

  getDeck(deckId) {
    return this.decks.get(deckId) ?? null;
  }

  getAllDecks() {
    return Array.from(this.decks.values());
  }

  /**
   * search({ title, type, affiliation, set, skill, unique, costMax })
   * Returns array of matching CardDefinitions.
   */
  search({ title, type, affiliation, set, skill, unique, costMax } = {}) {
    let results = Array.from(this.cards.values());

    if (title) {
      const q = title.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.subtitle ?? "").toLowerCase().includes(q),
      );
    }
    if (type) results = results.filter((c) => c.type === type);
    if (affiliation)
      results = results.filter((c) => c.affiliation === affiliation);
    if (set) results = results.filter((c) => c.set === set);
    if (skill) results = results.filter((c) => c.skills?.includes(skill));
    if (unique != null) results = results.filter((c) => c.unique === unique);
    if (costMax != null)
      results = results.filter((c) => (c.cost ?? 0) <= costMax);

    return results;
  }

  /** All cards sharing the same base title (personae). */
  getPersonae(title) {
    return this.byTitle.get(title.toLowerCase()) ?? [];
  }

  /** All card definitions as a plain array. */
  getAll() {
    return Array.from(this.cards.values());
  }

  // ── Private ─────────────────────────────────────────────────────────

  _index(card) {
    this.cards.set(card.id, card);

    // by title
    const tkey = card.title.toLowerCase();
    if (!this.byTitle.has(tkey)) this.byTitle.set(tkey, []);
    this.byTitle.get(tkey).push(card);

    // by type
    const type = card.type ?? "unknown";
    if (!this.byType.has(type)) this.byType.set(type, []);
    this.byType.get(type).push(card);

    // by affiliation
    const aff = card.affiliation ?? "none";
    if (!this.byAffiliation.has(aff)) this.byAffiliation.set(aff, []);
    this.byAffiliation.get(aff).push(card);

    // by set
    const set = card.set ?? "unknown";
    if (!this.bySet.has(set)) this.bySet.set(set, []);
    this.bySet.get(set).push(card);

    // by skill
    for (const skill of card.skills ?? []) {
      if (!this.bySkill.has(skill)) this.bySkill.set(skill, []);
      this.bySkill.get(skill).push(card);
    }
  }
}

// Singleton
export const cardDB = new CardDatabase();
