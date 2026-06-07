import bulbUrl from '../assets/lightbulb.jpg';

type Props = {
  onFeedback: () => void;
  onWeights: () => void;
  onExportPdf: () => void;
  onNew: () => void;
  canExport: boolean;
};

export function Header({ onFeedback, onWeights, onExportPdf, onNew, canExport }: Props) {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3 py-5">
      <div className="flex items-center gap-2.5">
        {/* lightbulb mark (multiply drops its white background onto the paper) */}
        <img
          src={bulbUrl}
          alt=""
          aria-hidden
          className="w-7 h-7 shrink-0"
          style={{ mixBlendMode: 'multiply' }}
        />
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          The Idea Matrix
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onFeedback}
          className="w-9 h-9 flex items-center justify-center rounded-md text-muted hover:bg-ink-50 hover:text-ink transition-colors"
          title="Send feedback"
          aria-label="Send feedback"
        >
          {/* chat-bubble pictogram */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M2 4.5A1.5 1.5 0 0 1 3.5 3h11A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13H7l-3.5 3v-3H3.5A1.5 1.5 0 0 1 2 11.5v-7Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </button>
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
      </div>
    </header>
  );
}
