import Link from 'next/link';
import { Alert, AlertSeverity } from '@/lib/store';

interface AlertCardProps {
  alert: Alert;
  onResolve?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export default function AlertCard({ alert, onResolve, onDismiss }: AlertCardProps) {
  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-50';
      case 'WARNING':
        return 'border-yellow-500 bg-yellow-50';
      case 'INFO':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const percentChange = ((alert.actual - alert.expected) / alert.expected) * 100;

  return (
    <div className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadge(alert.severity)}`}>
              {alert.severity}
            </span>
            <span className="text-sm text-gray-600">
              {formatDate(alert.timestamp)}
            </span>
            {alert.status !== 'ACTIVE' && (
              <span className="text-xs text-gray-500">
                ({alert.status})
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{alert.metricName}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              Expected: <span className="font-medium">{alert.expected.toFixed(2)}</span>
            </div>
            <div>
              Actual: <span className="font-medium">{alert.actual.toFixed(2)}</span>
              <span className={`ml-2 ${percentChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ({percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%)
              </span>
            </div>
          </div>
          <Link
            href={`/campaign/${alert.campaignId}`}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            View Campaign →
          </Link>
        </div>
        {alert.status === 'ACTIVE' && (
          <div className="flex gap-2">
            {onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                Resolve
              </button>
            )}
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

