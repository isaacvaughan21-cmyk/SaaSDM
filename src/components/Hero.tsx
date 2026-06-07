type Props = {
  onNew: () => void;
  ideaCount: number;
};

export function Hero({ onNew, ideaCount }: Props) {
  const scrollToFramework = () =>
    document.getElementById('framework')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section className="relative border-y border-line py-14 md:py-20">
      <div className="max-w-3xl">
        <p className="kicker text-muted">A decision tool for solo founders</p>

        <h2 className="font-display mt-5 text-[2.6rem] md:text-6xl leading-[1.02] tracking-[-0.02em] text-ink">
          Stop guessing which
          <br className="hidden md:block" /> idea to{' '}
          <em className="italic font-medium">actually</em> build.
        </h2>

        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
          Score every SaaS idea across nine weighted criteria — Desirability, Feasibility, and
          Viability. The matrix ranks them, flags fatal weaknesses, and shows you, in one glance,
          the one worth your next six months.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={onNew}
            className="group inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-paper font-semibold hover:bg-ink-700 transition-colors"
          >
            {ideaCount === 0 ? 'Score your first idea' : 'Score another idea'}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
          <button
            onClick={scrollToFramework}
            className="inline-flex items-center rounded-md border border-line bg-surface px-6 py-3 text-ink font-medium hover:border-muted transition-colors"
          >
            How it works
          </button>
        </div>

        <p className="mt-8 kicker text-muted">
          Desirability &nbsp;·&nbsp; Feasibility &nbsp;·&nbsp; Viability
        </p>
      </div>
    </section>
  );
}
