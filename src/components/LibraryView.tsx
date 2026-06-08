import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { LibraryIdea, Weights } from '../state/types';
import {
  getLibraryIdeas,
  addLibraryIdea,
  deleteLibraryIdea,
} from '../lib/libraryDb';
import { trafficLight } from '../state/scoring';
import { LIGHT_STYLES } from './ScoreDot';
import { LibraryAddModal } from './LibraryAddModal';

type Props = {
  user: User | null;
  weights: Weights;
  refreshKey: number;
  onNeedAuth: () => void;
  onScoreNow: (idea: LibraryIdea) => void;
  onEditScores: (idea: LibraryIdea) => void;
};

function SignInPrompt({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-full bg-ink-50 flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="3" y="10" width="16" height="11" rx="2" stroke="#6b6660" strokeWidth="1.5" />
          <path
            d="M7 10V7a4 4 0 0 1 8 0v3"
            stroke="#6b6660"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="11" cy="15.5" r="1.5" fill="#6b6660" />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-ink mb-2">Your Idea Library</h2>
      <p className="text-sm text-muted max-w-xs mb-6">
        Save ideas before you're ready to score them. Come back and score them later — everything
        syncs across your devices.
      </p>
      <button
        onClick={onSignIn}
        className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-lg hover:bg-ink-700 transition-colors"
      >
        Sign in to continue
      </button>
    </div>
  );
}

function EmptyLibrary({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-ink-50 flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="2" y="3" width="14" height="18" rx="2" stroke="#6b6660" strokeWidth="1.5" />
          <path d="M6 8h6M6 12h4" stroke="#6b6660" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="17" cy="17" r="4" fill="#fbfaf6" stroke="#6b6660" strokeWidth="1.5" />
          <path d="M17 15v4M15 17h4" stroke="#6b6660" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-2">No ideas yet</h3>
      <p className="text-sm text-muted max-w-xs mb-6">
        Add an idea to your Library. You can score it now or save it for later.
      </p>
      <button
        onClick={onAdd}
        className="px-5 py-2.5 bg-ink text-paper text-sm font-semibold rounded-lg hover:bg-ink-700 transition-colors"
      >
        Add your first idea
      </button>
    </div>
  );
}

function TrafficDot({ score }: { score: number }) {
  const light = trafficLight(score);
  const style = LIGHT_STYLES[light];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums"
      style={{ color: style.color }}
    >
      {style.shape} {score.toFixed(1)}
    </span>
  );
}

export function LibraryView({ user, weights: _weights, refreshKey, onNeedAuth, onScoreNow, onEditScores }: Props) {
  const [ideas, setIdeas] = useState<LibraryIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const data = await getLibraryIdeas();
    setIdeas(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (!user) {
    return <SignInPrompt onSignIn={onNeedAuth} />;
  }

  const unscored = ideas.filter((i) => i.status === 'unscored');
  const scored = ideas.filter((i) => i.status === 'scored');

  const handleAdd = async (name: string, description: string) => {
    await addLibraryIdea(name, description);
    setAddOpen(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this idea from your Library?')) return;
    await deleteLibraryIdea(id);
    await load();
  };

  return (
    <div className="mt-8">
      {/* page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Idea Library</h1>
          <p className="text-sm text-muted mt-0.5">
            {ideas.length === 0
              ? 'Your ideas, all in one place.'
              : `${ideas.length} idea${ideas.length === 1 ? '' : 's'} — ${unscored.length} to score`}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-ink text-paper text-sm font-semibold rounded-lg hover:bg-ink-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add idea
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted">Loading…</div>
      ) : ideas.length === 0 ? (
        <EmptyLibrary onAdd={() => setAddOpen(true)} />
      ) : (
        <div className="space-y-8">
          {/* To Score section */}
          {unscored.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                To Score — {unscored.length}
              </h2>
              <div className="space-y-2">
                {unscored.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-start justify-between gap-4 bg-surface border border-line rounded-xl px-5 py-4 shadow-card"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink text-sm">{idea.name}</p>
                      {idea.description && (
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">{idea.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onScoreNow(idea)}
                        className="px-3 py-1.5 bg-ink text-paper text-xs font-semibold rounded-md hover:bg-ink-700 transition-colors"
                      >
                        Score now
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:bg-ink-50 hover:text-ink transition-colors"
                        title="Remove from Library"
                        aria-label="Remove from Library"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                          <path
                            d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 8a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5l.7-8"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Scored section */}
          {scored.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Scored — {scored.length}
              </h2>
              <div className="space-y-2">
                {scored.map((idea, idx) => (
                  <div
                    key={idea.id}
                    className="flex items-center justify-between gap-4 bg-surface border border-line rounded-xl px-5 py-4 shadow-card"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xs font-semibold text-muted tabular-nums w-5 shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-ink text-sm">{idea.name}</p>
                          {idx === 0 && scored.length > 1 && (
                            <span className="text-xs text-muted bg-ink-50 px-2 py-0.5 rounded-full">
                              ★ Top pick
                            </span>
                          )}
                        </div>
                        {idea.description && (
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">{idea.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {idea.composite_score != null && (
                        <TrafficDot score={idea.composite_score} />
                      )}
                      <button
                        onClick={() => onEditScores(idea)}
                        className="px-3 py-1.5 border border-line text-xs font-medium text-ink rounded-md hover:bg-ink-50 transition-colors"
                      >
                        Edit scores
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:bg-ink-50 hover:text-ink transition-colors"
                        title="Remove from Library"
                        aria-label="Remove from Library"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                          <path
                            d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 8a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5l.7-8"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {addOpen && (
        <LibraryAddModal
          onSave={handleAdd}
          onCancel={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}
