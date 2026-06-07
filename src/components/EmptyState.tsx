import { RubricCards } from './RubricCards';
import { DVFTriangle } from './DVFTriangle';
import { ExampleMatrix } from './ExampleMatrix';

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-2">
      <h2 className="font-display text-3xl font-semibold text-ink">How the framework works</h2>
      <p className="mt-2 max-w-2xl mx-auto text-muted">
        A strong SaaS idea sits where all three pillars overlap. Score nine sub-criteria from 1–5 and
        the matrix computes a composite score and flags fatal weaknesses, so you can see at a glance
        which idea is worth building.
      </p>

      <div className="mt-10">
        <ExampleMatrix />
      </div>

      <div className="mt-12 flex justify-center">
        <DVFTriangle />
      </div>

      <div id="framework" className="mt-10 text-left scroll-mt-6">
        <h3 className="font-display text-2xl font-semibold text-ink mb-1">Scoring Framework</h3>
        <p className="text-sm text-muted mb-4">
          How each pillar and its sub-criteria are defined and scored.
        </p>
        <RubricCards />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-ink text-paper font-semibold hover:bg-ink-700 transition-colors"
        >
          ＋ Score your first idea
        </button>
      </div>
    </div>
  );
}
