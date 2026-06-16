import { getViralityBarColor, getViralityLabel } from '@/lib/utils/virality';

interface EngagementBarProps {
  score: number;
  percent: number;
}

export default function EngagementBar({ score, percent }: EngagementBarProps) {
  const barColor = getViralityBarColor(score);
  const label = getViralityLabel(score);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Engagement Bar</span>
        <span className="text-xs text-gray-500">{percent}% of max score</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
