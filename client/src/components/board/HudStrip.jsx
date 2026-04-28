import ScoreTracker from '../hud/ScoreTracker.jsx';
import CounterBudget from '../hud/CounterBudget.jsx';
import PhaseIndicator from '../hud/PhaseIndicator.jsx';
import ActionPrompt from '../hud/ActionPrompt.jsx';

const PHASES = [
  { id: 'play_draw',      short: 'Play',    label: 'Play & Draw' },
  { id: 'execute_orders', short: 'Orders',  label: 'Execute Orders' },
  { id: 'discard_excess', short: 'Discard', label: 'Discard' },
];

/**
 * HudStrip — narrow vertical column to the right of the chat panel.
 * Contains (top to bottom):
 *   - Turn indicator
 *   - Phase steps
 *   - Counter budget
 *   - Action buttons
 */
export default function HudStrip({
  phase,
  subPhase,
  isMyTurn = false,
  countersRemaining = 7,
  actionPrompt,
  actionButtons = [],
  myScore = 0,
  oppScore = 0,
  myPlanetDone = false,
  mySpaceDone = false,
  oppPlanetDone = false,
  oppSpaceDone = false,
}) {
  return (
    <div className="w-28 flex-shrink-0 flex flex-col gap-3
                    bg-board-surface/80 border-r border-board-border
                    px-2 py-3 overflow-y-auto">

      {/* ── Turn indicator ── */}
      <div className={`
        text-center py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest
        ${isMyTurn
          ? 'border-lcars-gold/50 bg-lcars-gold/10 text-lcars-gold'
          : 'border-board-border bg-board-bg/40 text-card-dim'}
      `}>
        {isMyTurn ? '▶ Your Turn' : '⏳ Theirs'}
      </div>

      {/* ── Phase steps (vertical) ── */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-widest text-card-dim text-center">Phase</span>
        {PHASES.map((p, i) => {
          const activeIdx = PHASES.findIndex(x => x.id === phase);
          const isActive  = p.id === phase;
          const isPast    = activeIdx > i;
          return (
            <div
              key={p.id}
              className={`
                text-center py-1 rounded text-[9px] uppercase tracking-wider
                transition-all duration-200 border
                ${isActive
                  ? 'bg-lcars-gold/15 border-lcars-gold/50 text-lcars-gold'
                  : isPast
                  ? 'border-transparent text-card-dim opacity-40 line-through'
                  : 'border-transparent text-card-dim opacity-40'}
              `}
            >
              {isActive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-lcars-gold
                                 animate-pulse mr-1 align-middle" />
              )}
              {p.short}
            </div>
          );
        })}
        {/* Sub-phase */}
        {subPhase && (
          <div className="text-center text-[9px] text-red-400 animate-pulse
                          border border-red-900/40 rounded py-0.5 bg-red-950/20">
            {subPhase.replace(/_/g, ' ')}
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-board-border" />

      {/* ── Counter budget ── */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[9px] uppercase tracking-widest text-card-dim">Counters</span>
        {/* Pips in 2 rows of 4/3 */}
        <div className="flex flex-wrap justify-center gap-1 w-full">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`
                w-4 h-4 rounded-full border transition-all duration-200
                ${i < countersRemaining
                  ? isMyTurn
                    ? 'bg-lcars-gold border-lcars-gold shadow-sm shadow-lcars-gold/40'
                    : 'bg-lcars-gold/40 border-lcars-gold/40'
                  : 'bg-board-border border-board-border opacity-30'}
              `}
            />
          ))}
        </div>
        <span className={`text-[10px] font-bold tabular-nums
                          ${isMyTurn ? 'text-lcars-gold' : 'text-card-dim'}`}>
          {countersRemaining}/7
        </span>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-board-border" />

      {/* ── Score summary (compact) ── */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-widest text-card-dim text-center">Score</span>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-red-400 font-bold">{oppScore}</span>
          <span className="text-card-dim">vs</span>
          <span className="text-lcars-blue font-bold">{myScore}</span>
        </div>
        {/* Progress to 100 */}
        <div className="relative w-full h-2 bg-board-border rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-lcars-blue/60 rounded-full transition-all duration-500"
               style={{ width: `${Math.min(100, myScore)}%` }} />
          <div className="absolute right-0 top-0 h-full bg-red-500/60 rounded-full transition-all duration-500"
               style={{ width: `${Math.min(100, oppScore)}%`, transformOrigin:'right' }} />
        </div>
        {/* Win condition pips */}
        <div className="flex justify-between text-sm">
          <span title="Opponent planet/space" className="space-x-0.5">
            <span className={oppPlanetDone ? 'opacity-100' : 'opacity-20'}>🌍</span>
            <span className={oppSpaceDone  ? 'opacity-100' : 'opacity-20'}>🚀</span>
          </span>
          <span title="Your planet/space" className="space-x-0.5">
            <span className={myPlanetDone ? 'opacity-100' : 'opacity-20'}>🌍</span>
            <span className={mySpaceDone  ? 'opacity-100' : 'opacity-20'}>🚀</span>
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-board-border" />

      {/* ── Action buttons ── */}
      <div className="flex flex-col gap-1.5">
        {actionPrompt && (
          <p className="text-[9px] text-card-dim leading-snug text-center">
            {actionPrompt}
          </p>
        )}
        {actionButtons.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              w-full py-1.5 rounded text-[10px] font-bold uppercase tracking-wider
              border transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
              ${action.variant === 'primary'
                ? 'bg-lcars-gold/15 border-lcars-gold/50 text-lcars-gold hover:bg-lcars-gold/25'
                : action.variant === 'danger'
                ? 'bg-red-900/20 border-red-700/50 text-red-400 hover:bg-red-900/30'
                : 'bg-board-accent border-board-border text-card-text hover:border-lcars-blue/30'}
            `}
          >
            {action.label}
          </button>
        ))}
      </div>

    </div>
  );
}
