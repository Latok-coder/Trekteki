import LeftPanel from './LeftPanel.jsx';
import MissionRow from './MissionRow.jsx';
import RightInfoColumn from './RightInfoColumn.jsx';
import { PlayerHand, OpponentHandCount } from '../hand/PlayerHand.jsx';

/**
 * GameBoard — root board layout.
 *
 * 4-column layout (left → right):
 *   [Log/Chat | HUD strip]  [Center: missions]  [Right: player info]
 *
 * Center column (top → bottom):
 *   Opponent hand (face-down)
 *   Opponent missions  ← ships from either side can appear here
 *   ── separator ──
 *   Your missions      ← ships from either side can appear here
 *   Your hand (face-up, playable)
 */
export default function GameBoard({ vm }) {
  const {
    myName, oppName,
    myScore, oppScore,
    myPlanetDone, mySpaceDone,
    oppPlanetDone, oppSpaceDone,

    phase, subPhase, isMyTurn,
    countersRemaining,
    actionPrompt, actionButtons,

    myHand, myHandSelectedId,
    oppHandCount,

    myMissions, oppMissions,

    logEntries, chatMessages,

    onCardClick,
    onMissionClick, onPersonnelClick, onShipClick, onCrewClick,
    onDraw, onDiscardBrowse,
    onCoreCardClick, onBrigCardClick,

    myDeckCount, myDiscardCount, myDiscardTop,
    myDilemmaCount, myDilemmaFaceUp,
    myRemovedCount, myCoreEvents, myBrigCaptives, canDraw,

    oppDeckCount, oppDiscardCount, oppDiscardTop,
    oppDilemmaCount, oppDilemmaFaceUp,
    oppRemovedCount, oppCoreEvents, oppBrigCaptives,
    oppHandCount: _oppHandCount,
  } = vm;

  return (
    <div className="flex h-screen overflow-hidden bg-starfield">

      {/* ── Column 1+2: Log/Chat + HUD ── */}
      <LeftPanel
        logEntries={logEntries}
        chatMessages={chatMessages}
        phase={phase}
        subPhase={subPhase}
        isMyTurn={isMyTurn}
        countersRemaining={countersRemaining}
        actionPrompt={actionPrompt}
        actionButtons={actionButtons}
        myScore={myScore}
        oppScore={oppScore}
        myPlanetDone={myPlanetDone}
        mySpaceDone={mySpaceDone}
        oppPlanetDone={oppPlanetDone}
        oppSpaceDone={oppSpaceDone}
      />

      {/* ── Column 3: Center board ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Opponent hand */}
        <OpponentHandCount count={oppHandCount} />

        {/* Opponent missions — their ships above, your visiting ships below */}
        <div className="flex-1 overflow-x-auto overflow-y-auto px-2 pt-2">
          <MissionRow missions={oppMissions} isYours={false} />
        </div>

        {/* Center divider — the "space lane" between the two sides */}
        <div className="flex items-center gap-2 px-4 py-1 flex-shrink-0">
          <div className="flex-1 h-px bg-board-border/60" />
          <span className="text-board-border text-[9px] uppercase tracking-widest flex-shrink-0">
            ── space ──
          </span>
          <div className="flex-1 h-px bg-board-border/60" />
        </div>

        {/* Your missions — opponent visiting ships above, your ships below */}
        <div className="flex-1 overflow-x-auto overflow-y-auto px-2 pb-2">
          <MissionRow missions={myMissions} isYours={true} />
        </div>

        {/* Your hand */}
        <PlayerHand
          cards={myHand}
          selectedId={myHandSelectedId}
          onCardClick={onCardClick}
        />
      </div>

      {/* ── Column 4: Player info ── */}
      <RightInfoColumn
        opp={{
          playerName: oppName,
          score: oppScore,
          handCount: oppHandCount,
          deckCount: oppDeckCount,
          discardCount: oppDiscardCount,
          discardTop: oppDiscardTop,
          dilemmaCount: oppDilemmaCount,
          dilemmaFaceUp: oppDilemmaFaceUp,
          removedCount: oppRemovedCount ?? 0,
          coreEvents: oppCoreEvents,
          brigCaptives: oppBrigCaptives,
          onDiscardBrowse,
          onCoreCardClick,
          onBrigCardClick,
        }}
        my={{
          playerName: myName,
          score: myScore,
          handCount: myHand?.length ?? 0,
          deckCount: myDeckCount,
          discardCount: myDiscardCount,
          discardTop: myDiscardTop,
          dilemmaCount: myDilemmaCount,
          dilemmaFaceUp: myDilemmaFaceUp,
          removedCount: myRemovedCount ?? 0,
          coreEvents: myCoreEvents,
          brigCaptives: myBrigCaptives,
          canDraw,
          onDraw,
          onDiscardBrowse,
          onCoreCardClick,
          onBrigCardClick,
        }}
      />

    </div>
  );
}
