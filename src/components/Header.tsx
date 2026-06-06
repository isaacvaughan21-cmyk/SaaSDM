type Props = {
  onHelp: () => void;
  onWeights: () => void;
  onExport: () => void;
  onImport: () => void;
  onNew: () => void;
};

export function Header({ onHelp, onWeights, onExport, onImport, onNew }: Props) {
  return (
    <header className="flex items-center justify-between flex-wrap gap-3 mb-6">
      <h1 className="text-xl font-bold text-slate-900">SaaS Decision Matrix</h1>
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
          onClick={onExport}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-100"
        >
          Export JSON
        </button>
        <button
          onClick={onImport}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-600 hover:bg-slate-100"
        >
          Import JSON
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
