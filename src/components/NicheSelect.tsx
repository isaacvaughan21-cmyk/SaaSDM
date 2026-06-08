import { useState } from 'react';

type Props = {
  value: string;
  niches: string[];
  onChange: (v: string) => void;
};

/**
 * Pick an existing niche from a dropdown, or add a new one. New niches become
 * selectable for other ideas once saved (the parent rebuilds the niche list).
 */
export function NicheSelect({ value, niches, onChange }: Props) {
  // start in "add" mode if there's nothing to pick from yet
  const [adding, setAdding] = useState(niches.length === 0);

  const inputClass =
    'w-full border border-line rounded-lg px-3 py-2 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted';

  if (adding) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Developer tools, Fitness, Fintech"
          className={inputClass}
        />
        {niches.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              onChange('');
            }}
            className="px-3 py-2 rounded-lg text-xs text-muted hover:bg-ink-50 transition-colors shrink-0"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <select
      value={niches.includes(value) ? value : ''}
      onChange={(e) => {
        if (e.target.value === '__new__') {
          setAdding(true);
          onChange('');
        } else {
          onChange(e.target.value);
        }
      }}
      className={inputClass}
    >
      <option value="">No niche</option>
      {niches.map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
      <option value="__new__">+ Add new niche…</option>
    </select>
  );
}
