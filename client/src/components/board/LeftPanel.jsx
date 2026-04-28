import SidePanel from '../panels/SidePanel.jsx';
import HudStrip from './HudStrip.jsx';

/**
 * LeftPanel — the full left edge of the board.
 * Left half:  Log / Chat tabs (SidePanel)
 * Right half: Vertical HUD strip (phase, counters, score, actions)
 */
export default function LeftPanel({
  logEntries = [],
  chatMessages = [],
  // HUD props
  phase,
  subPhase,
  isMyTurn,
  countersRemaining,
  actionPrompt,
  actionButtons,
  myScore,
  oppScore,
  myPlanetDone,
  mySpaceDone,
  oppPlanetDone,
  oppSpaceDone,
}) {
  return (
    <div className="flex flex-shrink-0 border-r border-board-border h-full">
      {/* Log / Chat */}
      <SidePanel logEntries={logEntries} chatMessages={chatMessages} />

      {/* Vertical HUD */}
      <HudStrip
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
    </div>
  );
}
