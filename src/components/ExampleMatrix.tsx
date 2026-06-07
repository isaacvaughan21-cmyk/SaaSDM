import type { Idea } from '../state/types';
import { defaultWeights } from '../state/defaults';
import { compositeScore, pillarScores, isFlagged, fmt } from '../state/scoring';
import { ScoreDot, ScoreLegend } from './ScoreDot';

// Illustrative sample ideas (not saved) so first-time visitors can see the
// payoff before scoring anything of their own.
const SAMPLE: Idea[] = [
  {
    id: 'ex-1',
    name: 'Freelancer invoice chaser',
    description: 'Auto-follows up on overdue invoices',
    scores: {
      desirability: { problemSeverity: 5, dogfoodingFit: 5, wedgeClarity: 4 },
      feasibility: { timeToMvp: 5, skillMatch: 5, opComplexity: 4 },
      viability: { profitability: 4, distributionPath: 4, wtpClarity: 5 },
    },
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'ex-2',
    name: 'Niche job board for designers',
    description: 'Curated remote design roles',
    scores: {
      desirability: { problemSeverity: 4, dogfoodingFit: 4, wedgeClarity: 4 },
      feasibility: { timeToMvp: 4, skillMatch: 4, opComplexity: 3 },
      viability: { profitability: 3, distributionPath: 4, wtpClarity: 4 },
    },
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'ex-3',
    name: 'AI meal-plan generator',
    description: 'Weekly plans from your pantry',
    scores: {
      desirability: { problemSeverity: 3, dogfoodingFit: 4, wedgeClarity: 2 },
      feasibility: { timeToMvp: 3, skillMatch: 3, opComplexity: 3 },
      viability: { profitability: 2, distributionPath: 3, wtpClarity: 3 },
    },
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'ex-4',
    name: 'Crypto tax dashboard',
    description: 'Tax reports for active traders',
    scores: {
      desirability: { problemSeverity: 4, dogfoodingFit: 2, wedgeClarity: 3 },
      feasibility: { timeToMvp: 2, skillMatch: 1, opComplexity: 2 },
      viability: { profitability: 4, distributionPath: 2, wtpClarity: 3 },
    },
    createdAt: '',
    updatedAt: '',
  },
];

export function ExampleMatrix() {
  const rows = SAMPLE.map((idea) => ({
    idea,
    composite: compositeScore(idea, defaultWeights),
    pillars: pillarScores(idea, defaultWeights),
    flagged: isFlagged(idea, defaultWeights),
  })).sort((a, b) => b.composite - a.composite);

  return (
    <div className="text-left">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <h3 className="font-display text-2xl font-semibold text-ink">What you'll get</h3>
        <span className="kicker text-muted">Example — sample data</span>
      </div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          Ranked by composite score — darker rows score higher. Each pillar dot shows its strength.
        </p>
        <ScoreLegend />
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-wash text-left">
            <tr className="kicker text-muted">
              <th className="px-3 py-3">Idea</th>
              <th className="px-3 py-3 text-center">Composite</th>
              <th className="px-3 py-3 text-center">Desirability</th>
              <th className="px-3 py-3 text-center">Feasibility</th>
              <th className="px-3 py-3 text-center">Viability</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ idea, composite, pillars, flagged }, rank) => {
              const t = Math.max(0, Math.min(1, (composite - 1) / 4));
              const bgAlpha = (0.04 + t * 0.18).toFixed(3);
              const borderAlpha = (0.18 + t * 0.62).toFixed(3);
              const isBest = rank === 0;
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
                    <span className="font-medium text-ink">{idea.name}</span>
                    {isBest && !flagged && (
                      <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide text-paper bg-ink rounded px-1.5 py-0.5">
                        ★ Top pick
                      </span>
                    )}
                    <span className="block text-xs text-muted truncate max-w-xs">
                      {idea.description}
                    </span>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
