import { useEffect, useRef } from 'react';

const ENTRY_STYLES = {
  action:   'text-card-text',
  system:   'text-lcars-gold',
  error:    'text-red-400',
  player1:  'text-lcars-blue',
  player2:  'text-red-400',
};

/**
 * GameLog — auto-scrolling list of game events.
 *
 * Props:
 *   entries  [{ id, type, message, timestamp }]
 */
export default function GameLog({ entries = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[10px] uppercase tracking-widest text-card-dim px-2 pt-2 pb-1
                     border-b border-board-border flex-shrink-0">
        Game Log
      </h3>
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {entries.length === 0 ? (
          <p className="text-card-dim text-xs italic mt-2">Awaiting first action…</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex gap-1.5 items-start">
              <span className="text-card-dim text-[9px] flex-shrink-0 mt-0.5 tabular-nums">
                {formatTime(entry.timestamp)}
              </span>
              <p className={`text-[11px] leading-relaxed ${
                ENTRY_STYLES[entry.type] ?? ENTRY_STYLES.action
              }`}>
                {entry.message}
              </p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}
