/**
 * CardSearchBar — text search input with clear button.
 * The actual debounce lives in useCardSearch; this is purely presentational.
 */
export default function CardSearchBar({ value, onChange }) {
  return (
    <div className="relative">
      {/* Search icon */}
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2
                       text-card-dim text-xs pointer-events-none">
        🔍
      </span>

      <input
        type="text"
        className="w-full bg-board-bg border border-board-border rounded
                   pl-7 pr-7 py-1.5 text-xs text-card-text
                   placeholder-card-dim focus:outline-none
                   focus:border-lcars-blue/60 transition-colors"
        placeholder="Search by name or text…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      {/* Clear button */}
      {value && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2
                     text-card-dim hover:text-card-text text-sm leading-none
                     transition-colors"
          onClick={() => onChange('')}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
