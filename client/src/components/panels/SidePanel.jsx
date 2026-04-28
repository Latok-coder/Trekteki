import { useState } from 'react';
import GameLog from './GameLog.jsx';
import Chat from './Chat.jsx';

const TABS = ['Log', 'Chat'];

/**
 * SidePanel — Log and Chat tabs, now lives on the LEFT side.
 */
export default function SidePanel({ logEntries = [], chatMessages = [] }) {
  const [tab, setTab] = useState('Log');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`
      flex flex-col bg-board-surface
      transition-all duration-200 flex-shrink-0
      ${collapsed ? 'w-7' : 'w-48'}
    `}>
      {/* Collapse toggle */}
      <button
        className="flex items-center justify-center h-8 border-b border-board-border
                   hover:bg-board-accent transition-colors text-card-dim hover:text-card-text
                   flex-shrink-0"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        <span className="text-xs">{collapsed ? '▶' : '◀'}</span>
      </button>

      {!collapsed && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-board-border flex-shrink-0">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`
                  flex-1 py-1.5 text-[10px] uppercase tracking-wider transition-colors
                  ${tab === t
                    ? 'text-lcars-gold border-b border-lcars-gold bg-board-bg/30'
                    : 'text-card-dim hover:text-card-text'}
                `}
              >
                {t}
                {t === 'Chat' && chatMessages.length > 0 && (
                  <span className="ml-1 text-[8px] text-red-400">●</span>
                )}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {tab === 'Log'  && <GameLog entries={logEntries} />}
            {tab === 'Chat' && <Chat messages={chatMessages} />}
          </div>
        </>
      )}
    </div>
  );
}
