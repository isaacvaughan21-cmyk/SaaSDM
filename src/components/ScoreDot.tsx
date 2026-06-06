import { trafficLight, fmt } from '../state/scoring';

const COLORS: Record<string, string> = {
  green: 'bg-green',
  yellow: 'bg-yellow',
  red: 'bg-red',
};

export function ScoreDot({ score }: { score: number }) {
  const light = trafficLight(score);
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${COLORS[light]}`} />
      {fmt(score)}
    </span>
  );
}
