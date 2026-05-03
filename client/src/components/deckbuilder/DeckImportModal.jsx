import { createPortal } from 'react-dom';
import { useState } from 'react';
import { parseDecklist } from '../../utils/deckImporter.js';

/**
 * DeckImportModal — accepts a pasted plain-text decklist and imports it.
 *
 * Props:
 *   isOpen      bool
 *   onClose     fn()
 *   onImport    fn(deckObject)   called with the parsed deck on confirm
 *   cardIndex   CardDefinition[] from /api/cards — used for title→ID matching
 */
export default function DeckImportModal({ isOpen, onClose, onImport, cardIndex = [] }) {
  const [text,     setText]     = useState('');
  const [preview,  setPreview]  = useState(null);  // { ok, deck?, warnings?, error? }
  const [step,     setStep]     = useState('paste'); // 'paste' | 'preview'

  if (!isOpen) return null;

  function handleParse() {
    const result = parseDecklist(text, cardIndex);
    setPreview(result);
    setStep('preview');
  }

  function handleConfirm() {
    if (preview?.ok) {
      onImport(preview.deck);
      handleClose();
    }
  }

  function handleClose() {
    setText('');
    setPreview(null);
    setStep('paste');
    onClose();
  }

  const deckCount    = preview?.deck?.deck?.reduce((n, e) => n + e.count, 0) ?? 0;
  const dilemmaCount = preview?.deck?.dilemmas?.reduce((n, e) => n + e.count, 0) ?? 0;
  const missionCount = preview?.deck?.missions?.length ?? 0;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={handleClose} />

      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-full max-w-xl flex flex-col
                      bg-board-surface border border-board-border rounded-xl
                      shadow-2xl shadow-black/80 overflow-hidden animate-fade-in
                      max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3
                        border-b border-board-border flex-shrink-0">
          <h2 className="text-lcars-gold font-bold text-sm uppercase tracking-widest">
            Import Deck
          </h2>
          <button onClick={handleClose}
                  className="text-card-dim hover:text-card-text text-xl w-7 h-7
                             flex items-center justify-center rounded
                             hover:bg-board-accent transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {step === 'paste' && (
            <>
              <p className="text-card-dim text-xs leading-relaxed">
                Paste a plain-text decklist below. The following formats are supported:
              </p>
              <pre className="text-[10px] text-card-dim bg-board-bg rounded p-3 leading-relaxed">
{`Deck Name: My Deck

Missions:
1x Earth, Cradle of the Federation
1x Forcas Sector, Fissure Research

Draw Deck (35):
3x Davies
1x Jean-Luc Picard, Genial Captain

Dilemma Pile (20):
2x Dark Page
1x Family`}
              </pre>
              <textarea
                className="w-full h-48 bg-board-bg border border-board-border rounded
                           px-3 py-2 text-xs text-card-text placeholder-card-dim
                           focus:outline-none focus:border-lcars-blue/60
                           font-mono resize-none"
                placeholder="Paste decklist here…"
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
              />
            </>
          )}

          {step === 'preview' && preview && (
            <>
              {preview.ok ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-sm">✓</span>
                    <span className="text-card-text text-sm font-bold">
                      {preview.deck.name}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Missions', count: missionCount, ok: missionCount === 5 },
                      { label: 'Deck',     count: deckCount,    ok: deckCount >= 35 },
                      { label: 'Dilemmas', count: dilemmaCount, ok: dilemmaCount >= 20 },
                    ].map(s => (
                      <div key={s.label}
                           className="panel-inset text-center">
                        <p className={`text-lg font-bold ${s.ok ? 'text-green-400' : 'text-lcars-gold'}`}>
                          {s.count}
                        </p>
                        <p className="text-card-dim text-[10px] uppercase tracking-wider">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Warnings */}
                  {preview.warnings?.length > 0 && (
                    <div className="bg-amber-900/20 border border-amber-700/50
                                    rounded p-3 space-y-1">
                      <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                        {preview.warnings.length} unmatched card{preview.warnings.length > 1 ? 's' : ''}
                      </p>
                      {preview.warnings.map((w, i) => (
                        <p key={i} className="text-amber-400/80 text-[10px]">{w}</p>
                      ))}
                      <p className="text-card-dim text-[10px] mt-1">
                        These entries were kept using their raw text as the ID.
                        You can fix them in the deck editor after importing.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-900/20 border border-red-700/50 rounded p-4">
                  <p className="text-red-400 font-bold text-sm">Parse failed</p>
                  <p className="text-red-400/80 text-xs mt-1">{preview.error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3
                        border-t border-board-border flex-shrink-0 gap-3">
          {step === 'paste' && (
            <>
              <button onClick={handleClose} className="btn-secondary text-xs">
                Cancel
              </button>
              <button
                onClick={handleParse}
                disabled={!text.trim()}
                className="btn-primary text-xs disabled:opacity-40"
              >
                Preview →
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button onClick={() => setStep('paste')} className="btn-secondary text-xs">
                ← Back
              </button>
              {preview?.ok && (
                <button onClick={handleConfirm} className="btn-gold text-xs">
                  Import Deck
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </>,
    document.body
  );
}
