import { useState } from 'react';
import type { Idea, PillarKey, Score, Weights } from '../state/types';
import { CRITERIA, PILLAR_LABELS } from '../state/defaults';
import { pillarScores, compositeScore, isFlagged, fmt, trafficLight } from '../state/scoring';
import { ScoreSlider } from './ScoreSlider';
import { LIGHT_STYLES } from './ScoreDot';
import { uuid } from '../lib/uuid';

type Props = {
  initial: Idea | null;
  weights: Weights;
  onSave: (idea: Idea) => void;
  onCancel: () => void;
};

const PILLARS: PillarKey[] = ['desirability', 'feasibility', 'viability'];

function blankScores(): Idea['scores'] {
  return {
    desirability: { problemSeverity: 3, dogfoodingFit: 3, wedgeClarity: 3 },
    feasibility: { timeToMvp: 3, skillMatch: 3, opComplexity: 3 },
    viability: { profitability: 3, distributionPath: 3, wtpClarity: 3 },
  };
}

export function IdeaModal({ initial, weights, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [scores, setScores] = useState<Idea['scores']>(
    initial ? structuredClone(initial.scores) : blankScores()
  );
  const [open, setOpen] = useState<Record<PillarKey, boolean>>({
    desirability: true,
    feasibility: true,
    viability: true,
  });

  const draft: Idea = {
    id: initial?.id ?? 'draft',
    name,
    description,
    scores,
    createdAt: initial?.createdAt ?? '',
    updatedAt: '',
  };
  const pillars = pillarScores(draft, weights);
  const composite = compositeScore(draft, weights);
  const flagged = isFlagged(draft, weights);

  const setScore = (pillar: PillarKey, key: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [pillar]: { ...prev[pillar], [key]: value as Score },
    }));
  };

  const save = () => {
    if (!name.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: initial?.id ?? uuid(),
      name: name.trim().slice(0, 80),
      description: description.trim().slice(0, 200),
      scores,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    });
  };

  const lightStyle = (s: number) => LIGHT_STYLES[trafficLight(s)];

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
        {/* sticky score header */}
        <div className="sticky top-0 bg-white border-b border-line rounded-t-xl px-6 py-4 z-10">
          <h2 className="text-lg font-bold text-ink">
            {initial ? 'Edit idea' : 'New idea'}
          </h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <span className="font-semibold">
              Composite: <span className="tabular-nums">{fmt(composite)}</span>
            </span>
            {PILLARS.map((p) => {
              const st = lightStyle(pillars[p]);
              return (
                <span key={p} style={{ color: st.color }} className="font-medium">
                  <span aria-hidden className="mr-1 text-[0.85em]">
                    {st.shape}
                  </span>
                  {PILLAR_LABELS[p]}: <span className="tabular-nums">{fmt(pillars[p])}</span>
                </span>
              );
            })}
          </div>
          {flagged && (
            <div className="mt-2 text-xs font-medium text-bad bg-bad-light rounded px-2 py-1">
              ⚠ A pillar scores below 2.0 — this idea is auto-flagged as weak.
            </div>
          )}
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Idea name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Invoicing tool for freelancers"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Description <span className="text-muted">(optional)</span>
            </label>
            <input
              type="text"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-line summary"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>

          {PILLARS.map((pillar) => (
            <div key={pillar} className="rounded-lg border border-line">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-2 text-left font-semibold text-ink"
                onClick={() => setOpen((o) => ({ ...o, [pillar]: !o[pillar] }))}
              >
                <span>
                  {PILLAR_LABELS[pillar]}{' '}
                  <span className="text-sm" style={{ color: lightStyle(pillars[pillar]).color }}>
                    <span aria-hidden className="mr-0.5">
                      {lightStyle(pillars[pillar]).shape}
                    </span>
                    {fmt(pillars[pillar])}
                  </span>
                </span>
                <span className="text-muted">{open[pillar] ? '▾' : '▸'}</span>
              </button>
              {open[pillar] && (
                <div className="px-4 pb-3 border-t border-line">
                  {CRITERIA[pillar].map((c) => (
                    <ScoreSlider
                      key={c.key}
                      label={c.label}
                      weightPct={(weights[pillar] as Record<string, number>)[c.key]}
                      anchors={c.anchors}
                      value={(scores[pillar] as Record<string, number>)[c.key]}
                      onChange={(v) => setScore(pillar, c.key, v)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-line rounded-b-xl px-6 py-3 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-muted hover:bg-line text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-md bg-ink text-paper text-sm font-semibold hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
