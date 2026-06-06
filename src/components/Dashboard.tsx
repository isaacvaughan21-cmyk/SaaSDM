import type { Idea, Weights } from '../state/types';
import { ComparisonTable } from './ComparisonTable';
import { EmptyState } from './EmptyState';
import { Crosshair } from './Crosshair';
import { DVFTriangle } from './DVFTriangle';
import { RubricCards } from './RubricCards';

type Props = {
  ideas: Idea[];
  weights: Weights;
  onNew: () => void;
  onEdit: (idea: Idea) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Dashboard({ ideas, weights, onNew, onEdit, onDuplicate, onDelete }: Props) {
  if (ideas.length === 0) {
    return <EmptyState onAdd={onNew} />;
  }

  const problemDots = ideas.map((i) => ({
    id: i.id,
    label: i.name,
    score: i.scores.desirability.problemSeverity,
  }));
  const profitDots = ideas.map((i) => ({
    id: i.id,
    label: i.name,
    score: i.scores.viability.profitability,
  }));

  return (
    <div className="space-y-10">
      <ComparisonTable
        ideas={ideas}
        weights={weights}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      <div className="flex flex-wrap justify-center gap-10">
        <Crosshair
          title="Problem crosshair"
          xLabel="Frequency (low → high)"
          yLabel="Size (small → big)"
          quadrants={['Good', 'Great', 'Bad', 'Good']}
          dots={problemDots}
        />
        <Crosshair
          title="Profitability crosshair"
          xLabel="Revenue (low → high)"
          yLabel="Low expense → high"
          quadrants={['Good', 'Great', 'Bad', 'Good']}
          dots={profitDots}
        />
      </div>

      {/* Framework reference stays visible after the first idea */}
      <section className="border-t border-line pt-8">
        <div className="flex flex-col items-center">
          <DVFTriangle />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink mt-8 mb-1">Scoring framework</h2>
        <p className="text-sm text-muted mb-4">
          How each pillar and its sub-criteria are defined and scored.
        </p>
        <RubricCards />
      </section>
    </div>
  );
}
