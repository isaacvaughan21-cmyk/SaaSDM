import { useState } from 'react';
import type { Idea, Weights } from '../state/types';
import { compositeScore, pillarScores, isFlagged, fmt } from '../state/scoring';
import { ScoreDot } from './ScoreDot';

type SortKey = 'composite' | 'desirability' | 'feasibility' | 'viability' | 'name';

type Props = {
  ideas: Idea[];
  weights: Weights;
  onEdit: (idea: Idea) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ComparisonTable({ ideas, weights, onEdit, onDuplicate, onDelete }: Props) {
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
      className={`px-3 py-2 font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900 ${extra}`}
      onClick={() => setSort(key)}
    >
      {label}
      {sortKey === key ? (asc ? ' ▲' : ' ▼') : ''}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left">
          <tr>
            {header('name', 'Idea')}
            {header('composite', 'Composite', 'text-center')}
            {header('desirability', 'Desirability', 'text-center')}
            {header('feasibility', 'Feasibility', 'text-center')}
            {header('viability', 'Viability', 'text-center')}
            <th className="px-3 py-2 font-semibold text-slate-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ idea, composite, pillars, flagged }) => (
            <tr
              key={idea.id}
              className={`border-b border-slate-100 last:border-0 ${
                flagged ? 'border-l-4 border-l-red bg-red-light/30' : ''
              }`}
            >
              <td className="px-3 py-2">
                <span className="font-medium text-slate-800" title={idea.description}>
                  {idea.name}
                </span>
                {idea.description && (
                  <span className="block text-xs text-slate-400 truncate max-w-xs">
                    {idea.description}
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                  {flagged && (
                    <span className="text-red" title="Pillar score below 2.0">
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
                  className="text-indigo-600 hover:underline mr-3"
                  onClick={() => onEdit(idea)}
                >
                  Edit
                </button>
                <button
                  className="text-slate-500 hover:underline mr-3"
                  onClick={() => onDuplicate(idea.id)}
                >
                  Duplicate
                </button>
                <button
                  className="text-red hover:underline"
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
