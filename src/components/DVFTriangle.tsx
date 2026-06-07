type Props = {
  size?: number;
};

const INK = '#1B1A17';
const PAPER = '#FBFAF6';

/**
 * The Desirability / Feasibility / Viability venn.
 * Neutral palette to match the editorial design; labels sit clear of the
 * circles and a simple bulb pictogram marks the overlap.
 */
export function DVFTriangle({ size = 320 }: Props) {
  const VB = 340;
  const r = 70;
  const dC = { x: 170, y: 130 }; // desirability (top)
  const fC = { x: 116, y: 222 }; // feasibility (bottom-left)
  const vC = { x: 224, y: 222 }; // viability (bottom-right)
  const cx = (dC.x + fC.x + vC.x) / 3;
  const cy = (dC.y + fC.y + vC.y) / 3;

  return (
    <div className="flex flex-col items-center">
      <h3 className="kicker text-muted mb-3">The framework</h3>
      <svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} className="overflow-visible">
        {/* neutral translucent fills (multiply so overlaps read as deeper grey) */}
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx={dC.x} cy={dC.y} r={r} fill={INK} opacity={0.06} />
          <circle cx={fC.x} cy={fC.y} r={r} fill={INK} opacity={0.06} />
          <circle cx={vC.x} cy={vC.y} r={r} fill={INK} opacity={0.06} />
        </g>
        <circle cx={dC.x} cy={dC.y} r={r} fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={1.4} />
        <circle cx={fC.x} cy={fC.y} r={r} fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={1.4} />
        <circle cx={vC.x} cy={vC.y} r={r} fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={1.4} />

        {/* clean disc so the bulb has breathing room in the overlap */}
        <circle cx={cx} cy={cy} r={19} fill={PAPER} opacity={0.92} />

        {/* simple bulb pictogram */}
        <g transform={`translate(${cx}, ${cy})`} stroke={INK} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={0} cy={-3} r={9} fill={PAPER} />
          <path d="M-3 -4 L0 -1 L3 -4" fill="none" />
          <path d="M-4 6 L4 6" />
          <path d="M-3 9 L3 9" />
          <path d="M-2 11.5 L2 11.5" />
        </g>

        {/* labels — placed clear of the circles */}
        {/* Desirability, above the top circle */}
        <text x={dC.x} y={dC.y - r - 16} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
          Desirability
        </text>
        <text x={dC.x} y={dC.y - r - 3} textAnchor="middle" fontSize="9.5" fill="#6B6660">
          people want it
        </text>

        {/* Feasibility, below the bottom-left circle */}
        <text x={fC.x} y={VB - 16} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
          Feasibility
        </text>
        <text x={fC.x} y={VB - 3} textAnchor="middle" fontSize="9.5" fill="#6B6660">
          you can build it
        </text>

        {/* Viability, below the bottom-right circle */}
        <text x={vC.x} y={VB - 16} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
          Viability
        </text>
        <text x={vC.x} y={VB - 3} textAnchor="middle" fontSize="9.5" fill="#6B6660">
          it can make money
        </text>
      </svg>
      <p className="mt-3 text-xs text-muted max-w-xs text-center">
        A strong idea sits in the middle — where all three pillars overlap. This tool scores each
        pillar so you can see which ones an idea is missing.
      </p>
    </div>
  );
}
