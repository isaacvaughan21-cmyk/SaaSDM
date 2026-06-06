type Props = {
  onHelp: () => void;
  onWeights: () => void;
  onExportPdf: () => void;
  onNew: () => void;
  canExport: boolean;
};

export function Header({ onHelp, onWeights, onExportPdf, onNew, canExport }: Props) {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3 py-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          💡
        </span>
        <h1 className="text-lg font-bold text-slate-900">SaaS Decision Matrix</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onHelp}
          className="w-9 h-9 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
          title="Help"
        >
          ?
        </button>
        <button
          onClick={onWeights}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-100"
        >
          ⚙ Weights
        </button>
        <button
          onClick={onExportPdf}
          disabled={!canExport}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
          title={canExport ? 'Export a PDF report' : 'Add an idea first'}
        >
          Export PDF
        </button>
        <button
          onClick={onNew}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
        >
          + New Idea
        </button>
      </div>
    </header>
  );
}
