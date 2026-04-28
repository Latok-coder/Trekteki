const PHASES = [
  { id: 'play_draw',       label: 'Play & Draw' },
  { id: 'execute_orders',  label: 'Execute Orders' },
  { id: 'discard_excess',  label: 'Discard' },
];

const SUB_PHASE_LABELS = {
  beaming:              'Beaming',
  moving:               'Moving Ship',
  mission_attempt:      'Mission Attempt',
  drawing_dilemmas:     'Drawing Dilemmas',
  facing_dilemma:       'Facing Dilemma',
  checking_requirements:'Checking Requirements',
};

/**
 * PhaseIndicator — breadcrumb-style display of current phase and sub-phase.
 */
export default function PhaseIndicator({ phase, subPhase, isMyTurn = false }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      {/* Turn indicator */}
      <div className={`text-[9px] uppercase tracking-widest font-bold ${
        isMyTurn ? 'text-lcars-gold' : 'text-card-dim'
      }`}>
        {isMyTurn ? '▶ Your Turn' : '⏳ Opponent\'s Turn'}
      </div>

      {/* Phase steps */}
      <div className="flex items-center gap-1">
        {PHASES.map((p, i) => {
          const isActive  = p.id === phase;
          const isPast    = PHASES.findIndex(x => x.id === phase) > i;
          return (
            <div key={p.id} className="flex items-center gap-1">
              <div className={`
                flex items-center gap-1 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider
                transition-all duration-300
                ${isActive  ? 'bg-lcars-gold/20 text-lcars-gold border border-lcars-gold/50' :
                  isPast    ? 'text-card-dim line-through opacity-50' :
                              'text-card-dim opacity-40'}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive ? 'bg-lcars-gold animate-pulse' :
                  isPast   ? 'bg-board-border' : 'bg-board-border'
                }`} />
                {p.label}
              </div>
              {i < PHASES.length - 1 && (
                <span className="text-board-border text-[9px]">›</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sub-phase */}
      {subPhase && SUB_PHASE_LABELS[subPhase] && (
        <div className="text-[9px] text-red-400 animate-pulse uppercase tracking-wider">
          ↳ {SUB_PHASE_LABELS[subPhase]}
        </div>
      )}
    </div>
  );
}
