const TYPES = [
  { value: '',          label: 'All types' },
  { value: 'personnel', label: 'Personnel' },
  { value: 'ship',      label: 'Ship' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'event',     label: 'Event' },
  { value: 'interrupt', label: 'Interrupt' },
  { value: 'mission',   label: 'Mission' },
  { value: 'dilemma',   label: 'Dilemma' },
];

const AFFILIATIONS = [
  { value: '',            label: 'All affiliations' },
  { value: 'federation',  label: 'Federation' },
  { value: 'klingon',     label: 'Klingon' },
  { value: 'romulan',     label: 'Romulan' },
  { value: 'cardassian',  label: 'Cardassian' },
  { value: 'dominion',    label: 'Dominion' },
  { value: 'bajoran',     label: 'Bajoran' },
  { value: 'borg',        label: 'Borg' },
  { value: 'ferengi',     label: 'Ferengi' },
  { value: 'maquis',      label: 'Maquis' },
];

const SETS = [
  { value: '',                       label: 'All sets' },
  { value: 'tng-virtual-starter',    label: 'TNG Starter' },
  { value: 'klingon-virtual-starter',label: 'Klingon Starter' },
  { value: 'shared',                 label: 'Shared' },
];

/**
 * CardBrowserFilters — a row of dropdowns for type, affiliation, set.
 * Each calls onFilter(key, value) when changed.
 */
export default function CardBrowserFilters({ filters, onFilter }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <FilterSelect
        value={filters.type}
        options={TYPES}
        onChange={v => onFilter('type', v)}
      />
      <FilterSelect
        value={filters.affiliation}
        options={AFFILIATIONS}
        onChange={v => onFilter('affiliation', v)}
      />
      <FilterSelect
        value={filters.set}
        options={SETS}
        onChange={v => onFilter('set', v)}
      />
      {/* Clear all filters */}
      {(filters.type || filters.affiliation || filters.set) && (
        <button
          className="text-[10px] text-lcars-blue/70 hover:text-lcars-blue
                     uppercase tracking-wider transition-colors self-center"
          onClick={() => {
            onFilter('type', '');
            onFilter('affiliation', '');
            onFilter('set', '');
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

function FilterSelect({ value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-board-bg border border-board-border rounded px-2 py-1.5
                 text-xs text-card-text focus:outline-none
                 focus:border-lcars-blue/60 transition-colors cursor-pointer"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
