import { RubricCards } from './RubricCards';

export function HelpDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">How scoring works</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl">
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 text-sm text-slate-600">
          <section>
            <p>
              Each idea is scored across three equally-weighted pillars — Desirability, Feasibility,
              and Viability. Each pillar has three sub-criteria scored 1–5. The pillar score is the
              weighted average of its sub-criteria; the composite is the mean of the three pillars.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-2">The nine criteria</h3>
            <RubricCards />
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Auto-flag rule</h3>
            <p>
              If <strong>any single pillar scores below 2.0</strong>, the idea is flagged red
              regardless of its composite. A fatal weakness in one pillar cannot be averaged away by
              strength elsewhere.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Traffic-light thresholds</h3>
            <ul className="space-y-1">
              <li>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green mr-2" />
                Green — 3.5 and above
              </li>
              <li>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow mr-2" />
                Yellow — 2.0 to 3.49
              </li>
              <li>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red mr-2" />
                Red — below 2.0
              </li>
            </ul>
          </section>

          <section className="text-xs text-slate-400 border-t border-slate-100 pt-4">
            Framework inspired by Simon Hoiberg's DVF triangle, problem crosshair, and profitability
            crosshair for solo SaaS founders.
          </section>
        </div>
      </div>
    </div>
  );
}
