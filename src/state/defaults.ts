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

// Neutral ink shades per pillar — shared by the scoring-framework headers and
// the venn so the two read as one system.
export const PILLAR_COLORS: Record<PillarKey, string> = {
  desirability: '#1B1A17', // ink
  feasibility: '#46423B', // ink-600
  viability: '#6B6660', // muted
};

export type CriterionMeta = {
  key: string;
  label: string;
  weightPct: number;
  description: string;
  anchors: string;
};

export const PILLAR_DESCRIPTIONS: Record<PillarKey, string> = {
  desirability:
    'Do people actually want this? Measures how badly the problem is felt, whether you yourself need it, and whether there is a clear angle into the market.',
  feasibility:
    'Can you actually build and run it? Measures how quickly you can ship an MVP, how well it fits your existing skills, and how heavy the ongoing operational burden is.',
  viability:
    'Can it make money and reach customers? Measures profit potential, whether there is a realistic path to your audience, and whether people will pay.',
};

export const CRITERIA: Record<PillarKey, CriterionMeta[]> = {
  desirability: [
    {
      key: 'problemSeverity',
      label: 'Problem Severity',
      weightPct: 40,
      description:
        'How painful and how frequent the underlying problem is. Big, recurring pain is the strongest signal of real demand.',
      anchors: '1 = small + infrequent, 3 = moderate, 5 = big + frequent.',
    },
    {
      key: 'dogfoodingFit',
      label: 'Dogfooding Fit',
      weightPct: 30,
      description:
        'Whether you are a user of your own product. Building something you personally need keeps you motivated and gives you instant feedback.',
      anchors:
        "1 = I'd never use this, 3 = I'd use it occasionally, 5 = I'd use it weekly+ and need it now.",
    },
    {
      key: 'wedgeClarity',
      label: 'Market Wedge Clarity',
      weightPct: 30,
      description:
        'How clear and defensible your entry angle is. A sharp wedge into a proven market beats a vague idea in a crowded one.',
      anchors:
        '1 = saturated with no differentiation, 3 = some angle, 5 = clear, defensible wedge in a proven market.',
    },
  ],
  feasibility: [
    {
      key: 'timeToMvp',
      label: 'Time to MVP',
      // (kept natural casing; "to" stays lowercase)
      weightPct: 40,
      description:
        'How long until you can put a usable first version in front of customers. Shorter loops mean faster learning and lower risk.',
      anchors: '1 = >6 months, 3 = ~2 months, 5 = ≤4 weeks.',
    },
    {
      key: 'skillMatch',
      label: 'Skill Match',
      weightPct: 35,
      description:
        'How well the work fits the skills you already have. Building in your wheelhouse is faster and far less risky than learning everything new.',
      anchors:
        '1 = mostly new skills required, 3 = stretch but doable, 5 = squarely in my wheelhouse.',
    },
    {
      key: 'opComplexity',
      label: 'Operational Complexity',
      weightPct: 25,
      description:
        'How much ongoing maintenance, infrastructure, and third-party dependency the product demands. Lower complexity means more time building, less firefighting.',
      anchors:
        '1 = 24/7 uptime, heavy infra, many third-party deps; 3 = moderate; 5 = minimal deps, low maintenance.',
    },
  ],
  viability: [
    {
      key: 'profitability',
      label: 'Profitability',
      weightPct: 40,
      description:
        'The gap between what you can charge and what it costs to deliver. High revenue at low cost is the engine of a sustainable solo business.',
      anchors:
        '1 = low revenue + high cost, 3 = moderate margin, 5 = high revenue + low cost.',
    },
    {
      key: 'distributionPath',
      label: 'Distribution Path',
      weightPct: 30,
      description:
        'How realistically you can reach customers. The best product fails without a channel; congregated, reachable audiences are gold.',
      anchors:
        '1 = no clear way to reach customers, 3 = some channels, 5 = customers congregate in accessible communities I can reach organically.',
    },
    {
      key: 'wtpClarity',
      label: 'Willingness to Pay Clarity',
      weightPct: 30,
      description:
        'How confident you are that people will open their wallets. Proven spend on similar tools beats a vague "nice to have".',
      anchors:
        '1 = "nice to have" / unclear pricing, 3 = plausible, 5 = clear pain + proven willingness to pay for similar tools.',
    },
  ],
};
