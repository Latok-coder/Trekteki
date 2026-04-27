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
│       ├── data/
│       │   ├── cards/
│       │   │   ├── tng-starter.json    # All TNG starter card definitions
│       │   │   └── klingon-starter.json
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
        │   └── uiStore.js              # Tooltip target, selected card, modal state
        │
        ├── pages/
        │   ├── HomePage.jsx            # Create or join a game
        │   ├── LobbyPage.jsx           # Waiting room, deck selection, ready up
        │   └── GamePage.jsx            # Full game board
        │
        ├── components/
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
        │   └── useLegalActions.js      # Derives which actions are currently legal
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

## Card Data JSON Format

Each starter deck ships as two files: a deck file and a dilemma pile file.

```json
// server/src/data/cards/tng-starter.json
{
  "deck": {
    "missions": ["earth-hq", "forcas-sector", "lapideas-system", "moab-iv", "sector-97"],
    "cards": [
      { "definitionId": "TNG-P-JLP-01", "count": 1 },
      { "definitionId": "TNG-P-DATA-01", "count": 1 },
      ...
    ]
  },
  "dilemmas": [
    { "definitionId": "DILEMMA-DARK-PAGE", "count": 2 },
    { "definitionId": "DILEMMA-FAMILY", "count": 1 },
    ...
  ]
}
```

```json
// server/src/data/cards/definitions/tng-jean-luc-picard.json
{
  "id": "TNG-P-JLP-01",
  "title": "Jean-Luc Picard",
  "subtitle": "Genial Captain",
  "type": "personnel",
  "affiliation": "federation",
  "cost": 3,
  "unique": true,
  "species": "Human",
  "icons": ["command", "tng"],
  "skills": ["Archaeology", "Diplomacy", "Honor", "Leadership"],
  "skillLevels": {},
  "keywords": ["Commander: U.S.S. Enterprise-D"],
  "integrity": 8, "cunning": 6, "strength": 6,
  "gameText": "Commander: U.S.S. Enterprise-D. When you play this personnel, you may download U.S.S. Enterprise-D.",
  "abilities": [
    {
      "trigger": "on_play",
      "type": "download",
      "target": { "definitionId": "TNG-S-ENTERPRISE-D" }
    }
  ],
  "imageUrl": "/cards/tng-jean-luc-picard-genial-captain.jpg"
}
```

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
- Deck selection (TNG or Klingon starter)
- Ready-up handshake
- Server spins up GameEngine when both ready

### Phase 2 — Board Rendering (no game logic)
- Static board layout matching above diagram
- Card component with face-up/face-down modes
- Hover tooltip showing full card text
- Mission row, personnel stacks, ship cards
- Pile indicators with counts

### Phase 3 — Play & Draw Phase
- 7-counter budget display and enforcement
- Play personnel/ships/equipment to HQ
- Draw card (1 counter)
- Hand limit (discard to 7)
- Card uniqueness rule (dot cards)

### Phase 4 — Execute Orders: Movement
- Beam personnel/equipment (to/from ships, between ships)
- Ship staffing validation (command/staff icons + affiliation)
- Ship movement with span/range calculation
- Range tracker that restores at turn end

### Phase 5 — Execute Orders: Mission Attempts
- Declare attempt (planet: all unstopped personnel; space: choose ship)
- Dilemma drawing and choice flow (DilemmaChoiceModal)
- Dilemma revelation and game text application
- Skill/attribute checking
- Mission completion + scoring
- Win condition check

### Phase 6 — Events, Interrupts & Order Actions
- Play events to core / on cards / destroy after effect
- Interrupt timing (during opponent's turn)
- Order– actions on played cards
- Response action queue (mandatory → optional)

### Phase 7 — Combat & Engagements
- Personnel combat (Strength totals)
- Ship engagements (Weapons vs Shields)
- Damage cards on ships
- Ship destruction at 3 damage

### Phase 8 — Brig & Advanced Rules
- Captive personnel placement and restrictions
- Damage removal at HQ
- Infinite loop resolution
- Full effect modifier stack (Replace → Modify → Lose → Zero)

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
machine.

**Separate dilemma pile** — Dilemmas are never in the draw deck. The server maintains them as a
separate ordered array and handles the face-up/face-down rules (shuffle when a face-up card is
reached) independently.

**Random selections** — Any "randomly select a personnel" effect uses the server's
`random.js` utility so the result is determined server-side and both clients receive the same
outcome simultaneously.
