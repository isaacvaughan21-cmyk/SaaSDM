import { useState } from 'react';

type Props = {
  label: string;
  weightPct: number;
  anchors: string;
  value: number;
  onChange: (value: number) => void;
};

export function ScoreSlider({ label, weightPct, anchors, value, onChange }: Props) {
  const [showAnchors, setShowAnchors] = useState(false);
  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
            {Math.round(weightPct * 100)}%
          </span>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 text-xs"
            onMouseEnter={() => setShowAnchors(true)}
            onMouseLeave={() => setShowAnchors(false)}
            onClick={() => setShowAnchors((s) => !s)}
            aria-label={`Scoring anchors for ${label}`}
          >
            ⓘ
          </button>
        </div>
        <span className="text-sm font-semibold tabular-nums w-4 text-right text-slate-800">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
      {showAnchors && (
        <p className="mt-1 text-xs text-slate-500 leading-snug">{anchors}</p>
      )}
    </div>
  );
}
