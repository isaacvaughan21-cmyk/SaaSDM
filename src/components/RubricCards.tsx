import { CRITERIA, PILLAR_LABELS, PILLAR_DESCRIPTIONS, PILLAR_COLORS } from '../state/defaults';
import type { PillarKey } from '../state/types';

const PILLARS: PillarKey[] = ['desirability', 'feasibility', 'viability'];

export function RubricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 text-left">
      {PILLARS.map((pillar) => {
        const color = PILLAR_COLORS[pillar];
        return (
          <div
            key={pillar}
            className="rounded-xl border border-line bg-surface overflow-hidden shadow-card"
          >
            {/* Pillar header band — clearly separated from the sub-criteria */}
            <div className="px-4 py-3 text-white" style={{ backgroundColor: color }}>
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
            <ul className="divide-y divide-line">
              {CRITERIA[pillar].map((c) => (
                <li key={c.key} className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color }}>
                      {c.label}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-line text-muted">
                      {c.weightPct}%
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-snug mt-1">{c.description}</p>
                  <p className="text-[11px] text-muted leading-snug mt-1">
                    <span className="font-semibold text-muted">Scoring:</span> {c.anchors}
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
