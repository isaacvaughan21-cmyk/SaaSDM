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
  quadrants: [string, string, string, string]; // TL, TR, BL, BR
  dots: Dot[];
};

const SIZE = 240;
const PAD = 28;

export function Crosshair({ title, xLabel, yLabel, quadrants, dots }: Props) {
  const inner = SIZE - PAD * 2;
  // map score 1..5 -> 0..1 along both axes (45deg diagonal)
  const pos = (score: number) => (score - 1) / 4;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">{title}</h3>
      <svg width={SIZE} height={SIZE} className="overflow-visible">
        {/* quadrant backdrop */}
        <rect x={PAD} y={PAD} width={inner} height={inner} fill="#f8fafc" stroke="#e2e8f0" />
        {/* axes */}
        <line x1={PAD + inner / 2} y1={PAD} x2={PAD + inner / 2} y2={PAD + inner} stroke="#cbd5e1" />
        <line x1={PAD} y1={PAD + inner / 2} x2={PAD + inner} y2={PAD + inner / 2} stroke="#cbd5e1" />
        {/* quadrant labels */}
        <text x={PAD + inner * 0.25} y={PAD + inner * 0.25} textAnchor="middle" className="fill-slate-400" fontSize="10">
          {quadrants[0]}
        </text>
        <text x={PAD + inner * 0.75} y={PAD + inner * 0.25} textAnchor="middle" className="fill-slate-400" fontSize="10">
          {quadrants[1]}
        </text>
        <text x={PAD + inner * 0.25} y={PAD + inner * 0.78} textAnchor="middle" className="fill-slate-400" fontSize="10">
          {quadrants[2]}
        </text>
        <text x={PAD + inner * 0.75} y={PAD + inner * 0.78} textAnchor="middle" className="fill-slate-400" fontSize="10">
          {quadrants[3]}
        </text>
        {/* dots */}
        {dots.map((d) => {
          const t = pos(d.score);
          const cx = PAD + t * inner;
          const cy = PAD + inner - t * inner;
          return (
            <g key={d.id}>
              <circle cx={cx} cy={cy} r={5} className="fill-indigo-600">
                <title>{`${d.label} — ${d.score.toFixed(1)}`}</title>
              </circle>
              <text x={cx + 8} y={cy + 3} fontSize="9" className="fill-slate-600">
                {d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label}
              </text>
            </g>
          );
        })}
        {/* axis captions */}
        <text x={PAD + inner / 2} y={SIZE - 2} textAnchor="middle" fontSize="10" className="fill-slate-500">
          {xLabel}
        </text>
        <text
          x={-(PAD + inner / 2)}
          y={10}
          textAnchor="middle"
          fontSize="10"
          className="fill-slate-500"
          transform="rotate(-90)"
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}
