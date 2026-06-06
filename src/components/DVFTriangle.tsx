type Props = {
  size?: number;
};

/**
 * The Desirability / Feasibility / Viability venn.
 * Labels sit outside the circles; the lit bulb marks the overlap sweet spot.
 */
export function DVFTriangle({ size = 320 }: Props) {
  // Intrinsic coordinate space — scaled via viewBox.
  const VB = 340;
  const r = 74;
  // Centres pulled in toward the middle so the 3-way overlap is large enough
  // to seat the lightbulb fully.
  const dC = { x: 170, y: 150 }; // desirability (top)
  const fC = { x: 132, y: 214 }; // feasibility (bottom-left)
  const vC = { x: 208, y: 214 }; // viability (bottom-right)
  // bulb at the exact centroid of the three circle centres
  const center = { x: (dC.x + fC.x + vC.x) / 3, y: (dC.y + fC.y + vC.y) / 3 };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-ink mb-2">The DVF framework</h3>
      <svg width={size} height={size} viewBox={`0 0 ${VB} ${VB}`} className="overflow-visible">
        <defs>
          <filter id="bulbGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* translucent fills (multiply so overlaps deepen) */}
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx={dC.x} cy={dC.y} r={r} fill="#0072B2" opacity={0.16} />
          <circle cx={fC.x} cy={fC.y} r={r} fill="#E69F00" opacity={0.18} />
          <circle cx={vC.x} cy={vC.y} r={r} fill="#009E73" opacity={0.16} />
        </g>
        <circle cx={dC.x} cy={dC.y} r={r} fill="none" stroke="#0072B2" strokeWidth={1.5} />
        <circle cx={fC.x} cy={fC.y} r={r} fill="none" stroke="#E69F00" strokeWidth={1.5} />
        <circle cx={vC.x} cy={vC.y} r={r} fill="none" stroke="#009E73" strokeWidth={1.5} />

        {/* lit lightbulb in the central overlap */}
        <circle cx={center.x} cy={center.y} r={20} fill="#FACC15" opacity={0.85} filter="url(#bulbGlow)" />
        <text
          x={center.x}
          y={center.y + 11}
          textAnchor="middle"
          fontSize="30"
          style={{ pointerEvents: 'none' }}
        >
          💡
        </text>

        {/* labels OUTSIDE the circles */}
        {/* Desirability — above the top circle */}
        <text x={dC.x} y={dC.y - r - 14} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0072B2">
          Desirability
        </text>
        <text x={dC.x} y={dC.y - r - 1} textAnchor="middle" fontSize="9.5" className="fill-muted">
          people want it
        </text>

        {/* Feasibility — below the bottom-left circle */}
        <text x={fC.x - 6} y={VB - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#B8780A">
          Feasibility
        </text>
        <text x={fC.x - 6} y={VB - 7} textAnchor="middle" fontSize="9.5" className="fill-muted">
          you can build it
        </text>

        {/* Viability — below the bottom-right circle */}
        <text x={vC.x + 6} y={VB - 20} textAnchor="middle" fontSize="14" fontWeight="700" fill="#009E73">
          Viability
        </text>
        <text x={vC.x + 6} y={VB - 7} textAnchor="middle" fontSize="9.5" className="fill-muted">
          it can make money
        </text>
      </svg>
      <p className="mt-2 text-xs text-muted max-w-xs text-center">
        A winning idea lights up the middle — where all three pillars overlap. This tool scores each
        pillar so you can see which ones an idea is missing.
      </p>
    </div>
  );
}
