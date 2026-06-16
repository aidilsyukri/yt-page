import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  snaLabel: string;
  snaDescription?: string;
  color?: string;
  trend?: 'up' | 'down' | null;
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  snaLabel,
  snaDescription,
  color = 'text-[#1877F2]',
  trend,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-opacity-10 flex items-center justify-center ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className={`text-xs font-semibold ${color}`}>{snaLabel}</p>
        {snaDescription && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{snaDescription}</p>
        )}
      </div>
    </div>
  );
}
