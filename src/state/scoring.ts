import type { Idea, PillarKey, Weights } from './types';

export type TrafficLight = 'green' | 'yellow' | 'red';

function pillarScore(
  scores: Record<string, number>,
  weights: Record<string, number>
): number {
  let total = 0;
  for (const key of Object.keys(scores)) {
    total += scores[key] * (weights[key] ?? 0);
  }
  return total;
}

export function pillarScores(idea: Idea, weights: Weights): Record<PillarKey, number> {
  return {
    desirability: pillarScore(idea.scores.desirability, weights.desirability),
    feasibility: pillarScore(idea.scores.feasibility, weights.feasibility),
    viability: pillarScore(idea.scores.viability, weights.viability),
  };
}

export function compositeScore(idea: Idea, weights: Weights): number {
  const p = pillarScores(idea, weights);
  return (p.desirability + p.feasibility + p.viability) / 3;
}

export function trafficLight(score: number): TrafficLight {
  if (score >= 3.5) return 'green';
  if (score >= 2.0) return 'yellow';
  return 'red';
}

export function isFlagged(idea: Idea, weights: Weights): boolean {
  const p = pillarScores(idea, weights);
  return p.desirability < 2.0 || p.feasibility < 2.0 || p.viability < 2.0;
}

export function fmt(score: number): string {
  return score.toFixed(1);
}
