import { CRITERIA, PILLAR_LABELS, PILLAR_DESCRIPTIONS } from '../state/defaults';
import type { PillarKey } from '../state/types';

const PILLARS: PillarKey[] = ['desirability', 'feasibility', 'viability'];

// Each pillar gets its own accent so the header reads as a distinct group heading.
const PILLAR_ACCENT: Record<PillarKey, { bar: string; text: string }> = {
  desirability: { bar: 'bg-good', text: 'text-good' },
  feasibility: { bar: 'bg-mid', text: 'text-mid' },
  viability: { bar: 'bg-[#009E73]', text: 'text-[#009E73]' },
};

export function RubricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 text-left">
      {PILLARS.map((pillar) => {
        const accent = PILLAR_ACCENT[pillar];
        return (
          <div
            key={pillar}
            className="rounded-lg border border-slate-200 bg-white overflow-hidden"
          >
            {/* Pillar header band — clearly separated from the sub-criteria */}
            <div className={`${accent.bar} px-4 py-3 text-white`}>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base tracking-tight">{PILLAR_LABELS[pillar]}</h4>
                <span className="text-[11px] font-semibold bg-white/25 rounded px-1.5 py-0.5">
                  33.3%
                </span>
              </div>
              <p className="text-xs text-white/90 leading-snug mt-1">
                {PILLAR_DESCRIPTIONS[pillar]}
              </p>
            </div>

            {/* Sub-criteria */}
            <ul className="divide-y divide-slate-100">
              {CRITERIA[pillar].map((c) => (
                <li key={c.key} className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${accent.text}`}>{c.label}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {c.weightPct}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug mt-1">{c.description}</p>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1">
                    <span className="font-semibold text-slate-500">Scoring:</span> {c.anchors}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
