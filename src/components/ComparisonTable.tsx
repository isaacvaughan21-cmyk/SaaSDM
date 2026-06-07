import { useState } from 'react';
import type { Idea, Weights } from '../state/types';
import { compositeScore, pillarScores, isFlagged, fmt } from '../state/scoring';
import { ScoreDot, ScoreLegend } from './ScoreDot';

type SortKey = 'composite' | 'desirability' | 'feasibility' | 'viability' | 'name';

type Props = {
  ideas: Idea[];
  weights: Weights;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
};

export function ComparisonTable({ ideas, weights, onEdit, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('composite');
  const [asc, setAsc] = useState(false);

  const rows = ideas.map((idea) => ({
    idea,
    composite: compositeScore(idea, weights),
    pillars: pillarScores(idea, weights),
    flagged: isFlagged(idea, weights),
  }));

  rows.sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name') cmp = a.idea.name.localeCompare(b.idea.name);
    else if (sortKey === 'composite') cmp = a.composite - b.composite;
    else cmp = a.pillars[sortKey] - b.pillars[sortKey];
    return asc ? cmp : -cmp;
  });

  const setSort = (key: SortKey) => {
    if (key === sortKey) setAsc((s) => !s);
    else {
      setSortKey(key);
      setAsc(key === 'name');
    }
  };

  const header = (key: SortKey, label: string, extra = '') => (
    <th
      className={`px-3 py-2 font-semibold text-muted cursor-pointer select-none hover:text-ink ${extra}`}
      onClick={() => setSort(key)}
    >
      {label}
      {sortKey === key ? (asc ? ' ▲' : ' ▼') : ''}
    </th>
  );

  return (
    <div>
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-muted">
        Ranked by composite score — darker rows score higher. Each pillar dot shows its strength;
        click a column to re-sort.
      </p>
      <ScoreLegend />
    </div>
    <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-wash text-left">
          <tr className="kicker text-muted">
            {header('name', 'Idea')}
            {header('composite', 'Composite', 'text-center')}
            {header('desirability', 'Desirability', 'text-center')}
            {header('feasibility', 'Feasibility', 'text-center')}
            {header('viability', 'Viability', 'text-center')}
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ idea, composite, pillars, flagged }, rank) => {
            // Neutral highlight: stronger ideas get a deeper warm-grey wash and
            // a darker left rule, so ranking reads clearly without colour.
            const t = Math.max(0, Math.min(1, (composite - 1) / 4));
            const bgAlpha = (0.04 + t * 0.18).toFixed(3);
            const borderAlpha = (0.18 + t * 0.62).toFixed(3);
            const isBest = rank === 0 && rows.length > 1;
            return (
            <tr
              key={idea.id}
              className="border-b border-line last:border-0"
              style={{
                backgroundColor: `rgba(27,26,23,${bgAlpha})`,
                borderLeft: `4px solid rgba(27,26,23,${borderAlpha})`,
              }}
            >
              <td className="px-3 py-2">
                <span className="font-medium text-ink" title={idea.description}>
                  {idea.name}
                </span>
                {isBest && !flagged && (
                  <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide text-paper bg-ink rounded px-1.5 py-0.5">
                    ★ Top pick
                  </span>
                )}
                {idea.description && (
                  <span className="block text-xs text-muted truncate max-w-xs">
                    {idea.description}
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                  {flagged && (
                    <span className="text-bad" title="Pillar score below 2.0">
                      ⚠
                    </span>
                  )}
                  {fmt(composite)}
                </span>
              </td>
              <td className="px-3 py-2 text-center">
                <ScoreDot score={pillars.desirability} />
              </td>
              <td className="px-3 py-2 text-center">
                <ScoreDot score={pillars.feasibility} />
              </td>
              <td className="px-3 py-2 text-center">
                <ScoreDot score={pillars.viability} />
              </td>
              <td className="px-3 py-2 text-right whitespace-nowrap">
                <button
                  className="text-ink underline-offset-2 hover:underline mr-3"
                  onClick={() => onEdit(idea)}
                >
                  Edit
                </button>
                <button
                  className="text-bad hover:underline"
                  onClick={() => {
                    if (confirm(`Delete "${idea.name}"? This cannot be undone.`)) {
                      onDelete(idea.id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
}
