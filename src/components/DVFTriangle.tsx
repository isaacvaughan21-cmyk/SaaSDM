import { PILLAR_COLORS } from '../state/defaults';
import bulbUrl from '../assets/lightbulb.jpg';

type Props = {
  size?: number;
};

const MUTED = '#6B6660';

/**
 * The Desirability / Feasibility / Viability venn.
 * Circle + label shades match the scoring-framework headers; a lit-bulb
 * pictogram sits in the central overlap.
 */
export function DVFTriangle({ size = 320 }: Props) {
  const W = 340;
  const H = 296;
  const r = 70;
  // Centres pulled close so the 3-way overlap is large enough to hold the bulb.
  const dC = { x: 170, y: 116 }; // desirability (top)
  const fC = { x: 132, y: 182 }; // feasibility (bottom-left)
  const vC = { x: 208, y: 182 }; // viability (bottom-right)
  const cx = (dC.x + fC.x + vC.x) / 3;
  const cy = (dC.y + fC.y + vC.y) / 3;

  const dCol = PILLAR_COLORS.desirability;
  const fCol = PILLAR_COLORS.feasibility;
  const vCol = PILLAR_COLORS.viability;

  const bulb = 58;

  return (
    <div className="flex flex-col items-center">
      <h3 className="kicker text-muted mb-1">The Framework</h3>
      <svg
        width={size}
        height={Math.round((size * H) / W)}
        viewBox={`0 0 ${W} ${H}`}
        className="overflow-visible"
      >
        {/* translucent fills (multiply so overlaps read as deeper tone) */}
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx={dC.x} cy={dC.y} r={r} fill={dCol} opacity={0.07} />
          <circle cx={fC.x} cy={fC.y} r={r} fill={fCol} opacity={0.07} />
          <circle cx={vC.x} cy={vC.y} r={r} fill={vCol} opacity={0.07} />
        </g>
        <circle cx={dC.x} cy={dC.y} r={r} fill="none" stroke={dCol} strokeOpacity={0.6} strokeWidth={1.4} />
        <circle cx={fC.x} cy={fC.y} r={r} fill="none" stroke={fCol} strokeOpacity={0.6} strokeWidth={1.4} />
        <circle cx={vC.x} cy={vC.y} r={r} fill="none" stroke={vCol} strokeOpacity={0.6} strokeWidth={1.4} />

        {/* lit-bulb image — multiply drops its white background onto the paper */}
        <image
          href={bulbUrl}
          x={cx - bulb / 2}
          y={cy - bulb / 2}
          width={bulb}
          height={bulb}
          style={{ mixBlendMode: 'multiply' }}
        />

        {/* labels — shades match the scoring-framework headers */}
        <text x={dC.x} y={24} textAnchor="middle" fontSize="14" fontWeight="700" fill={dCol}>
          Desirability
        </text>
        <text x={dC.x} y={37} textAnchor="middle" fontSize="9.5" fill={MUTED}>
          people want it
        </text>

        <text x={fC.x} y={H - 14} textAnchor="middle" fontSize="14" fontWeight="700" fill={fCol}>
          Feasibility
        </text>
        <text x={fC.x} y={H - 2} textAnchor="middle" fontSize="9.5" fill={MUTED}>
          you can build it
        </text>

        <text x={vC.x} y={H - 14} textAnchor="middle" fontSize="14" fontWeight="700" fill={vCol}>
          Viability
        </text>
        <text x={vC.x} y={H - 2} textAnchor="middle" fontSize="9.5" fill={MUTED}>
          it can make money
        </text>
      </svg>
      <p className="mt-2 text-xs text-muted max-w-xs text-center">
        A strong idea sits in the middle — where all three pillars overlap. This tool scores each
        pillar so you can see which ones an idea is missing.
      </p>
    </div>
  );
}
