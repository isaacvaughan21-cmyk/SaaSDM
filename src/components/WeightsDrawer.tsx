import { useState } from 'react';
import type { PillarKey, Weights } from '../state/types';
import { CRITERIA, PILLAR_LABELS, defaultWeights } from '../state/defaults';

type Props = {
  weights: Weights;
  onSave: (weights: Weights) => void;
  onClose: () => void;
};

const PILLARS: PillarKey[] = ['desirability', 'feasibility', 'viability'];

export function WeightsDrawer({ weights, onSave, onClose }: Props) {
  // store as integer percentages while editing
  const toPct = (w: Weights): Record<PillarKey, Record<string, number>> => {
    const out = {} as Record<PillarKey, Record<string, number>>;
    for (const p of PILLARS) {
      out[p] = {};
      for (const c of CRITERIA[p]) {
        out[p][c.key] = Math.round((w[p] as Record<string, number>)[c.key] * 100);
      }
    }
    return out;
  };

  const [pct, setPct] = useState(toPct(weights));

  const total = (p: PillarKey) =>
    CRITERIA[p].reduce((sum, c) => sum + (pct[p][c.key] || 0), 0);

  const allValid = PILLARS.every((p) => total(p) === 100);

  const setVal = (p: PillarKey, key: string, value: number) => {
    setPct((prev) => ({ ...prev, [p]: { ...prev[p], [key]: value } }));
  };

  const save = () => {
    if (!allValid) return;
    const w = {} as Weights;
    for (const p of PILLARS) {
      (w[p] as Record<string, number>) = {};
      for (const c of CRITERIA[p]) {
        (w[p] as Record<string, number>)[c.key] = pct[p][c.key] / 100;
      }
    }
    onSave(w);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-line px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">⚙ Sub-criteria weights</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl">
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          <p className="text-sm text-muted">
            Pillar weights are locked at 33.3% each. Within each pillar, the three sub-weights must
            total 100%.
          </p>
          {PILLARS.map((p) => {
            const t = total(p);
            const valid = t === 100;
            return (
              <div key={p} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-ink">{PILLAR_LABELS[p]}</h3>
                  <span
                    className={`text-xs font-semibold ${valid ? 'text-good' : 'text-bad'}`}
                  >
                    {t}%
                  </span>
                </div>
                <div className="space-y-2">
                  {CRITERIA[p].map((c) => (
                    <div key={c.key} className="flex items-center justify-between gap-2">
                      <label className="text-sm text-muted">{c.label}</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={pct[p][c.key]}
                          onChange={(e) => setVal(p, c.key, Number(e.target.value))}
                          className="w-16 rounded border border-line px-2 py-1 text-sm text-right"
                        />
                        <span className="text-muted text-sm">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-line px-6 py-3 flex justify-between">
          <button
            onClick={() => setPct(toPct(defaultWeights))}
            className="px-4 py-2 rounded-lg text-muted hover:bg-line text-sm font-medium"
          >
            Reset to defaults
          </button>
          <button
            onClick={save}
            disabled={!allValid}
            className="px-4 py-2 rounded-md bg-ink text-paper text-sm font-semibold hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
