import { useState, useRef, useEffect } from 'react';
import type { WorkflowStatus } from '../state/types';
import { WORKFLOW_LABELS } from '../state/types';

// Neutral ink shades — colour stays reserved for score data elsewhere.
export const WORKFLOW_DOT: Record<WorkflowStatus, string> = {
  open: '#6B6660',
  wip: '#1B1A17',
  on_hold: '#B8B2A7',
};

const ORDER: WorkflowStatus[] = ['open', 'wip', 'on_hold'];

type Props = {
  value: WorkflowStatus;
  onChange: (s: WorkflowStatus) => void;
};

export function WorkflowStatusPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 border border-line rounded-md text-xs font-medium text-ink hover:bg-ink-50 transition-colors"
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: WORKFLOW_DOT[value] }}
        />
        {WORKFLOW_LABELS[value]}
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden className="text-muted">
          <path d="M2.5 4l2.5 2.5L7.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-surface border border-line rounded-lg shadow-lift py-1 z-30">
          {ORDER.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-ink-50 transition-colors ${
                s === value ? 'font-semibold text-ink' : 'text-muted'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: WORKFLOW_DOT[s] }}
              />
              {WORKFLOW_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
