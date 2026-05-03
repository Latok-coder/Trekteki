/**
 * deckImporter.js — parse a plain-text decklist into our deck object format.
 *
 * Supported input formats:
 *
 * 1. trekcc.org / Continuing Committee format:
 *    ---
 *    Deck Name: My Deck
 *
 *    Missions:
 *    1x Earth, Cradle of the Federation
 *    1x Forcas Sector, Fissure Research
 *
 *    Draw Deck (35):
 *    3x Davies
 *    1x Jean-Luc Picard, Genial Captain
 *
 *    Dilemma Pile (20):
 *    2x Dark Page
 *    ---
 *
 * 2. Compact format (count + title on each line, section headers optional):
 *    3x Davies
 *    1x Worf
 *
 * 3. Our own JSON format — just pass the parsed object directly to importDeck().
 *
 * Returns:
 *   { ok: true,  deck: DeckObject, warnings: string[] }
 *   { ok: false, error: string }
 */

/**
 * parseDecklist(text, cardIndex)
 *
 * cardIndex: array from GET /api/cards — used to match card names to IDs.
 * If cardIndex is not provided the importer still works but all entries
 * will have null IDs (flagged as warnings).
 */
export function parseDecklist(text, cardIndex = []) {
  if (!text?.trim()) {
    return { ok: false, error: 'No text provided.' };
  }

  // Build a lookup: normalised title → card ID
  const titleToId = buildTitleLookup(cardIndex);

  const warnings = [];
  const result = {
    formatVersion: 1,
    id:            `deck-${Date.now()}`,
    name:          'Imported Deck',
    affiliation:   '',
    missions:      [],
    deck:          [],
    dilemmas:      [],
  };

  // ── Parse section headers and lines ───────────────────────────────

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentSection = 'deck'; // default if no headers present

  for (const line of lines) {
    // Deck name header
    if (/^deck\s*name\s*:/i.test(line)) {
      result.name = line.replace(/^deck\s*name\s*:/i, '').trim() || 'Imported Deck';
      continue;
    }

    // Section headers
    if (/^missions?\s*[:(]/i.test(line)) { currentSection = 'missions'; continue; }
    if (/^draw\s*deck\s*[:(]/i.test(line))    { currentSection = 'deck';     continue; }
    if (/^deck\s*[:(]/i.test(line))            { currentSection = 'deck';     continue; }
    if (/^dilemma\s*(pile)?\s*[:(]/i.test(line)) { currentSection = 'dilemmas'; continue; }

    // Card line: "Nx Title, Subtitle" or "N Title, Subtitle" or just "Title"
    const match = line.match(/^(\d+)\s*[xX]?\s+(.+)$/) || line.match(/^()(.+)$/);
    if (!match) continue;

    const count = parseInt(match[1] || '1', 10);
    const rawTitle = match[2].trim();

    // Strip trailing set/collector info in parens if present: "Dark Page (2V 1)"
    const cleanTitle = rawTitle.replace(/\s*\([^)]*\)\s*$/, '').trim();

    // Normalise: "Jean-Luc Picard, Genial Captain" → look up by title or title+subtitle
    const id = resolveTitle(cleanTitle, titleToId, warnings);

    if (currentSection === 'missions') {
      if (!result.missions.includes(id ?? cleanTitle)) {
        result.missions.push(id ?? cleanTitle);
      }
    } else if (currentSection === 'dilemmas') {
      addEntry(result.dilemmas, id ?? cleanTitle, count);
    } else {
      addEntry(result.deck, id ?? cleanTitle, count);
    }
  }

  if (result.missions.length === 0 && result.deck.length === 0 && result.dilemmas.length === 0) {
    return { ok: false, error: 'Could not parse any cards from the text. Check the format.' };
  }

  return { ok: true, deck: result, warnings };
}

/**
 * exportAsText(deck, cardDefs)
 * Produces a trekcc.org-compatible plain-text decklist.
 * cardDefs: { [id]: CardDefinition } — used to look up real titles.
 */
export function exportAsText(deck, cardDefs = {}) {
  const lines = [];

  lines.push(`Deck Name: ${deck.name}`);
  lines.push('');

  // Missions
  lines.push(`Missions (${deck.missions.length}):`);
  for (const id of deck.missions) {
    const card = cardDefs[id];
    lines.push(card
      ? `1x ${card.title}${card.subtitle ? `, ${card.subtitle}` : ''}`
      : `1x ${id}`);
  }
  lines.push('');

  // Draw deck
  const deckTotal = deck.deck.reduce((n, e) => n + e.count, 0);
  lines.push(`Draw Deck (${deckTotal}):`);
  for (const entry of deck.deck) {
    const card = cardDefs[entry.definitionId];
    lines.push(card
      ? `${entry.count}x ${card.title}${card.subtitle ? `, ${card.subtitle}` : ''}`
      : `${entry.count}x ${entry.definitionId}`);
  }
  lines.push('');

  // Dilemma pile
  const dilemmaTotal = deck.dilemmas.reduce((n, e) => n + e.count, 0);
  lines.push(`Dilemma Pile (${dilemmaTotal}):`);
  for (const entry of deck.dilemmas) {
    const card = cardDefs[entry.definitionId];
    lines.push(card
      ? `${entry.count}x ${card.title}${card.subtitle ? `, ${card.subtitle}` : ''}`
      : `${entry.count}x ${entry.definitionId}`);
  }

  return lines.join('\n');
}

// ── Helpers ────────────────────────────────────────────────────────────

function normaliseTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')   // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function buildTitleLookup(cardIndex) {
  const lookup = new Map();
  for (const card of cardIndex) {
    // Index by title alone
    const byTitle = normaliseTitle(card.title);
    if (!lookup.has(byTitle)) lookup.set(byTitle, card.id);

    // Index by "Title, Subtitle"
    if (card.subtitle) {
      const byFull = normaliseTitle(`${card.title} ${card.subtitle}`);
      lookup.set(byFull, card.id);

      const byComma = normaliseTitle(`${card.title}, ${card.subtitle}`);
      lookup.set(byComma, card.id);
    }
  }
  return lookup;
}

function resolveTitle(rawTitle, titleToId, warnings) {
  // Try exact normalised match
  const key = normaliseTitle(rawTitle);
  if (titleToId.has(key)) return titleToId.get(key);

  // Try stripping everything after a comma (subtitle removal)
  const baseTitle = rawTitle.split(',')[0].trim();
  const baseKey   = normaliseTitle(baseTitle);
  if (titleToId.has(baseKey)) return titleToId.get(baseKey);

  warnings.push(`Could not match card: "${rawTitle}" — kept as-is`);
  return null;
}

function addEntry(list, definitionId, count) {
  const existing = list.find(e => e.definitionId === definitionId);
  if (existing) {
    existing.count = Math.min(existing.count + count, 3);
  } else {
    list.push({ definitionId, count: Math.min(count, 3) });
  }
}
