import { RubricCards } from './RubricCards';
import { Crosshair } from './Crosshair';
import { DVFTriangle } from './DVFTriangle';

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-2">
      <h2 className="text-2xl font-bold text-slate-800">How the framework works</h2>
      <p className="mt-2 max-w-2xl mx-auto text-slate-500">
        A strong SaaS idea sits where all three pillars overlap. Score nine sub-criteria from 1–5 and
        the matrix computes a composite score, flags fatal weaknesses, and plots your problem and
        profitability crosshairs.
      </p>

      <div className="mt-8 flex justify-center">
        <DVFTriangle />
      </div>

      <div className="mt-10 text-left">
        <h3 className="text-lg font-bold text-slate-800 mb-1">Scoring framework</h3>
        <p className="text-sm text-slate-500 mb-4">
          How each pillar and its sub-criteria are defined and scored.
        </p>
        <RubricCards />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onAdd}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow"
        >
          ＋ Score your first idea
        </button>
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
