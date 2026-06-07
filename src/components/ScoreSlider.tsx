import { useState } from 'react';

type Props = {
  label: string;
  weightPct: number;
  description: string;
  anchors: string;
  value: number;
  onChange: (value: number) => void;
};

export function ScoreSlider({ label, weightPct, description, anchors, value, onChange }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{label}</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-line text-muted">
            {Math.round(weightPct * 100)}%
          </span>
          {/* info button — reveals a one-line description of the criterion */}
          <span className="relative inline-flex">
            <button
              type="button"
              onClick={() => setShowInfo((s) => !s)}
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              onFocus={() => setShowInfo(true)}
              onBlur={() => setShowInfo(false)}
              aria-label={`What is ${label}?`}
              className="w-4 h-4 flex items-center justify-center rounded-full border border-line text-[10px] font-semibold text-muted hover:border-ink hover:text-ink transition-colors"
            >
              i
            </button>
            {showInfo && (
              <span
                role="tooltip"
                className="absolute left-1/2 bottom-full z-20 mb-1.5 w-56 -translate-x-1/2 rounded-md bg-ink px-3 py-2 text-xs leading-snug text-paper shadow-lift"
              >
                {description}
              </span>
            )}
          </span>
        </div>
        <span className="text-sm font-semibold tabular-nums w-4 text-right text-ink">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink"
      />
      {/* Scoring anchors always visible */}
      <p className="mt-1 text-xs text-muted leading-snug">{anchors}</p>
    </div>
  );
}
