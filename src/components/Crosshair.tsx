type Dot = {
  id: string;
  label: string;
  /** 1-5 score driving position along the diagonal */
  score: number;
};

type Props = {
  title: string;
  xLabel: string;
  yLabel: string;
  /** corner labels: [topLeft, topRight, bottomLeft, bottomRight] */
  quadrants: [string, string, string, string];
  dots: Dot[];
};

const VB = 300;
const PAD = 44;

export function Crosshair({ title, xLabel, yLabel, quadrants, dots }: Props) {
  const x0 = PAD;
  const y0 = PAD;
  const inner = VB - PAD * 2;
  const x1 = x0 + inner;
  const y1 = y0 + inner;
  const mid = inner / 2;

  const pos = (score: number) => (score - 1) / 4; // 0..1

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{title}</h3>
      <svg width={300} height={300} viewBox={`0 0 ${VB} ${VB}`} className="overflow-visible">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
          </marker>
          <radialGradient id="dotFill" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </radialGradient>
        </defs>

        {/* quadrant tints: bottom-left = weak, top-right = strong */}
        <rect x={x0} y={y0} width={mid} height={mid} fill="#f1f5f9" />
        <rect x={x0 + mid} y={y0} width={mid} height={mid} fill="#dcefe8" />
        <rect x={x0} y={y0 + mid} width={mid} height={mid} fill="#f9e6dc" />
        <rect x={x0 + mid} y={y0 + mid} width={mid} height={mid} fill="#f1f5f9" />

        {/* diagonal guide (scores plot along this) */}
        <line x1={x0} y1={y1} x2={x1} y2={y0} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />

        {/* frame + axes */}
        <rect x={x0} y={y0} width={inner} height={inner} fill="none" stroke="#cbd5e1" />
        <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#94a3b8" markerEnd="url(#arrow)" transform={`translate(0,2)`} />
        <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="#94a3b8" markerEnd="url(#arrow)" transform={`translate(-2,0)`} />

        {/* corner labels */}
        <text x={x0 + mid * 0.5} y={y0 + 16} textAnchor="middle" fontSize="9" className="fill-slate-400" fontWeight="600">{quadrants[0]}</text>
        <text x={x0 + mid * 1.5} y={y0 + 16} textAnchor="middle" fontSize="9" className="fill-emerald-600" fontWeight="700">{quadrants[1]}</text>
        <text x={x0 + mid * 0.5} y={y1 - 8} textAnchor="middle" fontSize="9" className="fill-orange-500" fontWeight="700">{quadrants[2]}</text>
        <text x={x0 + mid * 1.5} y={y1 - 8} textAnchor="middle" fontSize="9" className="fill-slate-400" fontWeight="600">{quadrants[3]}</text>

        {/* dots */}
        {dots.map((d, i) => {
          const t = pos(d.score);
          const cx = x0 + t * inner;
          const cy = y1 - t * inner;
          // stagger labels vertically to reduce overlap
          const labelDy = i % 2 === 0 ? -10 : 16;
          const text = d.label.length > 16 ? d.label.slice(0, 15) + '…' : d.label;
          return (
            <g key={d.id}>
              <circle cx={cx} cy={cy} r={6} fill="url(#dotFill)" stroke="#fff" strokeWidth={1.5}>
                <title>{`${d.label} — ${d.score.toFixed(1)}`}</title>
              </circle>
              <text
                x={cx}
                y={cy + labelDy}
                textAnchor="middle"
                fontSize="9"
                className="fill-slate-700"
                fontWeight="600"
                stroke="#fff"
                strokeWidth={2.5}
                paintOrder="stroke"
              >
                {text}
              </text>
            </g>
          );
        })}

        {/* axis captions */}
        <text x={x0 + mid} y={VB - 6} textAnchor="middle" fontSize="10" className="fill-slate-500">{xLabel}</text>
        <text x={-(y0 + mid)} y={16} textAnchor="middle" fontSize="10" className="fill-slate-500" transform="rotate(-90)">{yLabel}</text>
      </svg>
    </div>
  );
}
