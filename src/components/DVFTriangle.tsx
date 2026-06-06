type Props = {
  size?: number;
};

/**
 * The Desirability / Feasibility / Viability triangle.
 * The overlap of all three is where a viable SaaS idea lives.
 */
export function DVFTriangle({ size = 300 }: Props) {
  const w = size;
  const h = size * 0.9;
  const cx = w / 2;
  // vertices of the outer triangle
  const top = { x: cx, y: 24 };
  const left = { x: 40, y: h - 30 };
  const right = { x: w - 40, y: h - 30 };

  // three overlapping circles centred toward each vertex
  const r = size * 0.27;
  const dC = { x: cx, y: top.y + r * 0.95 }; // desirability (top)
  const fC = { x: left.x + r * 0.95, y: left.y - r * 0.55 }; // feasibility (bottom-left)
  const vC = { x: right.x - r * 0.95, y: right.y - r * 0.55 }; // viability (bottom-right)

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">The DVF framework</h3>
      <svg width={w} height={h} className="overflow-visible">
        <g style={{ mixBlendMode: 'multiply' }}>
          <circle cx={dC.x} cy={dC.y} r={r} fill="#0072B2" opacity={0.18} />
          <circle cx={fC.x} cy={fC.y} r={r} fill="#E69F00" opacity={0.2} />
          <circle cx={vC.x} cy={vC.y} r={r} fill="#009E73" opacity={0.18} />
        </g>
        <circle cx={dC.x} cy={dC.y} r={r} fill="none" stroke="#0072B2" strokeWidth={1.5} />
        <circle cx={fC.x} cy={fC.y} r={r} fill="none" stroke="#E69F00" strokeWidth={1.5} />
        <circle cx={vC.x} cy={vC.y} r={r} fill="none" stroke="#009E73" strokeWidth={1.5} />

        {/* centre sweet spot */}
        <text x={cx} y={h * 0.52} textAnchor="middle" fontSize="11" className="fill-slate-700" fontWeight="600">
          Build
        </text>
        <text x={cx} y={h * 0.52 + 13} textAnchor="middle" fontSize="9" className="fill-slate-500">
          this
        </text>

        {/* labels */}
        <text x={dC.x} y={top.y - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0072B2">
          Desirability
        </text>
        <text x={dC.x} y={top.y + 10} textAnchor="middle" fontSize="9" className="fill-slate-500">
          people want it
        </text>

        <text x={left.x - 4} y={left.y + 20} textAnchor="start" fontSize="13" fontWeight="700" fill="#B8780A">
          Feasibility
        </text>
        <text x={left.x - 4} y={left.y + 33} textAnchor="start" fontSize="9" className="fill-slate-500">
          you can build it
        </text>

        <text x={right.x + 4} y={right.y + 20} textAnchor="end" fontSize="13" fontWeight="700" fill="#009E73">
          Viability
        </text>
        <text x={right.x + 4} y={right.y + 33} textAnchor="end" fontSize="9" className="fill-slate-500">
          it can make money
        </text>
      </svg>
      <p className="mt-1 text-xs text-slate-500 max-w-xs text-center">
        A strong idea sits in the overlap of all three. This tool scores each pillar so you can see
        which ones an idea is missing.
      </p>
    </div>
  );
}
