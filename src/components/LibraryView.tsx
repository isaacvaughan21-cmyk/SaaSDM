import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { LibraryIdea, Weights, WorkflowStatus } from '../state/types';
import { WORKFLOW_LABELS } from '../state/types';
import {
  getLibraryIdeas,
  addLibraryIdea,
  deleteLibraryIdea,
  updateLibraryIdea,
  updateWorkflowStatus,
  setIdeaArchived,
} from '../lib/libraryDb';
import { trafficLight } from '../state/scoring';
import { LIGHT_STYLES } from './ScoreDot';
import { LibraryAddModal } from './LibraryAddModal';
import { LibraryEditModal } from './LibraryEditModal';
import { WorkflowStatusPicker } from './WorkflowStatusPicker';

type Props = {
  user: User | null;
  weights: Weights;
  refreshKey: number;
  onNeedAuth: () => void;
  onScoreNow: (idea: LibraryIdea) => void;
  onEditScores: (idea: LibraryIdea) => void;
  onOpenWorkspace: (idea: LibraryIdea) => void;
};

type Filter = 'all' | WorkflowStatus | 'archived';
type GroupBy = 'status' | 'niche';

const NO_NICHE = 'Uncategorized';

function SignInPrompt({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-full bg-ink-50 flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="3" y="10" width="16" height="11" rx="2" stroke="#6b6660" strokeWidth="1.5" />
          <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="#6b6660" strokeWidth="1.5" strokeLinecap="round" />
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

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 8a.5.5 0 0 0 .5.5h5.6a.5.5 0 0 0 .5-.5l.7-8"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArchiveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M1.5 3.5h11v2h-11zM2.5 5.5h9v6h-9zM5.5 8h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type RowProps = {
  idea: LibraryIdea;
  rank?: number;
  topPick?: boolean;
  showNiche?: boolean;
  onStatus: (s: WorkflowStatus) => void;
  onOpen: () => void;
  onEdit: () => void;
  onScore: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

function IdeaRow({
  idea,
  rank,
  topPick,
  showNiche,
  onStatus,
  onOpen,
  onEdit,
  onScore,
  onArchive,
  onDelete,
}: RowProps) {
  const notes = idea.description?.trim();
  const scored = idea.status === 'scored';

  return (
    <div className={`bg-surface border border-line rounded-xl px-5 py-4 shadow-card ${idea.archived ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {scored && rank != null && (
            <span className="text-xs font-semibold text-muted tabular-nums w-5 shrink-0 mt-0.5">
              #{rank}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onOpen}
                className="font-medium text-ink text-sm text-left hover:underline decoration-line underline-offset-2"
                title="Open planning workspace"
              >
                {idea.name}
              </button>
              {showNiche && idea.niche && (
                <span className="text-xs text-muted bg-ink-50 px-2 py-0.5 rounded-full">
                  {idea.niche}
                </span>
              )}
              {topPick && (
                <span className="text-xs text-muted bg-ink-50 px-2 py-0.5 rounded-full">★ Top pick</span>
              )}
            </div>
            {notes && (
              <p className="text-xs text-muted mt-1 whitespace-pre-wrap">{notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {scored && idea.composite_score != null && <TrafficDot score={idea.composite_score} />}
          {!idea.archived && <WorkflowStatusPicker value={idea.workflow_status} onChange={onStatus} />}
        </div>
      </div>

      {/* action bar */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line">
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-paper text-xs font-semibold rounded-md hover:bg-ink-700 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M5 2H2v3M9 12h3V9M12 2L8 6M2 12l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Plan
        </button>
        <button
          onClick={onScore}
          className="px-3 py-1.5 border border-line text-xs font-medium text-ink rounded-md hover:bg-ink-50 transition-colors"
        >
          {scored ? 'Edit scores' : 'Score now'}
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-1.5 border border-line text-xs font-medium text-ink rounded-md hover:bg-ink-50 transition-colors"
        >
          Edit
        </button>
        <div className="flex-1" />
        <button
          onClick={onArchive}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted rounded-md hover:bg-ink-50 hover:text-ink transition-colors"
          title={idea.archived ? 'Restore to Library' : 'Archive idea'}
        >
          <ArchiveIcon />
          {idea.archived ? 'Restore' : 'Archive'}
        </button>
        <button
          onClick={onDelete}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:bg-ink-50 hover:text-ink transition-colors"
          title="Delete permanently"
          aria-label="Delete permanently"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

export function LibraryView({
  user,
  weights: _weights,
  refreshKey,
  onNeedAuth,
  onScoreNow,
  onEditScores,
  onOpenWorkspace,
}: Props) {
  const [ideas, setIdeas] = useState<LibraryIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editIdea, setEditIdea] = useState<LibraryIdea | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('status');

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

  const niches = Array.from(
    new Set(ideas.map((i) => i.niche?.trim()).filter((n): n is string => !!n))
  ).sort((a, b) => a.localeCompare(b));

  const handleAdd = async (name: string, description: string, niche: string) => {
    await addLibraryIdea(name, description, niche);
    setAddOpen(false);
    await load();
  };

  const handleEditSave = async (id: string, name: string, description: string, niche: string) => {
    await updateLibraryIdea(id, { name, description, niche });
    setEditIdea(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this idea? This cannot be undone.')) return;
    await deleteLibraryIdea(id);
    await load();
  };

  const handleStatus = async (id: string, status: WorkflowStatus) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, workflow_status: status } : i)));
    await updateWorkflowStatus(id, status);
  };

  const handleArchive = async (id: string, archived: boolean) => {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, archived } : i)));
    await setIdeaArchived(id, archived);
  };

  // global rank among active (non-archived) scored ideas
  const rankMap = new Map<string, number>();
  ideas
    .filter((i) => !i.archived && i.status === 'scored')
    .sort((a, b) => (b.composite_score ?? 0) - (a.composite_score ?? 0))
    .forEach((i, idx) => rankMap.set(i.id, idx + 1));
  const activeScoredCount = rankMap.size;

  const viewArchived = filter === 'archived';
  const base = ideas.filter((i) => (viewArchived ? i.archived : !i.archived));
  const filtered =
    viewArchived || filter === 'all' ? base : base.filter((i) => i.workflow_status === filter);

  const activeCount = ideas.filter((i) => !i.archived).length;
  const archivedCount = ideas.filter((i) => i.archived).length;
  const toScoreCount = ideas.filter((i) => !i.archived && i.status === 'unscored').length;

  const filters: Filter[] = ['all', 'open', 'wip', 'on_hold', 'archived'];
  const countFor = (f: Filter) =>
    f === 'all'
      ? activeCount
      : f === 'archived'
        ? archivedCount
        : ideas.filter((i) => !i.archived && i.workflow_status === f).length;

  const renderRow = (idea: LibraryIdea, showNiche: boolean) => (
    <IdeaRow
      key={idea.id}
      idea={idea}
      rank={rankMap.get(idea.id)}
      topPick={rankMap.get(idea.id) === 1 && activeScoredCount > 1}
      showNiche={showNiche}
      onStatus={(s) => handleStatus(idea.id, s)}
      onOpen={() => onOpenWorkspace(idea)}
      onEdit={() => setEditIdea(idea)}
      onScore={() => (idea.status === 'scored' ? onEditScores(idea) : onScoreNow(idea))}
      onArchive={() => handleArchive(idea.id, !idea.archived)}
      onDelete={() => handleDelete(idea.id)}
    />
  );

  // group by niche
  const nicheGroups = () => {
    const map = new Map<string, LibraryIdea[]>();
    for (const idea of filtered) {
      const key = idea.niche?.trim() || NO_NICHE;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(idea);
    }
    const keys = Array.from(map.keys()).sort((a, b) => {
      if (a === NO_NICHE) return 1;
      if (b === NO_NICHE) return -1;
      return a.localeCompare(b);
    });
    // within a niche: scored (by rank) first, then unscored
    return keys.map((k) => {
      const list = map.get(k)!.slice().sort((a, b) => {
        const ra = rankMap.get(a.id) ?? Infinity;
        const rb = rankMap.get(b.id) ?? Infinity;
        return ra - rb;
      });
      return { niche: k, list };
    });
  };

  return (
    <div className="mt-8">
      {/* page header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-semibold text-ink">Idea Library</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted border border-line rounded-full px-2 py-0.5">
              Beta
            </span>
          </div>
          <p className="text-sm text-muted mt-0.5">
            {ideas.length === 0
              ? 'Your ideas, all in one place.'
              : `${activeCount} idea${activeCount === 1 ? '' : 's'} — ${toScoreCount} to score`}
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

      {/* beta notice */}
      <div className="flex items-start gap-2.5 bg-wash border border-line rounded-xl px-4 py-3 mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 mt-0.5 text-muted">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 7.2v3.4M8 5.2v.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <p className="text-xs text-muted leading-relaxed">
          <span className="font-semibold text-ink">The Idea Library is in beta.</span> Some features
          are still a work in progress and may not behave exactly as intended — tell us what’s broken.
        </p>
      </div>

      {/* controls: status filter + group-by toggle */}
      {ideas.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filter === f
                    ? 'bg-ink text-paper border-ink'
                    : 'border-line text-muted hover:bg-ink-50 hover:text-ink'
                }`}
              >
                {f === 'all' ? 'All' : f === 'archived' ? 'Archived' : WORKFLOW_LABELS[f]} ({countFor(f)})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-wash border border-line rounded-lg p-0.5">
            {(['status', 'niche'] as GroupBy[]).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  groupBy === g ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                }`}
              >
                {g === 'status' ? 'By status' : 'By niche'}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-muted">Loading…</div>
      ) : ideas.length === 0 ? (
        <EmptyLibrary onAdd={() => setAddOpen(true)} />
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted">
          {viewArchived ? 'No archived ideas.' : 'No ideas with this status.'}
        </div>
      ) : groupBy === 'niche' ? (
        <div className="space-y-8">
          {nicheGroups().map(({ niche, list }) => (
            <section key={niche}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                {niche} — {list.length}
              </h2>
              <div className="space-y-2">{list.map((idea) => renderRow(idea, false))}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {(() => {
            const unscored = filtered.filter((i) => i.status === 'unscored');
            const scored = filtered
              .filter((i) => i.status === 'scored')
              .sort((a, b) => (rankMap.get(a.id) ?? Infinity) - (rankMap.get(b.id) ?? Infinity));
            return (
              <>
                {unscored.length > 0 && (
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      To Score — {unscored.length}
                    </h2>
                    <div className="space-y-2">{unscored.map((idea) => renderRow(idea, true))}</div>
                  </section>
                )}
                {scored.length > 0 && (
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                      Scored — {scored.length}
                    </h2>
                    <div className="space-y-2">{scored.map((idea) => renderRow(idea, true))}</div>
                  </section>
                )}
              </>
            );
          })()}
        </div>
      )}

      {addOpen && (
        <LibraryAddModal niches={niches} onSave={handleAdd} onCancel={() => setAddOpen(false)} />
      )}
      {editIdea && (
        <LibraryEditModal
          idea={editIdea}
          niches={niches}
          onSave={handleEditSave}
          onCancel={() => setEditIdea(null)}
        />
      )}
    </div>
  );
}
