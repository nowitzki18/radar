'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import AlertCard from '@/components/AlertCard';
import { Alert } from '@/lib/store';

interface AlertsClientProps {
  initialAlerts: any[];
}

export default function AlertsClient({ initialAlerts }: AlertsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [severity, setSeverity] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (severity !== 'ALL') params.set('severity', severity);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    startTransition(() => {
      router.push(`/alerts?${params.toString()}`);
    });
  };

  const handleResolve = async (id: string) => {
    await fetch(`/api/alerts/${id}/resolve`, { method: 'POST' });
    router.refresh();
  };

  const handleDismiss = async (id: string) => {
    await fetch(`/api/alerts/${id}/dismiss`, { method: 'POST' });
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
              <option value="OK">OK</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilter}
              disabled={isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Filtering...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {initialAlerts.length > 0 ? (
          initialAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert as Alert}
              onResolve={handleResolve}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No alerts found matching your filters.</p>
          </div>
        )}
      </div>
    </>
  );
}

