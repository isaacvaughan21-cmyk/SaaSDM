import type { AppState, PillarKey, Weights } from './types';

export const STORAGE_KEY = 'saas-decision-matrix-v1';

export const defaultWeights: Weights = {
  desirability: { problemSeverity: 0.4, dogfoodingFit: 0.3, wedgeClarity: 0.3 },
  feasibility: { timeToMvp: 0.4, skillMatch: 0.35, opComplexity: 0.25 },
  viability: { profitability: 0.4, distributionPath: 0.3, wtpClarity: 0.3 },
};

export const initialState: AppState = {
  schemaVersion: 1,
  ideas: [],
  weights: defaultWeights,
};

export const PILLAR_LABELS: Record<PillarKey, string> = {
  desirability: 'Desirability',
  feasibility: 'Feasibility',
  viability: 'Viability',
};

export type CriterionMeta = {
  key: string;
  label: string;
  anchors: string;
};

export const CRITERIA: Record<PillarKey, CriterionMeta[]> = {
  desirability: [
    {
      key: 'problemSeverity',
      label: 'Problem severity',
      anchors:
        '1 = small + infrequent, 3 = moderate, 5 = big + frequent. Encodes the problem crosshair as one score.',
    },
    {
      key: 'dogfoodingFit',
      label: 'Dogfooding fit',
      anchors:
        "1 = I'd never use this, 3 = I'd use it occasionally, 5 = I'd use it weekly+ and need it now.",
    },
    {
      key: 'wedgeClarity',
      label: 'Market wedge clarity',
      anchors:
        '1 = saturated with no differentiation, 3 = some angle, 5 = clear, defensible wedge in a proven market.',
    },
  ],
  feasibility: [
    {
      key: 'timeToMvp',
      label: 'Time to MVP',
      anchors: '1 = >6 months, 3 = ~2 months, 5 = ≤4 weeks.',
    },
    {
      key: 'skillMatch',
      label: 'Skill match',
      anchors:
        '1 = mostly new skills required, 3 = stretch but doable, 5 = squarely in my wheelhouse.',
    },
    {
      key: 'opComplexity',
      label: 'Operational complexity',
      anchors:
        '1 = 24/7 uptime, heavy infra, many third-party deps; 3 = moderate; 5 = minimal deps, low maintenance.',
    },
  ],
  viability: [
    {
      key: 'profitability',
      label: 'Profitability',
      anchors:
        '1 = low revenue + high cost, 3 = moderate margin, 5 = high revenue + low cost. Encodes the profitability crosshair.',
    },
    {
      key: 'distributionPath',
      label: 'Distribution path',
      anchors:
        '1 = no clear way to reach customers, 3 = some channels, 5 = customers congregate in accessible communities I can reach organically.',
    },
    {
      key: 'wtpClarity',
      label: 'Willingness to pay clarity',
      anchors:
        '1 = "nice to have" / unclear pricing, 3 = plausible, 5 = clear pain + proven willingness to pay for similar tools.',
    },
  ],
};
