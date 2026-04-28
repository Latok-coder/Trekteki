# ST:CCG Second Edition — Online Application Architecture

## Overview

A fully automated, real-time 2-player browser card game. The server is authoritative: it holds the
true game state, validates every action, and broadcasts updates to both clients. Neither client ever
modifies the game state directly.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Client framework | React 18 + Vite | Component model, fast HMR |
| Client state | Zustand | Lightweight, no boilerplate |
| Styling | Tailwind CSS | Rapid dark-themed UI |
| Real-time | Socket.io | Rooms, reconnection, events |
| Server | Node.js + Express | Same language as client |
| Testing | Vitest + Testing Library | Unit tests for game rules |

No database is required initially. All game state lives in server memory per session.

---

## Repository Structure

```
st-ccg-online/
├── package.json              # Root: scripts to start both server & client
├── README.md
│
├── server/
│   ├── package.json
│   └── src/
│       ├── index.js                    # Express + Socket.io entry point
│       │
│       ├── lobby/
│       │   ├── LobbyManager.js         # Create/join/list rooms
│       │   └── Room.js                 # Room model (players, status, gameId)
│       │
│       ├── game/
│       │   ├── GameEngine.js           # Orchestrates all subsystems
│       │   ├── GameState.js            # State shape & factory functions
│       │   ├── TurnManager.js          # Phase transitions & per-turn resets
│       │   ├── ActionHandler.js        # Entry point: validate → apply → broadcast
│       │   │
│       │   ├── zones/
│       │   │   ├── DeckZone.js         # Draw, shuffle, peek
│       │   │   ├── HandZone.js         # Private per-player zone
│       │   │   ├── DiscardZone.js      # Face-up, public
│       │   │   ├── DilemmaZone.js      # Separate pile; face-down/face-up rules
│       │   │   ├── CoreZone.js         # Events in play
│       │   │   ├── BrigZone.js         # Captured opponent personnel
│       │   │   └── MissionZone.js      # Mission + stacked personnel/equipment
│       │   │
│       │   ├── rules/
│       │   │   ├── CostValidator.js    # Can player afford card/action?
│       │   │   ├── PlayValidator.js    # Legal play location for card type
│       │   │   ├── ShipMovement.js     # Staffing check, span/range math
│       │   │   ├── BeamAction.js       # Beam personnel/equipment rules
│       │   │   ├── MissionAttempt.js   # Orchestrates attempt sub-phases
│       │   │   ├── DilemmaResolver.js  # Draw count, choose, reveal, face, overcome
│       │   │   ├── SkillChecker.js     # Aggregate skills/attributes vs requirements
│       │   │   ├── WinCondition.js     # 100pts + planet + space
│       │   │   ├── Combat.js           # Personnel combat (Strength totals)
│       │   │   ├── Engagement.js       # Ship engagements (Weapons vs Shields)
│       │   │   ├── DamageHandler.js    # Damage cards on ships, destruction at 3
│       │   │   └── UniquenessRule.js   # Dot-card uniqueness enforcement
│       │   │
│       │   └── effects/
│       │       ├── EffectEngine.js     # Applies card game text effects
│       │       ├── TriggerManager.js   # "When/While" trigger registration & firing
│       │       ├── ResponseQueue.js    # Mandatory then optional response ordering
│       │       └── ModifierStack.js    # Replace → Modify → Lose → Zero ordering
│       │
│       ├── deckbuilder/
│       │   ├── DeckValidator.js        # Enforce construction rules (35+/20+/5 missions etc.)
│       │   └── DeckImporter.js         # Parse trekcc.org plain-text decklist format
│       │
│       ├── data/
│       │   ├── cards/
│       │   │   ├── decks/
│       │   │   │   ├── tng-starter.json        # Pre-built starter decklist
│       │   │   │   └── klingon-starter.json
│       │   │   └── definitions/
│       │   │       ├── index.json              # Master manifest: all card IDs + set + file path
│       │   │       ├── sets/
│       │   │       │   ├── premiere/           # One JSON file per card
│       │   │       │   ├── second-edition/
│       │   │       │   ├── necessary-evil/
│       │   │       │   ├── virtual-block-1/    # Continuing Committee sets
│       │   │       │   └── ...                 # One folder per set, grows over time
│       │   │       └── errata/
│       │   │           └── errata.json         # Overrides for errated cards
│       │   └── CardDatabase.js         # Load, index, and query card definitions
│       │
│       └── utils/
│           ├── shuffle.js              # Fisher-Yates
│           ├── random.js               # Seeded random selection (for dilemmas)
│           └── logger.js               # Game log entry builder
│
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── socket.js                   # Socket.io client singleton
        │
        ├── store/
        │   ├── gameStore.js            # Mirror of server game state
        │   ├── lobbyStore.js           # Room info, player list
        │   ├── deckStore.js            # Saved decks, active deck being edited
        │   └── uiStore.js              # Tooltip target, selected card, modal state
        │
        ├── pages/
        │   ├── HomePage.jsx            # Create or join a game
        │   ├── LobbyPage.jsx           # Waiting room, deck selection, ready up
        │   ├── DeckBuilderPage.jsx     # Full deck builder UI
        │   └── GamePage.jsx            # Full game board
        │
        ├── components/
        │   ├── deckbuilder/
        │   │   ├── DeckBuilder.jsx         # Root layout: card browser left, deck list right
        │   │   ├── CardBrowser.jsx         # Paginated/virtualized card grid
        │   │   ├── CardBrowserFilters.jsx  # Filter bar: affiliation, type, set, cost, skill
        │   │   ├── CardSearchBar.jsx       # Title / text search with debounce
        │   │   ├── BrowserCardTile.jsx     # Compact card tile with add/remove buttons
        │   │   ├── DeckList.jsx            # Right panel: deck + dilemma pile + missions
        │   │   ├── DeckSection.jsx         # One collapsible section (Missions / Deck / Dilemmas)
        │   │   ├── DeckCardRow.jsx         # Single card row: name, count, –/+ controls
        │   │   ├── DeckStats.jsx           # Live stats: card count, skill spread, cost curve
        │   │   ├── DeckValidationBar.jsx   # Green/red status for each construction rule
        │   │   ├── DeckImportModal.jsx     # Paste trekcc.org plain-text decklist
        │   │   └── DeckExportModal.jsx     # Copy/download decklist as text or JSON
        │   │
        │   ├── board/
        │   │   ├── GameBoard.jsx       # Root layout: opponent top, you bottom
        │   │   ├── PlayerArea.jsx      # One player's entire half
        │   │   ├── MissionRow.jsx      # 5 mission slots in a horizontal row
        │   │   ├── MissionSlot.jsx     # Single mission card + stacked ships/personnel
        │   │   ├── ShipCard.jsx        # Ship in play (with aboard personnel count)
        │   │   ├── PersonnelStack.jsx  # Face-down stack, click to inspect
        │   │   ├── CoreArea.jsx        # Event cards in core
        │   │   └── BrigArea.jsx        # Captive personnel
        │   │
        │   ├── card/
        │   │   ├── CardComponent.jsx   # Universal renderer (face-up or face-down)
        │   │   ├── CardTooltip.jsx     # Full card detail on hover
        │   │   ├── CardBack.jsx        # Generic face-down card
        │   │   └── CardImage.jsx       # Lazy-load card art by collector ID
        │   │
        │   ├── hand/
        │   │   ├── PlayerHand.jsx      # Local player's cards (hidden from opponent)
        │   │   └── OpponentHandCount.jsx  # Shows N face-down cards
        │   │
        │   ├── piles/
        │   │   ├── DeckPile.jsx        # Click to draw (if legal)
        │   │   ├── DiscardPile.jsx     # Click to browse
        │   │   └── DilemmaP ile.jsx    # Shows count; face-up discard visible
        │   │
        │   ├── hud/
        │   │   ├── ScoreTracker.jsx    # Both scores + mission completion status
        │   │   ├── CounterBudget.jsx   # 7-pip counter display, greys out as spent
        │   │   ├── PhaseIndicator.jsx  # "Play & Draw · Execute Orders · Discard"
        │   │   └── ActionPrompt.jsx    # Contextual instruction + action buttons
        │   │
        │   ├── panels/
        │   │   ├── SidePanel.jsx       # Right-side collapsible panel
        │   │   ├── GameLog.jsx         # Scrolling log of all game events
        │   │   └── Chat.jsx            # Player chat
        │   │
        │   └── modals/
        │       ├── DilemmaChoiceModal.jsx   # Opponent picks dilemmas from drawn set
        │       ├── CardBrowserModal.jsx     # Browse discard pile / dilemma pile
        │       ├── SelectPersonnelModal.jsx # Random/chosen selection prompts
        │       └── GameOverModal.jsx        # Winner announcement + rematch
        │
        ├── hooks/
        │   ├── useSocket.js            # Subscribe to socket events, auto-cleanup
        │   ├── useGameActions.js       # Typed wrappers around socket.emit
        │   ├── useLegalActions.js      # Derives which actions are currently legal
        │   ├── useDeck.js              # CRUD for saved decks (localStorage + export)
        │   └── useCardSearch.js        # Debounced search + filter logic against CardDatabase
        │
        └── styles/
            ├── globals.css
            ├── board.css
            └── cards.css
```

---

## Core Data Models

### CardDefinition (server data, loaded from JSON)

```js
{
  id: "TNG-P-001",          // collector info string
  title: "Jean-Luc Picard",
  subtitle: "Genial Captain",
  type: "personnel",        // personnel | ship | equipment | event | interrupt
                            // mission | dilemma
  affiliation: "federation",
  cost: 3,
  unique: true,             // dot (•) before title
  species: "Human",
  icons: ["command", "tng"],

  // Personnel only
  skills: ["Archaeology", "Diplomacy", "Honor", "Leadership"],
  skillLevels: { "Leadership": 1, "Diplomacy": 1 },  // 1 unless stated
  keywords: ["Commander: U.S.S. Enterprise-D"],
  integrity: 8, cunning: 6, strength: 6,
  gameText: "Commander: U.S.S. Enterprise-D. When you play this personnel...",

  // Ship only
  shipClass: "Galaxy Class",
  staffingRequirements: ["command", "staff", "staff", "staff"],
  range: 8, weapons: 8, shields: 9,

  // Mission only
  missionType: "headquarters",  // headquarters | planet | space
  span: 2,
  points: null,
  quadrant: "A",
  affiliations: ["federation"],
  requirements: null,
  gameText: "You may play Federation cards...",

  // Dilemma only
  dilemmaType: "dual",      // dual | planet | space
}
```

### CardInstance (live game object)

```js
{
  instanceId: "uuid-v4",   // unique per copy in game
  definitionId: "TNG-P-001",
  ownerId: "player1",
  commandedBy: "player1",  // can differ if taken by opponent
  faceUp: false,
  stopped: false,
  location: {
    zone: "mission",        // hand | deck | discard | dilemma | core | brig
                            // mission | ship | removed
    playerId: "player1",    // whose zone
    missionIndex: 2,        // if zone === "mission"
    shipInstanceId: "uuid"  // if zone === "ship"
  },
  attachedCards: [],        // events/damage placed on this card
  counters: {},             // any counters placed by game text
}
```

### GameState (server canonical)

```js
{
  gameId: "abc123",
  status: "in_progress",   // waiting | in_progress | finished
  winner: null,
  turn: 1,
  activePlayerId: "player1",
  firstPlayerId: "player1",

  phase: "play_draw",       // play_draw | execute_orders | discard_excess
  subPhase: null,           // null | beaming | moving | mission_attempt
                            // drawing_dilemmas | facing_dilemma | checking_requirements

  pendingAction: null,      // { type, playerId, data } — awaiting response

  players: {
    player1: { ...PlayerState },
    player2: { ...PlayerState }
  },

  log: [ { timestamp, playerId, message } ],
}
```

### PlayerState

```js
{
  id: "player1",
  name: "Alice",
  score: 0,
  countersRemaining: 7,

  zones: {
    deck:      [ ...CardInstance ],  // ordered, face-down
    hand:      [ ...CardInstance ],  // private
    discard:   [ ...CardInstance ],  // face-up
    dilemma:   [ ...CardInstance ],  // separate pile
    core:      [ ...CardInstance ],  // events in play
    brig:      [ ...CardInstance ],  // opponent's captured personnel
  },

  missions: [
    {
      card: CardInstance,            // the mission card itself
      completedBy: null,             // playerId when complete
      overcomeDialemmas: [],         // face-up under mission
      personnelStack: [],            // face-down personnel on this mission
      equipmentStack: [],
    },
    // × 5
  ],

  ships: [
    {
      card: CardInstance,
      missionIndex: 0,               // which mission it's at
      rangeUsed: 0,                  // resets end of turn
      personnel: [],                 // aboard (face-down CardInstances)
      equipment: [],
      damage: [],                    // damage cards; destroy at 3
      stopped: false,
    }
  ],
}
```

---

## Socket.io Event Protocol

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `lobby:create` | `{ playerName, deckId }` | Create a new room |
| `lobby:join` | `{ roomCode, playerName, deckId }` | Join existing room |
| `lobby:ready` | — | Toggle ready status |
| `action:draw_card` | — | Draw 1 card (costs 1 counter) |
| `action:play_card` | `{ instanceId, targetZone, targetIndex? }` | Play from hand |
| `action:beam` | `{ instanceIds[], fromMissionIdx, toTarget }` | Beam personnel/equipment |
| `action:move_ship` | `{ shipInstanceId, toMissionIdx }` | Move ship |
| `action:attempt_mission` | `{ missionIdx, shipInstanceId? }` | Declare attempt |
| `action:choose_dilemmas` | `{ selectedInstanceIds[] }` | Opponent picks dilemmas |
| `action:select_card` | `{ instanceId }` | Generic selection (targeting, random resolution) |
| `action:end_phase` | — | Advance to next phase |
| `action:discard` | `{ instanceId }` | Discard from hand |
| `action:use_order` | `{ instanceId, orderId }` | Use Order– ability on a card |
| `action:concede` | — | Forfeit the game |
| `chat:message` | `{ text }` | Send chat |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `lobby:update` | `{ room }` | Room state changed |
| `game:start` | `{ gameState, yourPlayerId }` | Game begins |
| `game:state` | `{ gameState }` | Full state sync (after each action) |
| `game:action_required` | `{ playerId, type, prompt, options? }` | Awaiting input |
| `game:log` | `{ entry }` | New log line |
| `game:over` | `{ winnerId, reason }` | Game ended |
| `game:error` | `{ message }` | Illegal action rejected |
| `chat:message` | `{ playerId, text, timestamp }` | Incoming chat |

> **Privacy rule**: When broadcasting `game:state`, the server strips `hand` cards to
> `{ instanceId, faceUp: false }` for the *opponent's* perspective. Personnel and equipment
> in play are also sent as face-down stubs unless the opponent has the right to examine them.

---

## Game Phase State Machine

```
                    ┌─────────────────────────────────────────┐
                    │              TURN START                  │
                    │   "at the start of each of your turns"  │
                    └───────────────────┬─────────────────────┘
                                        │
                              ┌─────────▼──────────┐
                              │   PLAY & DRAW       │
                              │   7 counters        │
                              │   play cards        │
                              │   draw (1 counter)  │
                              └─────────┬──────────┘
                                        │ end_phase
                              ┌─────────▼──────────┐
                              │  EXECUTE ORDERS     │◄──────────────────┐
                              │  (idle)             │                   │
                              └──┬─────┬─────┬──────┘                   │
                    beam ────────┘     │     └──── attempt_mission       │
                                       │                  │              │
                              move_ship│      ┌───────────▼──────────┐  │
                                       │      │  MISSION ATTEMPT      │  │
                                       │      │  draw_dilemmas        │  │
                                       │      │  face_dilemma  ───────┼──┤ (overcome/fail)
                                       │      │  check_requirements   │  │
                                       │      └───────────────────────┘  │
                                       │                                  │
                                       └──────────────────────────────────┘
                                                    │ end_phase
                              ┌─────────────────────▼──────┐
                              │     DISCARD EXCESS          │
                              │     discard to max 7        │
                              │  "at end of each turn"      │
                              └─────────────────────┬───────┘
                                                     │
                              ┌──────────────────────▼──────┐
                              │       TURN END               │
                              │  all stopped → unstopped     │
                              │  all ships → full range      │
                              │  → next player's turn        │
                              └─────────────────────────────┘
```

---

## Mission Attempt Sub-Flow

```
attempt_mission declared
        │
        ▼
Count personnel involved
Subtract overcome dilemmas
= N dilemmas opponent may draw
        │
        ▼
Opponent draws N from dilemma pile  ← "draw_dilemmas" sub-phase
(opponent on left in 2-player = the one player)
        │
        ▼
Opponent selects subset, orders them  ← "choose_dilemmas" (DilemmaChoiceModal)
(remaining returned face-up to bottom)
        │
        ▼
Loop: reveal top dilemma             ← "facing_dilemma" sub-phase
  ├── Check: duplicate? wrong type? over budget? → overcome automatically
  ├── Apply dilemma game text
  │     ├── Requirements check (skills/attributes)
  │     ├── Consequences (kill / stop / brig)
  │     └── Placement (overcome beneath mission, on ship, back to pile)
  └── Any personnel remaining? → next dilemma / exit loop
        │
        ▼
All dilemmas faced (or all personnel gone)
        │
        ▼
"check_requirements" sub-phase
  ├── Personnel remaining?  No  → attempt fails, all stopped
  └── Yes → check skills + attribute totals
        ├── Requirements met? → MISSION COMPLETE (score points, pull card)
        └── Not met? → attempt fails, all stopped
```

---

## Card Data & CardDatabase

### Scalability Strategy

The full ST:CCG card pool exceeds 4,000 cards across dozens of sets. The data layer is designed
to accommodate this without any architectural changes — only new JSON files need to be added.

**File organisation:** One JSON file per card definition, grouped into a folder per set under
`server/src/data/cards/definitions/sets/`. A master `index.json` lists every card ID, its set,
and its file path so the server can lazy-load or eager-load as needed.

**Errata:** The Continuing Committee issues periodic errata. A separate `errata/errata.json`
file holds patches that are merged over a card's base definition at load time, keeping the
original files clean.

**CardDatabase at startup:**
```
1. Read index.json → build ID → filepath map
2. Load all definition files (or load lazily on first access)
3. Merge any errata entries
4. Build indexes:
   - byId          { id → CardDefinition }
   - byTitle       { normalised_title → CardDefinition[] }  (handles personae)
   - byAffiliation { affiliation → CardDefinition[] }
   - byType        { type → CardDefinition[] }
   - bySet         { set → CardDefinition[] }
   - bySkill       { skill → CardDefinition[] }
   - byKeyword     { keyword → CardDefinition[] }
5. Expose query API used by game engine and deck builder
```

**CardDatabase query API:**
```js
db.getById(id)
db.search({ title, type, affiliation, set, skill, keyword, costMax, unique })
db.getPersonae(title)         // all cards sharing the same base title
db.validateDeck(deckList)     // returns { valid, errors[] }
```

---

### Master Index Format

```json
// server/src/data/cards/definitions/index.json
[
  {
    "id": "2E-P-JLP-01",
    "title": "Jean-Luc Picard",
    "subtitle": "Genial Captain",
    "type": "personnel",
    "affiliation": "federation",
    "set": "second-edition",
    "file": "sets/second-edition/jean-luc-picard-genial-captain.json"
  },
  {
    "id": "1E-PREM-P-001",
    "title": "Jean-Luc Picard",
    "subtitle": null,
    "type": "personnel",
    "affiliation": "federation",
    "set": "premiere",
    "file": "sets/premiere/jean-luc-picard.json"
  }
  // ... 4000+ entries
]
```

---

### Full Card Definition Format

Every card type shares a common base, with type-specific fields added as needed.
The `abilities` array is the heart of the automation system — it encodes all game
text as structured data that `EffectEngine` can execute.

```json
{
  "id": "2E-P-JLP-01",
  "title": "Jean-Luc Picard",
  "subtitle": "Genial Captain",
  "type": "personnel",
  "set": "second-edition",
  "collectorInfo": "2 VP 31",
  "imageUrl": "/cards/sets/second-edition/jean-luc-picard-genial-captain.jpg",

  "affiliation": "federation",
  "cost": 3,
  "unique": true,
  "lore": "The Star Trek CCG Community lives on at WWW.TREKCC.ORG",
  "gameText": "Commander: U.S.S. Enterprise-D. When you play this personnel, you may download U.S.S. Enterprise-D.",

  "species": "Human",
  "icons": ["command", "tng"],
  "skills": ["Archaeology", "Diplomacy", "Honor", "Leadership"],
  "skillLevels": { "Diplomacy": 1, "Leadership": 1 },
  "keywords": ["Commander: U.S.S. Enterprise-D"],
  "integrity": 8,
  "cunning": 6,
  "strength": 6,

  "abilities": [
    {
      "id": "jlp-01-keyword-commander",
      "type": "keyword",
      "keyword": "Commander",
      "linkedCard": "U.S.S. Enterprise-D"
    },
    {
      "id": "jlp-01-on-play-download",
      "type": "response",
      "trigger": "on_play",
      "optional": true,
      "effect": {
        "type": "download",
        "filter": { "definitionId": "2E-S-ENT-D-01" }
      }
    }
  ]
}
```

```json
// Ship example
{
  "id": "2E-S-ENT-D-01",
  "title": "U.S.S. Enterprise-D",
  "subtitle": "Diplomatic Envoy",
  "type": "ship",
  "set": "second-edition",
  "affiliation": "federation",
  "cost": 6,
  "unique": true,
  "shipClass": "Galaxy Class",
  "icons": ["tng"],
  "staffingRequirements": ["command", "staff", "staff", "staff"],
  "range": 8, "weapons": 8, "shields": 9,
  "gameText": "When you complete this mission, if this ship is staffed and at that mission, score 5 points...",
  "abilities": [
    {
      "id": "ent-d-01-complete-mission-score",
      "type": "response",
      "trigger": "on_mission_complete",
      "condition": {
        "type": "and",
        "conditions": [
          { "type": "ship_staffed", "subject": "self" },
          { "type": "ship_at_mission", "subject": "self" }
        ]
      },
      "optional": true,
      "effect": {
        "type": "score_points",
        "amount": 5,
        "limit": "once_per_turn"
      }
    }
  ]
}
```

```json
// Mission example
{
  "id": "2E-M-EARTH-01",
  "title": "Earth",
  "subtitle": "Cradle of the Federation",
  "type": "mission",
  "missionType": "headquarters",
  "set": "second-edition",
  "quadrant": "A",
  "region": "Sector 001",
  "span": 2,
  "points": null,
  "affiliations": ["federation"],
  "requirements": null,
  "gameText": "You may play Federation cards, Bajoran cards, Maquis cards, and equipment at this mission.",
  "abilities": [
    {
      "id": "earth-01-play-permission",
      "type": "continuous",
      "effect": {
        "type": "allow_play_at_mission",
        "filter": {
          "type": "or",
          "filters": [
            { "affiliation": "federation" },
            { "affiliation": "bajoran" },
            { "affiliation": "maquis" },
            { "type": "equipment" }
          ]
        }
      }
    }
  ]
}
```

```json
// Dilemma example
{
  "id": "2E-D-DARK-PAGE-01",
  "title": "Dark Page",
  "type": "dilemma",
  "dilemmaType": "dual",
  "set": "second-edition",
  "cost": 2,
  "gameText": "Choose a personnel who has Anthropology or Exobiology to be stopped. If you cannot, randomly select a personnel to be killed.",
  "abilities": [
    {
      "id": "dark-page-01-main",
      "type": "dilemma_effect",
      "actions": [
        {
          "type": "choose_to_stop",
          "controller": "opponent",
          "filter": {
            "type": "or",
            "filters": [
              { "skill": "Anthropology" },
              { "skill": "Exobiology" }
            ]
          },
          "fallback": {
            "type": "random_kill",
            "count": 1
          }
        }
      ],
      "placement": "overcome"
    }
  ]
}
```

```json
// Interrupt example — plays during opponent's turn
{
  "id": "2E-I-ESCAPE-01",
  "title": "Escape",
  "type": "interrupt",
  "set": "second-edition",
  "cost": 0,
  "gameText": "When any number of your personnel facing a dilemma are about to be killed or placed in an opponent's brig, discard a random card from hand to prevent that. Those personnel are stopped instead.",
  "abilities": [
    {
      "id": "escape-01-prevent",
      "type": "response",
      "trigger": "before_personnel_killed_or_brigged",
      "condition": { "type": "personnel_facing_dilemma", "subject": "your_personnel" },
      "optional": true,
      "cost": {
        "type": "discard_random_from_hand",
        "count": 1
      },
      "effect": {
        "type": "prevent",
        "then": {
          "type": "stop_personnel",
          "subject": "affected_personnel"
        }
      },
      "timing": "can_play_on_opponent_turn"
    }
  ]
}
```

---

### Ability Type Registry

The `EffectEngine` maintains a registry of handlers, one per `type` value. Adding
support for a new card mechanic means registering a new handler — no existing
handlers are touched.

| Ability type | Description |
|---|---|
| `keyword` | Passive keyword declaration (Commander, Region, etc.) |
| `continuous` | Always-on effect while card is in play |
| `response` | Fires when trigger is met; may be optional or mandatory |
| `dilemma_effect` | Ordered list of actions applied during dilemma resolution |
| `order_action` | Usable only during Execute Orders segment |
| `cost_modifier` | Modifies cost of playing a card (fires before cost paid) |
| `prevent` | Stops another effect from occurring |

**Effect sub-types (used inside `effect` or `actions` fields):**

| Effect type | Description |
|---|---|
| `download` | Search deck for card matching filter, add to hand, shuffle |
| `score_points` | Add points to a player's score |
| `lose_points` | Remove points from a player's score |
| `stop_personnel` | Mark personnel as stopped |
| `kill_personnel` | Send personnel to owner's discard |
| `place_in_brig` | Move personnel to opponent's brig |
| `destroy_card` | Send card from play to discard |
| `draw_cards` | Add N cards from deck to hand |
| `discard_from_hand` | Remove N cards from hand to discard |
| `allow_play_at_mission` | Grant play permission at a headquarters |
| `attribute_modifier` | Add/subtract from Integrity, Cunning, Strength, Range, Weapons, Shields |
| `skill_grant` | Add a skill to a personnel |
| `skill_remove` | Remove a skill from a personnel |
| `change_affiliation` | Change a card's affiliation |
| `change_species` | Change a personnel's species |
| `place_damage` | Place a damage card on a ship |
| `remove_damage` | Remove a damage card from a ship |
| `search_dilemma_pile` | Look through dilemma pile, choose card(s) |
| `return_to_dilemma_pile` | Place dilemma face-up on bottom of pile |
| `overcome_dilemma` | Place dilemma face-up under mission |
| `add_to_mission_requirements` | Append a skill/attribute to mission requirements |
| `replace_mission_requirements` | Substitute alternate requirements for mission |
| `reveal_hand` | Show a player's hand to opponent |
| `reveal_top_deck` | Show top N cards of a deck |
| `move_ship` | Move ship without spending range |
| `take_command` | Assume command of an opponent's card |
| `remove_from_game` | Remove card from all zones permanently |
| `custom` | Escape hatch: JS function name for cards too complex to encode structurally |

The `custom` type is intentional — a small number of cards (e.g., complex loop-busting
abilities) may warrant hand-written handlers rather than forcing them into the structured
format. The escape hatch keeps the system practical.

---

### Deck Validation Rules

`DeckValidator.js` enforces all construction rules from the rulebook:

```js
const RULES = [
  { id: "min-missions",       test: d => d.missions.length === 5,                       message: "Must have exactly 5 missions" },
  { id: "min-non-hq",         test: d => d.missions.filter(m => m.type !== "hq").length >= 2, message: "Must have at least 2 non-headquarters missions" },
  { id: "min-deck",           test: d => d.cards.length >= 35,                          message: "Deck must contain at least 35 cards" },
  { id: "min-dilemmas",       test: d => d.dilemmas.length >= 20,                       message: "Dilemma pile must contain at least 20 dilemmas" },
  { id: "max-copies",         test: d => noTitleExceeds3Copies(d),                      message: "No more than 3 copies of any card title" },
  { id: "unique-missions",    test: d => allMissionsDistinct(d),                        message: "All 5 missions must have different titles" },
  { id: "dilemmas-only",      test: d => d.dilemmas.every(c => c.type === "dilemma"),   message: "Dilemma pile may only contain dilemma cards" },
];
```

---

### Deck File Format (saved decks)

```json
{
  "formatVersion": 1,
  "name": "My Klingon Aggro",
  "affiliation": "klingon",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "missions": [
    "2E-M-QONOS-01",
    "2E-M-CARDASSIA-IV-01",
    "2E-M-CRENSEN-GAP-01",
    "2E-M-HONOR-FALLEN-01",
    "2E-M-VALT-MINOR-01"
  ],
  "deck": [
    { "definitionId": "2E-P-KOHLAR-01", "count": 1 },
    { "definitionId": "2E-P-KMPEC-01",  "count": 1 }
  ],
  "dilemmas": [
    { "definitionId": "2E-D-DARK-PAGE-01", "count": 2 },
    { "definitionId": "2E-D-FAMILY-01",    "count": 1 }
  ]
}
```

Decks are stored client-side in `localStorage` via `useDeck.js` and can be exported as
plain text (trekcc.org format) or JSON. When a player enters the lobby they select a saved
deck; the client sends the deck JSON to the server which re-validates it before accepting.

---

## Board Layout (Visual Reference)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  OPPONENT                                              Score: 0   Hand: 7      │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────┐   │
│  │ Dilemma  │  │         OPPONENT MISSIONS (5 cards face-up)              │   │
│  │  Pile    │  │  [ HQ ]  [ Space ]  [ Planet ]  [ Space ]  [ Planet ]   │   │
│  └──────────┘  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌────────────────────────────────────────────────────────┐     │
│  │  Deck    │  │         OPPONENT PLAY AREA (ships + personnel)         │     │
│  │ Discard  │  │                                                        │     │
│  └──────────┘  └────────────────────────────────────────────────────────┘     │
│  ┌──────┐  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Core │  │                      SHARED SPACE                           │   │
│  │ Brig │  │             (missions overlap in the middle)                │   │
│  └──────┘  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌────────────────────────────────────────────────────────┐     │
│  │  Deck    │  │         YOUR PLAY AREA (ships + personnel)             │     │
│  │ Discard  │  │                                                        │     │
│  └──────────┘  └────────────────────────────────────────────────────────┘     │
│  ┌──────────┐  ┌──────────────────────────────────────────────────────────┐   │
│  │ Dilemma  │  │         YOUR MISSIONS (5 cards face-up)                 │   │
│  │  Pile    │  │  [ HQ ]  [ Space ]  [ Planet ]  [ Space ]  [ Planet ]  │   │
│  └──────────┘  └──────────────────────────────────────────────────────────┘   │
│  Score: 0   Counters: ●●●●●●●   Phase: Play & Draw                            │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                         YOUR HAND (7 cards)                             │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┬───┘
                                                                            │
                                                               Side Panel ──┘
                                                          (Game Log + Chat)
```

---

## Build Phases & Milestones

### Phase 1 — Lobby & Connection
- Room creation with shareable code
- Player 2 joins by code
- Deck selection (TNG or Klingon starter) or load a saved deck
- Ready-up handshake
- Server re-validates selected deck before accepting
- Server spins up GameEngine when both ready

### Phase 2 — Board Rendering (no game logic)
- Static board layout matching above diagram
- Card component with face-up/face-down modes
- Hover tooltip showing full card text
- Mission row, personnel stacks, ship cards
- Pile indicators with counts

### Phase 3 — Deck Builder
- `/deckbuilder` route with card browser + deck editor layout
- Full card browser: search, filter by affiliation / type / set / skill / cost
- Deck editor: add/remove cards, live validation bar, card count per section
- Import trekcc.org plain-text decklist format
- Export to plain text and JSON
- Save/load decks via localStorage
- Deck validation enforced server-side when entering lobby

### Phase 4 — Play & Draw Phase
- 7-counter budget display and enforcement
- Play personnel/ships/equipment to HQ
- Draw card (1 counter)
- Hand limit (discard to 7)
- Card uniqueness rule (dot cards)

### Phase 5 — Execute Orders: Movement
- Beam personnel/equipment (to/from ships, between ships)
- Ship staffing validation (command/staff icons + affiliation)
- Ship movement with span/range calculation
- Range tracker that restores at turn end

### Phase 6 — Execute Orders: Mission Attempts
- Declare attempt (planet: all unstopped personnel; space: choose ship)
- Dilemma drawing and choice flow (DilemmaChoiceModal)
- Dilemma revelation and game text application
- Skill/attribute checking
- Mission completion + scoring
- Win condition check

### Phase 7 — Events, Interrupts & Order Actions
- Play events to core / on cards / destroy after effect
- Interrupt timing (during opponent's turn)
- Order– actions on played cards
- Response action queue (mandatory → optional)

### Phase 8 — Combat & Engagements
- Personnel combat (Strength totals)
- Ship engagements (Weapons vs Shields)
- Damage cards on ships
- Ship destruction at 3 damage

### Phase 9 — Brig & Advanced Rules
- Captive personnel placement and restrictions
- Damage removal at HQ
- Infinite loop resolution
- Full effect modifier stack (Replace → Modify → Lose → Zero)

### Phase 10 — Card Pool Expansion
- Encode additional sets beyond the two starter decks
- Add `custom` ability handlers for complex unique cards
- Community contribution workflow: PR new card JSON files
- Errata tracking and patch process

---

## Key Engineering Decisions

**Server-authoritative state** — The client never mutates game state locally. Every click emits an
action, the server validates and applies it, then broadcasts the new full state. This keeps both
players perfectly in sync and prevents cheating.

**Full state broadcast** — After each action, the server sends the complete `GameState` to both
players (with hand privacy applied). This is simpler than delta patching and sufficient for this
game's state size.

**Effect system** — Card game text is encoded as a structured `abilities` array in each card
definition (not free-form strings). `EffectEngine` reads these to apply effects, and
`TriggerManager` registers "when/while" listeners that fire at the correct moment in the state
machine. The `custom` escape hatch handles the small number of cards too complex for structured
encoding without breaking the pattern for everything else.

**Separate dilemma pile** — Dilemmas are never in the draw deck. The server maintains them as a
separate ordered array and handles the face-up/face-down rules (shuffle when a face-up card is
reached) independently.

**Random selections** — Any "randomly select a personnel" effect uses the server's
`random.js` utility so the result is determined server-side and both clients receive the same
outcome simultaneously.

**Card pool scalability** — One JSON file per card, one folder per set, a master index loaded
at startup. Adding new cards never requires touching the engine — only new data files.
The errata system applies patches at load time, keeping source files stable.

**Deck builder is client-driven** — Decks are composed and stored in the browser
(`localStorage`) and exported as JSON. The server re-validates every submitted deck before a
game starts, so the client's validation is a convenience layer, not a security boundary.

**trekcc.org import format** — `DeckImporter.js` parses the plain-text decklist format used
by the official community site, making it easy for existing players to bring their decks
straight into the app.
