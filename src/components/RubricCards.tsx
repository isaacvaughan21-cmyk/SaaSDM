import { CRITERIA, PILLAR_LABELS } from '../state/defaults';
import type { PillarKey } from '../state/types';

const PILLARS: PillarKey[] = ['desirability', 'feasibility', 'viability'];

export function RubricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PILLARS.map((pillar) => (
        <div key={pillar} className="rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="font-semibold text-slate-800 mb-2">
            {PILLAR_LABELS[pillar]} <span className="text-slate-400 text-xs">(33.3%)</span>
          </h4>
          <ul className="space-y-2">
            {CRITERIA[pillar].map((c) => (
              <li key={c.key} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{c.label}</span>
                </div>
                <p className="text-xs text-slate-500 leading-snug">{c.anchors}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
