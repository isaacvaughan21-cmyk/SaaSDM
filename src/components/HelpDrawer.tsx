import { RubricCards } from './RubricCards';
import { DVFTriangle } from './DVFTriangle';
import { LIGHT_STYLES } from './ScoreDot';

export function HelpDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-line px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">How scoring works</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl">
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-6 text-sm text-muted">
          <section>
            <p>
              Each idea is scored across three equally-weighted pillars — Desirability, Feasibility,
              and Viability. Each pillar has three sub-criteria scored 1–5. The pillar score is the
              weighted average of its sub-criteria; the composite is the mean of the three pillars.
              A strong idea sits in the overlap of all three.
            </p>
          </section>

          <section className="flex justify-center">
            <DVFTriangle size={260} />
          </section>

          <section>
            <h3 className="font-semibold text-ink mb-2">The nine criteria</h3>
            <RubricCards />
          </section>

          <section>
            <h3 className="font-semibold text-ink mb-1">Auto-flag rule</h3>
            <p>
              If <strong>any single pillar scores below 2.0</strong>, the idea is flagged red
              regardless of its composite. A fatal weakness in one pillar cannot be averaged away by
              strength elsewhere.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-ink mb-1">Traffic-light thresholds</h3>
            <ul className="space-y-1">
              <li>
                <span style={{ color: LIGHT_STYLES.green.color }} className="font-semibold mr-2">
                  {LIGHT_STYLES.green.shape} {LIGHT_STYLES.green.label}
                </span>
                — 3.5 and above
              </li>
              <li>
                <span style={{ color: LIGHT_STYLES.yellow.color }} className="font-semibold mr-2">
                  {LIGHT_STYLES.yellow.shape} {LIGHT_STYLES.yellow.label}
                </span>
                — 2.0 to 3.49
              </li>
              <li>
                <span style={{ color: LIGHT_STYLES.red.color }} className="font-semibold mr-2">
                  {LIGHT_STYLES.red.shape} {LIGHT_STYLES.red.label}
                </span>
                — below 2.0
              </li>
            </ul>
            <p className="text-xs text-muted mt-2">
              Colours use a colourblind-safe palette and each level also has a distinct shape, so the
              rating never relies on colour alone.
            </p>
          </section>

          <section className="text-xs text-muted border-t border-line pt-4">
            Framework inspired by Simon Hoiberg's DVF triangle, problem crosshair, and profitability
            crosshair for solo SaaS founders.
          </section>
        </div>
      </div>
    </div>
  );
}
