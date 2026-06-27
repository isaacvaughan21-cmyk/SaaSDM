import { useEffect, useRef, useState } from 'react';
import type {
  LibraryIdea,
  IdeaWorkspace as Workspace,
  WorkflowStatus,
  FeatureItem,
  ScheduleItem,
  ActionItem,
} from '../state/types';
import { emptyWorkspace } from '../state/types';
import { updateWorkspace, updateWorkflowStatus } from '../lib/libraryDb';
import { uuid } from '../lib/uuid';
import { WorkflowStatusPicker } from './WorkflowStatusPicker';

type Props = {
  idea: LibraryIdea;
  onBack: () => void;
};

type SaveState = 'idle' | 'saving' | 'saved';

export function IdeaWorkspace({ idea, onBack }: Props) {
  const [ws, setWs] = useState<Workspace>(idea.workspace ?? emptyWorkspace());
  const [status, setStatus] = useState<WorkflowStatus>(idea.workflow_status);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const firstRender = useRef(true);

  // debounced autosave of the workspace
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveState('saving');
    const t = setTimeout(async () => {
      await updateWorkspace(idea.id, ws);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1500);
    }, 600);
    return () => clearTimeout(t);
  }, [ws, idea.id]);

  const changeStatus = async (s: WorkflowStatus) => {
    setStatus(s);
    await updateWorkflowStatus(idea.id, s);
  };

  return (
    <div className="mt-6 mb-12">
      {/* breadcrumb / header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-4"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M8.5 3L4.5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Library
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
        <h1 className="font-display text-2xl font-semibold text-ink">{idea.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted tabular-nums w-14 text-right">
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : ''}
          </span>
          <WorkflowStatusPicker value={status} onChange={changeStatus} />
        </div>
      </div>
      {idea.description && (
        <p className="text-sm text-muted max-w-2xl mb-6">{idea.description}</p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {/* Feature ideas */}
        <Section title="Feature ideas" subtitle="Things it could do">
          <ChecklistEditor
            items={ws.features}
            placeholder="e.g. Slack integration"
            onChange={(features) => setWs((w) => ({ ...w, features }))}
          />
        </Section>

        {/* Action items */}
        <Section title="Action items" subtitle="Next steps to take">
          <ChecklistEditor
            items={ws.actionItems}
            placeholder="e.g. Interview 5 potential users"
            onChange={(actionItems) => setWs((w) => ({ ...w, actionItems }))}
          />
        </Section>
      </div>

      {/* Schedule */}
      <div className="mt-5">
        <Section title="Schedule" subtitle="Milestones and dates">
          <ScheduleEditor
            items={ws.schedule}
            onChange={(schedule) => setWs((w) => ({ ...w, schedule }))}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface border border-line rounded-2xl p-5 shadow-card">
      <div className="mb-4">
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/* ---- Checklist editor (features + action items) ---- */

function ChecklistEditor({
  items,
  placeholder,
  onChange,
}: {
  items: (FeatureItem | ActionItem)[];
  placeholder: string;
  onChange: (items: (FeatureItem | ActionItem)[]) => void;
}) {
  const [text, setText] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const active = items.filter((i) => !i.done);
  const archived = items.filter((i) => i.done);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...items, { id: uuid(), text: t, done: false }]);
    setText('');
  };
  const toggle = (id: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, done: !i.done, wip: false } : i)));
  const toggleWip = (id: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, wip: !i.wip, done: false } : i)));
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  const startEdit = (item: FeatureItem | ActionItem) => {
    setEditingId(item.id);
    setDraft(item.text);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft('');
  };
  const saveEdit = () => {
    if (!editingId) return;
    const t = draft.trim();
    if (!t) {
      cancelEdit();
      return;
    }
    onChange(items.map((i) => (i.id === editingId ? { ...i, text: t } : i)));
    cancelEdit();
  };

  const row = (item: FeatureItem | ActionItem) => (
    <li key={item.id} className="group flex items-center gap-2.5">
      <button
        onClick={() => toggle(item.id)}
        className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
          item.done ? 'bg-ink border-ink' : 'border-line hover:border-ink'
        }`}
        aria-label={item.done ? 'Restore to list' : 'Mark done'}
      >
        {item.done && (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <path d="M2 5.2l2 2 4-4.4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      {editingId === item.id ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit();
            else if (e.key === 'Escape') cancelEdit();
          }}
          className="flex-1 border border-line rounded-md px-2 py-0.5 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
        />
      ) : (
        <span
          onDoubleClick={() => startEdit(item)}
          className={`flex-1 text-sm ${item.done ? 'text-muted line-through' : 'text-ink'}`}
        >
          {item.text}
          {item.wip && !item.done && (
            <span className="ml-2 align-middle inline-flex items-center rounded-full border border-mid bg-mid/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-mid">
              WIP
            </span>
          )}
        </span>
      )}
      {editingId !== item.id && !item.done && (
        <button
          onClick={() => toggleWip(item.id)}
          className={`px-1.5 h-5 flex items-center rounded text-[10px] font-semibold uppercase tracking-wide transition-opacity ${
            item.wip
              ? 'text-mid opacity-100'
              : 'text-muted opacity-0 group-hover:opacity-100 hover:text-mid'
          }`}
          aria-label={item.wip ? 'Clear work-in-progress' : 'Mark work-in-progress'}
          aria-pressed={!!item.wip}
        >
          WIP
        </button>
      )}
      {editingId !== item.id && (
        <button
          onClick={() => startEdit(item)}
          className="w-5 h-5 flex items-center justify-center rounded text-muted opacity-0 group-hover:opacity-100 hover:text-ink transition-opacity"
          aria-label="Edit"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
            <path d="M8.2 1.8l2 2L4 10H2v-2l6.2-6.2z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <button
        onClick={() => remove(item.id)}
        className="w-5 h-5 flex items-center justify-center rounded text-muted opacity-0 group-hover:opacity-100 hover:text-bad transition-opacity"
        aria-label="Remove"
      >
        <svg width="11" height="11" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );

  return (
    <div>
      <ul className="space-y-1.5 mb-3">
        {active.map(row)}
        {active.length === 0 && (
          <li className="text-xs text-muted">
            {archived.length > 0 ? 'All done — see the archive below.' : 'Nothing yet.'}
          </li>
        )}
      </ul>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder={placeholder}
          className="flex-1 border border-line rounded-lg px-3 py-1.5 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted"
        />
        <button
          onClick={add}
          disabled={!text.trim()}
          className="px-3 py-1.5 bg-ink text-paper text-xs font-semibold rounded-lg hover:bg-ink-700 transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {archived.length > 0 && (
        <div className="mt-4 pt-3 border-t border-line">
          <button
            onClick={() => setShowArchive((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors"
            aria-expanded={showArchive}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden
              className={`transition-transform ${showArchive ? 'rotate-90' : ''}`}
            >
              <path d="M3.5 2l4 3-4 3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Archive ({archived.length})
          </button>
          {showArchive && (
            <ul className="space-y-1.5 mt-2.5">{archived.map(row)}</ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- Schedule editor ---- */

function ScheduleEditor({
  items,
  onChange,
}: {
  items: ScheduleItem[];
  onChange: (items: ScheduleItem[]) => void;
}) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');

  const add = () => {
    const l = label.trim();
    if (!l) return;
    onChange([...items, { id: uuid(), label: l, date }]);
    setLabel('');
    setDate('');
  };
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  const sorted = [...items].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));

  return (
    <div>
      <ul className="space-y-1.5 mb-3">
        {sorted.map((item) => (
          <li key={item.id} className="group flex items-center gap-3">
            <span className="text-xs text-muted tabular-nums w-24 shrink-0">
              {item.date
                ? new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'No date'}
            </span>
            <span className="flex-1 text-sm text-ink">{item.label}</span>
            <button
              onClick={() => remove(item.id)}
              className="w-5 h-5 flex items-center justify-center rounded text-muted opacity-0 group-hover:opacity-100 hover:text-bad transition-opacity"
              aria-label="Remove"
            >
              <svg width="11" height="11" viewBox="0 0 10 10" aria-hidden>
                <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="text-xs text-muted">No milestones yet.</li>}
      </ul>
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-line rounded-lg px-2.5 py-1.5 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink"
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Milestone, e.g. Ship MVP"
          className="flex-1 border border-line rounded-lg px-3 py-1.5 text-sm text-ink bg-paper focus:outline-none focus:ring-1 focus:ring-ink placeholder:text-muted"
        />
        <button
          onClick={add}
          disabled={!label.trim()}
          className="px-3 py-1.5 bg-ink text-paper text-xs font-semibold rounded-lg hover:bg-ink-700 transition-colors disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  );
}
