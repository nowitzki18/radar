'use client';

import { useState } from 'react';

interface CampaignActionsProps {
  campaignId: string;
}

export default function CampaignActions({ campaignId }: CampaignActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    setLoading(true);
    // TODO: Implement resolve logic
    setTimeout(() => setLoading(false), 1000);
  };

  const handleDismiss = async () => {
    setLoading(true);
    // TODO: Implement dismiss logic
    setTimeout(() => setLoading(false), 1000);
  };

  const handleAdjustSensitivity = async () => {
    setLoading(true);
    // TODO: Navigate to settings or open modal
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
      <div className="space-y-2">
        <button
          onClick={handleResolve}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Resolve
        </button>
        <button
          onClick={handleDismiss}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Dismiss
        </button>
        <button
          onClick={handleAdjustSensitivity}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Adjust Sensitivity
        </button>
      </div>
    </div>
  );
}

