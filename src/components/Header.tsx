import { useState, useRef, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import bulbUrl from '../assets/lightbulb.jpg';

type Tab = 'matrix' | 'library';

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onFeedback: () => void;
  onWeights: () => void;
  onExportPdf: () => void;
  onNew: () => void;
  canExport: boolean;
};

function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (user.email ?? '?')
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-ink text-paper text-xs font-semibold flex items-center justify-center hover:bg-ink-700 transition-colors"
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-52 bg-surface border border-line rounded-xl shadow-lift py-1.5 z-40">
          <p className="px-3 py-1.5 text-xs text-muted truncate">{user.email}</p>
          <div className="h-px bg-line mx-3 my-1" />
          <button
            onClick={() => { setOpen(false); onSignOut(); }}
            className="w-full text-left px-3 py-1.5 text-sm text-ink hover:bg-ink-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function Header({
  activeTab,
  onTabChange,
  user,
  onSignIn,
  onSignOut,
  onFeedback,
  onWeights,
  onExportPdf,
  onNew,
  canExport,
}: Props) {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3 py-5">
      {/* left: logo + name + tabs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <img
            src={bulbUrl}
            alt=""
            aria-hidden
            className="w-7 h-7 shrink-0 -mr-0.5"
            style={{ mixBlendMode: 'multiply' }}
          />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            The Idea Matrix
          </span>
        </div>

        {/* tabs */}
        <nav className="flex items-center gap-1 border border-line rounded-lg p-0.5 bg-surface">
          {(['matrix', 'library'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-ink text-paper font-medium'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab === 'matrix' ? 'Matrix' : 'Library'}
            </button>
          ))}
        </nav>
      </div>

      {/* right: context buttons + feedback + auth */}
      <div className="flex items-center gap-1.5">
        {/* Matrix-only actions */}
        {activeTab === 'matrix' && (
          <>
            <button
              onClick={onWeights}
              className="px-3 py-2 rounded-md text-sm text-muted hover:bg-ink-50 hover:text-ink transition-colors"
            >
              Weights
            </button>
            <button
              onClick={onExportPdf}
              disabled={!canExport}
              className="px-3 py-2 rounded-md text-sm text-muted hover:bg-ink-50 hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title={canExport ? 'Export a PDF report' : 'Add an idea first'}
            >
              Export PDF
            </button>
            <button
              onClick={onNew}
              className="ml-1 px-4 py-2 rounded-md bg-ink text-paper text-sm font-semibold hover:bg-ink-700 transition-colors"
            >
              New idea
            </button>
            <div className="w-px h-5 bg-line mx-1" />
          </>
        )}

        {/* Feedback (always visible) */}
        <button
          onClick={onFeedback}
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted hover:bg-ink-50 hover:text-ink transition-colors"
          title="Send feedback"
          aria-label="Send feedback"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M2 4.5A1.5 1.5 0 0 1 3.5 3h11A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13H7l-3.5 3v-3H3.5A1.5 1.5 0 0 1 2 11.5v-7Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Auth */}
        {user ? (
          <UserMenu user={user} onSignOut={onSignOut} />
        ) : (
          <button
            onClick={onSignIn}
            className="px-3 py-2 rounded-md text-sm text-muted hover:bg-ink-50 hover:text-ink transition-colors"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}
