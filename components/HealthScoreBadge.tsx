import { AlertSeverity } from '@/lib/store';

interface HealthScoreBadgeProps {
  score: number;
  alertStatus: AlertSeverity;
}

export default function HealthScoreBadge({ score, alertStatus }: HealthScoreBadgeProps) {
  const getColor = () => {
    if (alertStatus === 'CRITICAL') return 'bg-red-100 text-red-800';
    if (alertStatus === 'WARNING') return 'bg-yellow-100 text-yellow-800';
    if (alertStatus === 'INFO') return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = () => {
    if (alertStatus === 'CRITICAL') return 'bg-red-500';
    if (alertStatus === 'WARNING') return 'bg-yellow-500';
    if (alertStatus === 'INFO') return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColor()}`}>
        {score}
      </span>
      <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span className="text-sm text-gray-600">{alertStatus}</span>
    </div>
  );
}

