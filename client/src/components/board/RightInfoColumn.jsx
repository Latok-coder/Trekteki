import PlayerInfoPanel from './PlayerInfoPanel.jsx';

/**
 * RightInfoColumn — both players' info panels in one fixed-width column.
 * Opponent on top, you on bottom, separated by a divider.
 */
export default function RightInfoColumn({ my, opp }) {
  return (
    <div className="w-52 flex-shrink-0 flex flex-col gap-2
                    bg-board-surface/60 border-l border-board-border p-2 overflow-y-auto">

      {/* Opponent panel */}
      <PlayerInfoPanel
        isYours={false}
        playerName={opp.playerName}
        score={opp.score}
        handCount={opp.handCount}
        deckCount={opp.deckCount}
        discardCount={opp.discardCount}
        discardTop={opp.discardTop}
        dilemmaCount={opp.dilemmaCount}
        dilemmaFaceUp={opp.dilemmaFaceUp}
        removedCount={opp.removedCount ?? 0}
        coreEvents={opp.coreEvents}
        brigCaptives={opp.brigCaptives}
        onDiscardBrowse={opp.onDiscardBrowse}
        onCoreCardClick={opp.onCoreCardClick}
        onBrigCardClick={opp.onBrigCardClick}
      />

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-board-border" />
        <span className="text-board-border text-[9px] uppercase tracking-wider flex-shrink-0">vs</span>
        <div className="flex-1 h-px bg-board-border" />
      </div>

      {/* Your panel */}
      <PlayerInfoPanel
        isYours={true}
        playerName={my.playerName}
        score={my.score}
        handCount={my.handCount}
        deckCount={my.deckCount}
        discardCount={my.discardCount}
        discardTop={my.discardTop}
        dilemmaCount={my.dilemmaCount}
        dilemmaFaceUp={my.dilemmaFaceUp}
        removedCount={my.removedCount ?? 0}
        coreEvents={my.coreEvents}
        brigCaptives={my.brigCaptives}
        canDraw={my.canDraw}
        onDraw={my.onDraw}
        onDiscardBrowse={my.onDiscardBrowse}
        onCoreCardClick={my.onCoreCardClick}
        onBrigCardClick={my.onBrigCardClick}
      />
    </div>
  );
}
