type Props = {
  onNew: () => void;
  onHelp: () => void;
  ideaCount: number;
};

export function Hero({ onNew, onHelp, ideaCount }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white px-8 py-12 md:py-16 text-center shadow-lg">
      {/* decorative glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white/15 rounded-full px-3 py-1">
          💡 Desirability · Feasibility · Viability
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
          Stop guessing. <span className="text-indigo-200">Score</span> your next SaaS idea.
        </h2>
        <p className="mt-4 text-indigo-100 text-base md:text-lg">
          Replace gut-feel with a repeatable rubric. Rank every idea across nine weighted criteria,
          auto-flag fatal weaknesses, and see at a glance which one is worth building.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={onNew}
            className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 shadow-md transition"
          >
            {ideaCount === 0 ? '＋ Score your first idea' : '＋ Score another idea'}
          </button>
          <button
            onClick={onHelp}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition"
          >
            See how it works
          </button>
        </div>
      </div>
    </section>
  );
}
