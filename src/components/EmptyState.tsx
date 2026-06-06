import { RubricCards } from './RubricCards';
import { Crosshair } from './Crosshair';
import { DVFTriangle } from './DVFTriangle';

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold text-slate-800">Score your first SaaS idea</h2>
      <p className="mt-2 max-w-2xl mx-auto text-slate-500">
        Rank ideas with a weighted Desirability / Feasibility / Viability framework. Score nine
        sub-criteria from 1–5, and the matrix computes a composite score, flags fatal weaknesses,
        and plots your problem and profitability crosshairs.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
      >
        + Add your first idea
      </button>

      <div className="mt-10 flex justify-center">
        <DVFTriangle />
      </div>

      <div className="mt-10 text-left">
        <RubricCards />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-10">
        <Crosshair
          title="Problem crosshair"
          xLabel="Frequency (low → high)"
          yLabel="Size (small → big)"
          quadrants={['Good', 'Great', 'Bad', 'Good']}
          dots={[]}
        />
        <Crosshair
          title="Profitability crosshair"
          xLabel="Revenue (low → high)"
          yLabel="Low expense → high"
          quadrants={['Good', 'Great', 'Bad', 'Good']}
          dots={[]}
        />
      </div>
    </div>
  );
}
