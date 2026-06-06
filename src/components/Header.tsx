type Props = {
  onHelp: () => void;
  onWeights: () => void;
  onExportPdf: () => void;
  onNew: () => void;
  canExport: boolean;
};

export function Header({ onHelp, onWeights, onExportPdf, onNew, canExport }: Props) {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3 py-5">
      <div className="flex items-center gap-3">
        {/* compact venn mark instead of an emoji */}
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden className="shrink-0">
          <circle cx="13" cy="9" r="6.5" fill="none" stroke="#1B1A17" strokeWidth="1.4" />
          <circle cx="9" cy="16" r="6.5" fill="none" stroke="#1B1A17" strokeWidth="1.4" />
          <circle cx="17" cy="16" r="6.5" fill="none" stroke="#1B1A17" strokeWidth="1.4" />
        </svg>
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Decision Matrix
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onHelp}
          className="w-9 h-9 rounded-md text-muted hover:bg-ink-50 hover:text-ink transition-colors"
          title="Help"
        >
          ?
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
