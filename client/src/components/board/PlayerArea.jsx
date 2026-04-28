import MissionRow from './MissionRow.jsx';
import CoreArea from './CoreArea.jsx';
import BrigArea from './BrigArea.jsx';
import DeckPile from '../piles/DeckPile.jsx';
import DiscardPile from '../piles/DiscardPile.jsx';
import DilemmaPile from '../piles/DilemmaPile.jsx';

/**
 * PlayerArea — one player's complete half of the board.
 *
 * Layout (your side, isYours=true):
 *   [Dilemma] [Missions + ships/personnel]  [Deck] [Discard]
 *                                           [Core] [Brig]
 *
 * For opponent (isYours=false), the layout is flipped vertically.
 */
export default function PlayerArea({
  isYours = true,
  playerName = '',
  score = 0,
  handCount = 0,

  // Pile props
  deckCount = 0,
  discardCount = 0,
  discardTop = null,
  dilemmaCount = 0,
  dilemmaFaceUp = 0,

  // Zone props
  missions = [],
  coreEvents = [],
  brigCaptives = [],

  // Callbacks
  onDraw,
  canDraw = false,
  onDiscardBrowse,
  onMissionClick,
  onPersonnelClick,
  onShipClick,
  onCrewClick,
  onCoreCardClick,
  onBrigCardClick,
}) {
  const nameColor = isYours ? 'text-lcars-blue' : 'text-red-400';

  return (
    <div className={`
      flex ${isYours ? 'flex-row' : 'flex-row-reverse'}
      items-start gap-3 px-3 py-2
      ${isYours ? 'border-t border-board-border/50' : 'border-b border-board-border/50'}
    `}>
      {/* Left column: piles + zones */}
      <div className="flex flex-col gap-3 flex-shrink-0">
        {/* Player name + score */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${nameColor}`}>
            {playerName}
          </span>
          <span className="text-lcars-gold text-xs font-bold">{score} pts</span>
          {handCount > 0 && (
            <span className="text-card-dim text-[10px]">✋ {handCount}</span>
          )}
        </div>

        {/* Deck + Discard */}
        <div className="flex gap-2">
          <DeckPile count={deckCount} canDraw={canDraw} onDraw={onDraw} />
          <DiscardPile count={discardCount} topCard={discardTop} onBrowse={onDiscardBrowse} />
        </div>

        {/* Dilemma pile */}
        <DilemmaPile count={dilemmaCount} faceUpCount={dilemmaFaceUp} isOpponent={!isYours} />

        {/* Core + Brig */}
        <CoreArea events={coreEvents} onCardClick={onCoreCardClick} />
        <BrigArea captives={brigCaptives} onCardClick={onBrigCardClick} />
      </div>

      {/* Main area: missions */}
      <div className="flex-1 overflow-x-auto">
        <MissionRow missions={missions} isYours={isYours} />
      </div>
    </div>
  );
}
