import { useState, useEffect, useRef } from 'react';
import { socket } from '../../socket.js';

/**
 * Chat — simple in-game chat panel.
 */
export default function Chat({ messages = [], myName = 'You' }) {
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('chat:message', { text: text.trim() });
    setText('');
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[10px] uppercase tracking-widest text-card-dim px-2 pt-2 pb-1
                     border-b border-board-border flex-shrink-0">
        Chat
      </h3>
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {messages.map((m) => (
          <div key={m.id} className="text-[11px] leading-snug">
            <span className={`font-bold mr-1 ${
              m.isYou ? 'text-lcars-blue' : 'text-red-400'
            }`}>
              {m.isYou ? 'You' : m.senderName}:
            </span>
            <span className="text-card-text">{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-1 p-2 border-t border-board-border flex-shrink-0">
        <input
          className="flex-1 bg-board-bg border border-board-border rounded px-2 py-1
                     text-[11px] text-card-text placeholder-card-dim
                     focus:outline-none focus:border-lcars-blue/60"
          placeholder="Send a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-2 py-1 bg-board-accent border border-board-border rounded
                     text-[10px] text-card-text hover:border-lcars-blue/50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ↵
        </button>
      </form>
    </div>
  );
}
