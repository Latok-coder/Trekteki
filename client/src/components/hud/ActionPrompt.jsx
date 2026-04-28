/**
 * ActionPrompt — bottom-centre HUD element.
 * Shows the current contextual prompt and primary action buttons.
 *
 * Props:
 *   prompt      string       instruction text
 *   actions     [{ id, label, variant, disabled, onClick }]
 */
export default function ActionPrompt({ prompt, actions = [] }) {
  if (!prompt && actions.length === 0) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2
                    bg-board-surface/90 border border-lcars-gold/30 rounded-lg
                    backdrop-blur-sm">
      {/* Prompt text */}
      {prompt && (
        <p className="text-card-text text-xs flex-1 leading-snug">
          {prompt}
        </p>
      )}

      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="flex gap-2 flex-shrink-0">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider
                transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed
                ${action.variant === 'primary'
                  ? 'bg-lcars-gold/20 border border-lcars-gold/60 text-lcars-gold hover:bg-lcars-gold/30'
                  : action.variant === 'danger'
                  ? 'bg-red-900/30 border border-red-600/60 text-red-400 hover:bg-red-900/50'
                  : 'bg-board-accent border border-board-border text-card-text hover:border-board-border/80'}
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
