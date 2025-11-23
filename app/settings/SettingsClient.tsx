'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsClientProps {
  initialSettings: any;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleToggle = async (field: string, value: boolean) => {
    setSettings({ ...settings, [field]: value });
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(false);
    router.refresh();
  };

  const handleSensitivityChange = async (field: string, value: number) => {
    setSettings({ ...settings, [field]: value });
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(false);
    router.refresh();
  };

  const handleThresholdChange = async (field: string, value: number) => {
    setSettings({ ...settings, [field]: value });
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(false);
    router.refresh();
  };

  const metrics = [
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'roas', label: 'ROAS' },
    { key: 'conversion', label: 'Conversions' },
    { key: 'spend', label: 'Spend' },
    { key: 'bounce', label: 'Bounce Rate' },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Slack</label>
              <p className="text-sm text-gray-500">Receive alerts via Slack</p>
            </div>
            <button
              onClick={() => handleToggle('slackEnabled', !settings.slackEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.slackEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.slackEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Email</label>
              <p className="text-sm text-gray-500">Receive alerts via Email</p>
            </div>
            <button
              onClick={() => handleToggle('emailEnabled', !settings.emailEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">In-App</label>
              <p className="text-sm text-gray-500">Show alerts in dashboard</p>
            </div>
            <button
              onClick={() => handleToggle('inAppEnabled', !settings.inAppEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.inAppEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.inAppEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Sensitivity Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Sensitivity Settings</h2>
        <p className="text-sm text-gray-600 mb-6">
          Adjust sensitivity for each metric (0-100). Higher values trigger alerts more easily.
        </p>
        <div className="space-y-6">
          {metrics.map((metric) => {
            const sensitivityKey = `${metric.key}Sensitivity` as keyof typeof settings;
            const thresholdKey = `${metric.key}Threshold` as keyof typeof settings;
            return (
              <div key={metric.key}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-900">{metric.label}</label>
                  <span className="text-sm text-gray-600">{settings[sensitivityKey]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings[sensitivityKey] || 50}
                  onChange={(e) => handleSensitivityChange(sensitivityKey as string, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Threshold: {settings[thresholdKey]}% change triggers alert
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="0.5"
                    value={settings[thresholdKey] || 15}
                    onChange={(e) => handleThresholdChange(thresholdKey as string, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Placeholders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Integrations</h2>
        <div className="space-y-4">
          <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700">
            Connect Google Ads
          </button>
          <button className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700">
            Connect Facebook Ads
          </button>
        </div>
      </div>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
    </div>
  );
}

