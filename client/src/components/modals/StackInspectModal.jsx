import { createPortal } from 'react-dom';
import CardComponent from '../card/CardComponent.jsx';
import CardBack from '../card/CardBack.jsx';

/**
 * StackInspectModal — opened when a player clicks a personnel stack or a ship.
 *
 * Owner view  (isYours = true):
 *   Full card details, stopped cards visually dimmed and labelled,
 *   equipment listed separately.
 *
 * Opponent view (isYours = false):
 *   Anonymous card backs only — the number of cards is still hidden,
 *   showing only "N cards present" without individual identity.
 *   (Per the rulebook, personnel are face-down and private.)
 *
 * Props:
 *   isOpen       bool
 *   onClose      fn
 *   title        string         e.g. "U.S.S. Enterprise-D — Crew"
 *   context      string         "ship" | "mission" | "planet"
 *   isYours      bool
 *   personnel    CardInstance[] full card objects (owner) or stubs (opponent)
 *   equipment    CardInstance[] equipment present (shown separately)
 */
export default function StackInspectModal({
  isOpen,
  onClose,
  title = 'Inspect',
  context = 'mission',
  isYours = true,
  personnel = [],
  equipment = [],
}) {
  if (!isOpen) return null;

  const totalCards = personnel.length + equipment.length;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-full max-w-2xl max-h-[80vh] flex flex-col
                      bg-board-surface border border-board-border rounded-xl
                      shadow-2xl shadow-black/80 overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3
                        border-b border-board-border bg-board-bg/60 flex-shrink-0">
          <div>
            <h2 className="text-lcars-gold font-bold text-sm uppercase tracking-widest">
              {title}
            </h2>
            <p className="text-card-dim text-[10px] mt-0.5">
              {isYours
                ? `${personnel.length} personnel · ${equipment.length} equipment`
                : `${totalCards} card${totalCards !== 1 ? 's' : ''} present (private)`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-card-dim hover:text-card-text text-xl leading-none
                       w-7 h-7 flex items-center justify-center rounded
                       hover:bg-board-accent transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {totalCards === 0 && (
            <p className="text-card-dim text-sm italic text-center py-4">
              {context === 'ship' ? 'No crew aboard.' : 'No personnel present.'}
            </p>
          )}

          {/* ── Owner view ─────────────────────────────────────────── */}
          {isYours && (
            <div className="space-y-5">

              {/* Personnel section */}
              {personnel.length > 0 && (
                <section>
                  <h3 className="text-[10px] uppercase tracking-widest text-card-dim mb-3">
                    Personnel ({personnel.length})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {personnel.map((p) => (
                      <div key={p.instanceId} className="flex flex-col items-center gap-1">
                        <CardComponent
                          card={p}
                          size="lg"
                          stopped={p.stopped}
                        />
                        {p.stopped && (
                          <span className="text-[9px] text-red-400 uppercase tracking-wider
                                           bg-red-900/30 border border-red-800/50 px-1.5 py-0.5 rounded">
                            Stopped
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Equipment section */}
              {equipment.length > 0 && (
                <section>
                  <div className="h-px bg-board-border mb-4" />
                  <h3 className="text-[10px] uppercase tracking-widest text-card-dim mb-3">
                    Equipment ({equipment.length})
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {equipment.map((e) => (
                      <CardComponent
                        key={e.instanceId}
                        card={e}
                        size="lg"
                      />
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}

          {/* ── Opponent view ───────────────────────────────────────── */}
          {!isYours && totalCards > 0 && (
            <div className="space-y-4">
              <p className="text-card-dim text-xs italic">
                These cards are face-down and private to their owner.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalCards }).map((_, i) => (
                  <CardBack key={i} size="lg" />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-board-border bg-board-bg/40
                        flex justify-end flex-shrink-0">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}
