import { trafficLight, fmt } from '../state/scoring';
import type { TrafficLight } from '../state/scoring';

type Style = { color: string; shape: string; label: string };

export const LIGHT_STYLES: Record<TrafficLight, Style> = {
  green: { color: '#0072B2', shape: '▲', label: 'Strong' }, // blue, up triangle
  yellow: { color: '#E69F00', shape: '●', label: 'Caution' }, // orange, circle
  red: { color: '#D55E00', shape: '▼', label: 'Weak' }, // vermillion, down triangle
};

export function ScoreDot({ score }: { score: number }) {
  const light = trafficLight(score);
  const s = LIGHT_STYLES[light];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-semibold tabular-nums"
      style={{ color: s.color }}
      title={`${s.label} (${fmt(score)})`}
    >
      <span aria-hidden className="text-[0.85em] leading-none">
        {s.shape}
      </span>
      {fmt(score)}
    </span>
  );
}

/** Small legend explaining the shape/color scale. */
export function ScoreLegend() {
  const order: TrafficLight[] = ['green', 'yellow', 'red'];
  const ranges: Record<TrafficLight, string> = {
    green: '≥ 3.5',
    yellow: '2.0 – 3.49',
    red: '< 2.0',
  };
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      {order.map((l) => {
        const s = LIGHT_STYLES[l];
        return (
          <span key={l} className="inline-flex items-center gap-1.5">
            <span style={{ color: s.color }} aria-hidden>
              {s.shape}
            </span>
            <span style={{ color: s.color }} className="font-semibold">
              {s.label}
            </span>
            <span className="text-muted">{ranges[l]}</span>
          </span>
        );
      })}
    </div>
  );
}
