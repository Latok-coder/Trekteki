import { createPortal } from 'react-dom';
import { useState } from 'react';
import { exportAsText } from '../../utils/deckImporter.js';

/**
 * DeckExportModal — export the active deck as plain text or JSON.
 *
 * Props:
 *   isOpen    bool
 *   onClose   fn()
 *   deck      DeckObject
 *   cardDefs  { [id]: CardDefinition }
 */
export default function DeckExportModal({ isOpen, onClose, deck, cardDefs = {} }) {
  const [format,  setFormat]  = useState('text'); // 'text' | 'json'
  const [copied,  setCopied]  = useState(false);

  if (!isOpen || !deck) return null;

  const textOutput = format === 'json'
    ? JSON.stringify(deck, null, 2)
    : exportAsText(deck, cardDefs);

  function handleCopy() {
    navigator.clipboard.writeText(textOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const ext      = format === 'json' ? 'json' : 'txt';
    const filename = `${deck.name.replace(/\s+/g, '_')}.${ext}`;
    const blob     = new Blob([textOutput], { type: 'text/plain' });
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-full max-w-xl flex flex-col
                      bg-board-surface border border-board-border rounded-xl
                      shadow-2xl shadow-black/80 overflow-hidden animate-fade-in
                      max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3
                        border-b border-board-border flex-shrink-0">
          <h2 className="text-lcars-gold font-bold text-sm uppercase tracking-widest">
            Export Deck
          </h2>
          <button onClick={onClose}
                  className="text-card-dim hover:text-card-text text-xl w-7 h-7
                             flex items-center justify-center rounded
                             hover:bg-board-accent transition-colors">
            ✕
          </button>
        </div>

        {/* Format tabs */}
        <div className="flex border-b border-board-border flex-shrink-0">
          {[
            { id: 'text', label: 'Plain Text (trekcc.org)' },
            { id: 'json', label: 'JSON' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`flex-1 py-2 text-xs uppercase tracking-wider transition-colors
                          ${format === f.id
                            ? 'text-lcars-gold border-b-2 border-lcars-gold bg-board-bg/30'
                            : 'text-card-dim hover:text-card-text'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Text output */}
        <div className="flex-1 overflow-hidden p-4">
          <textarea
            className="w-full h-full bg-board-bg border border-board-border rounded
                       px-3 py-2 text-xs text-card-text font-mono resize-none
                       focus:outline-none focus:border-lcars-blue/60"
            value={textOutput}
            readOnly
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3
                        border-t border-board-border flex-shrink-0">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close
          </button>
          <button onClick={handleDownload} className="btn-secondary text-xs">
            ⬇ Download
          </button>
          <button
            onClick={handleCopy}
            className={`text-xs px-4 py-2 rounded border font-bold uppercase
                        tracking-wider transition-all duration-200
                        ${copied
                          ? 'bg-green-900/30 border-green-700/50 text-green-400'
                          : 'bg-lcars-gold/15 border-lcars-gold/50 text-lcars-gold hover:bg-lcars-gold/25'}`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

      </div>
    </>,
    document.body
  );
}
