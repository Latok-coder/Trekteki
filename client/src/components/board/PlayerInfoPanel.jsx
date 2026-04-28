import DeckPile from '../piles/DeckPile.jsx';
import DiscardPile from '../piles/DiscardPile.jsx';
import DilemmaPile from '../piles/DilemmaPile.jsx';
import RemovedPile from '../piles/RemovedPile.jsx';
import CoreArea from './CoreArea.jsx';
import BrigArea from './BrigArea.jsx';

/**
 * PlayerInfoPanel — the right-column info block for one player.
 * Stacked vertically: name/score → piles (4) → core → brig.
 */
export default function PlayerInfoPanel({
  isYours = true,
  playerName = '',
  score = 0,
  handCount = 0,

  deckCount = 0,
  discardCount = 0,
  discardTop = null,
  dilemmaCount = 0,
  dilemmaFaceUp = 0,
  removedCount = 0,

  coreEvents = [],
  brigCaptives = [],

  canDraw = false,
  onDraw,
  onDiscardBrowse,
  onCoreCardClick,
  onBrigCardClick,
}) {
  const accent  = isYours ? 'text-lcars-blue'  : 'text-red-400';
  const border  = isYours ? 'border-lcars-blue/20' : 'border-red-900/30';
  const bgStrip = isYours ? 'bg-lcars-blue/10' : 'bg-red-950/20';

  return (
    <div className={`flex flex-col border ${border} rounded-lg overflow-hidden`}>

      {/* ── Name / score strip ── */}
      <div className={`${bgStrip} px-3 py-2 border-b ${border} flex items-center gap-2`}>
        <div className="flex-1 min-w-0">
          <p className={`${accent} text-[10px] uppercase tracking-widest font-bold truncate`}>
            {playerName}
          </p>
          <p className="text-lcars-gold font-bold text-lg leading-tight">{score}
            <span className="text-card-dim text-[10px] font-normal ml-1">pts</span>
          </p>
        </div>
        {handCount > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-lg leading-none">✋</span>
            <span className="text-card-dim text-[9px]">{handCount}</span>
          </div>
        )}
      </div>

      {/* ── Piles: 2×2 grid ── */}
      <div className="grid grid-cols-2 gap-2 p-2 border-b border-board-border/40">
        <DeckPile
          count={deckCount}
          canDraw={canDraw}
          onDraw={onDraw}
        />
        <DiscardPile
          count={discardCount}
          topCard={discardTop}
          onBrowse={onDiscardBrowse}
        />
        <DilemmaPile
          count={dilemmaCount}
          faceUpCount={dilemmaFaceUp}
          isOpponent={!isYours}
        />
        <RemovedPile count={removedCount} />
      </div>

      {/* ── Core ── */}
      <div className="p-2 border-b border-board-border/40">
        <CoreArea events={coreEvents} onCardClick={onCoreCardClick} />
      </div>

      {/* ── Brig ── */}
      <div className="p-2">
        <BrigArea captives={brigCaptives} onCardClick={onBrigCardClick} />
      </div>
    </div>
  );
}
