export type Score = 1 | 2 | 3 | 4 | 5;

export type DesirabilityScores = {
  problemSeverity: Score;
  dogfoodingFit: Score;
  wedgeClarity: Score;
};

export type FeasibilityScores = {
  timeToMvp: Score;
  skillMatch: Score;
  opComplexity: Score;
};

export type ViabilityScores = {
  profitability: Score;
  distributionPath: Score;
  wtpClarity: Score;
};

export type Idea = {
  id: string;
  name: string;
  description: string;
  scores: {
    desirability: DesirabilityScores;
    feasibility: FeasibilityScores;
    viability: ViabilityScores;
  };
  createdAt: string;
  updatedAt: string;
};

export type Weights = {
  desirability: { problemSeverity: number; dogfoodingFit: number; wedgeClarity: number };
  feasibility: { timeToMvp: number; skillMatch: number; opComplexity: number };
  viability: { profitability: number; distributionPath: number; wtpClarity: number };
};

export type AppState = {
  schemaVersion: 1;
  ideas: Idea[];
  weights: Weights;
};

export type PillarKey = 'desirability' | 'feasibility' | 'viability';

export type LibraryIdea = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: 'unscored' | 'scored';
  scores: Idea['scores'] | null;
  composite_score: number | null;
  created_at: string;
  updated_at: string;
};
