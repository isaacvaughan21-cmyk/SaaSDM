import { CRITERIA, PILLAR_LABELS, PILLAR_DESCRIPTIONS } from '../state/defaults';
import type { PillarKey } from '../state/types';

const PILLARS: PillarKey[] = ['desirability', 'feasibility', 'viability'];

export function RubricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 text-left">
      {PILLARS.map((pillar) => (
        <div key={pillar} className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="font-semibold text-slate-800">
            {PILLAR_LABELS[pillar]} <span className="text-slate-400 text-xs">(33.3%)</span>
          </h4>
          <p className="text-xs text-slate-500 leading-snug mt-1 mb-3">
            {PILLAR_DESCRIPTIONS[pillar]}
          </p>
          <ul className="space-y-3">
            {CRITERIA[pillar].map((c) => (
              <li key={c.key} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{c.label}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {c.weightPct}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug mt-0.5">{c.description}</p>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">
                  <span className="font-semibold text-slate-500">Scoring:</span> {c.anchors}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
