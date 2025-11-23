import Nav from '@/components/Nav';
import { prisma } from '@/lib/prisma';
import SettingsClient from './SettingsClient';

async function getSettings() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 'default',
        slackEnabled: false,
        emailEnabled: true,
        inAppEnabled: true,
        ctrSensitivity: 50,
        cpcSensitivity: 50,
        roasSensitivity: 50,
        conversionSensitivity: 50,
        spendSensitivity: 50,
        bounceSensitivity: 50,
        ctrThreshold: 15.0,
        cpcThreshold: 15.0,
        roasThreshold: 15.0,
        conversionThreshold: 15.0,
        spendThreshold: 15.0,
        bounceThreshold: 15.0,
      },
    });
  }

  return settings;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure notification preferences and sensitivity settings</p>
        </div>

        <SettingsClient initialSettings={settings} />
      </div>
    </div>
  );
}

