import { Suspense } from 'react';
import Nav from '@/components/Nav';
import AlertCard from '@/components/AlertCard';
import { prisma } from '@/lib/prisma';
import AlertsClient from './AlertsClient';
import { Prisma } from '@prisma/client';

async function getAlerts(severity?: string, startDate?: string, endDate?: string) {
  const where: Prisma.AlertWhereInput = {};

  if (severity && severity !== 'ALL') {
    where.severity = severity as Prisma.AlertSeverity;
  }

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) {
      where.timestamp.gte = new Date(startDate);
    }
    if (endDate) {
      where.timestamp.lte = new Date(endDate);
    }
  }

  const alerts = await prisma.alert.findMany({
    where,
    include: {
      campaign: {
        select: {
          id: true,
          name: true,
        },
    },
    },
    orderBy: { timestamp: 'desc' },
  });

  return alerts.map((alert: typeof alerts[0]) => ({
    id: alert.id,
    campaignId: alert.campaignId,
    campaignName: alert.campaign.name,
    metricName: alert.metricName,
    severity: alert.severity,
    expected: alert.expected,
    actual: alert.actual,
    timestamp: alert.timestamp,
    status: alert.status,
  }));
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: { severity?: string; startDate?: string; endDate?: string };
}) {
  const alerts = await getAlerts(
    searchParams.severity,
    searchParams.startDate,
    searchParams.endDate
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="mt-2 text-gray-600">View and manage campaign alerts</p>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <AlertsClient initialAlerts={alerts} />
        </Suspense>
      </div>
    </div>
  );
}

