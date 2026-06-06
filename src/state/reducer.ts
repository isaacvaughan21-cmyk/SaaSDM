import type { AppState, Idea, Weights } from './types';

export type Action =
  | { type: 'add'; idea: Idea }
  | { type: 'update'; idea: Idea }
  | { type: 'delete'; id: string }
  | { type: 'duplicate'; id: string; newId: string; now: string }
  | { type: 'setWeights'; weights: Weights }
  | { type: 'import'; state: AppState };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'add':
      return { ...state, ideas: [...state.ideas, action.idea] };
    case 'update':
      return {
        ...state,
        ideas: state.ideas.map((i) => (i.id === action.idea.id ? action.idea : i)),
      };
    case 'delete':
      return { ...state, ideas: state.ideas.filter((i) => i.id !== action.id) };
    case 'duplicate': {
      const original = state.ideas.find((i) => i.id === action.id);
      if (!original) return state;
      const copy: Idea = {
        ...original,
        id: action.newId,
        name: `${original.name} (copy)`,
        createdAt: action.now,
        updatedAt: action.now,
      };
      return { ...state, ideas: [...state.ideas, copy] };
    }
    case 'setWeights':
      return { ...state, weights: action.weights };
    case 'import':
      return action.state;
    default:
      return state;
  }
}
