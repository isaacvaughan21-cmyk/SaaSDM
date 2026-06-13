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

  const add = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...items, { id: uuid(), text: t, done: false }]);
    setText('');
  };
  const toggle = (id: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      <ul className="space-y-1.5 mb-3">
        {items.map((item) => (
          <li key={item.id} className="group flex items-center gap-2.5">
            <button
              onClick={() => toggle(item.id)}
              className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                item.done ? 'bg-ink border-ink' : 'border-line hover:border-ink'
              }`}
              aria-label={item.done ? 'Mark not done' : 'Mark done'}
            >
              {item.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                  <path d="M2 5.2l2 2 4-4.4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${item.done ? 'text-muted line-through' : 'text-ink'}`}>
              {item.text}
            </span>
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
        {items.length === 0 && <li className="text-xs text-muted">Nothing yet.</li>}
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
