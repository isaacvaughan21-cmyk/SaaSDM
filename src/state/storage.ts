import type { AppState } from './types';
import { initialState, STORAGE_KEY } from './defaults';

export function loadState(): { state: AppState; corrupted: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: initialState, corrupted: false };
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.schemaVersion !== 1) {
      return { state: initialState, corrupted: false };
    }
    return { state: parsed, corrupted: false };
  } catch {
    return { state: initialState, corrupted: true };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or unavailable — ignore for MVP */
  }
}
