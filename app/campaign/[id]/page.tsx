import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import MetricChart from '@/components/MetricChart';
import SuggestionBox from '@/components/SuggestionBox';
import AlertCard from '@/components/AlertCard';
import { prisma } from '@/lib/prisma';
import CampaignActions from './CampaignActions';

async function getCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      metrics: {
        orderBy: { timestamp: 'desc' },
        take: 30,
      },
      alerts: {
        where: { status: 'ACTIVE' },
        orderBy: { timestamp: 'desc' },
      },
    },
  });

  return campaign;
}

function generateTimeSeriesData(metricName: string, baseValue: number, count: number = 30) {
  const data = [];
  const anomalies: { timestamp: string; value: number }[] = [];
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000).toISOString();
    const variation = (Math.random() - 0.5) * 0.3;
    const value = baseValue * (1 + variation);
    data.push({ timestamp, value });

    // Randomly add anomalies
    if (Math.random() < 0.1) {
      const anomalyValue = baseValue * (1 + (Math.random() > 0.5 ? -0.4 : 0.4));
      anomalies.push({ timestamp, value: anomalyValue });
    }
  }

  return { data, anomalies };
}

function getAISuggestions(campaign: any) {
  const suggestions: string[] = [];
  const activeAlerts = campaign.alerts || [];

  if (activeAlerts.some((a: any) => a.metricName === 'CTR' && a.severity === 'CRITICAL')) {
    if (activeAlerts.some((a: any) => a.metricName === 'Bounce Rate' && a.severity === 'WARNING')) {
      suggestions.push('CTR ↓ + Bounce Rate ↑ = Potential Landing Page issue. Review page load speed and relevance.');
    } else {
      suggestions.push('CTR is significantly below expected. Consider A/B testing ad creatives and headlines.');
    }
  }

  if (activeAlerts.some((a: any) => a.metricName === 'CPC' && a.severity === 'CRITICAL')) {
    suggestions.push('CPC spike detected. Review keyword bids and competition levels.');
  }

  if (activeAlerts.some((a: any) => a.metricName === 'ROAS' && a.severity === 'CRITICAL')) {
    suggestions.push('ROAS decline detected. Optimize targeting and ad relevance to improve conversion quality.');
  }

  if (activeAlerts.some((a: any) => a.metricName === 'Spend' && a.severity === 'WARNING')) {
    suggestions.push('Spend anomaly detected. Check budget pacing and daily limits.');
  }

  if (campaign.healthScore < 50) {
    suggestions.push('Campaign health is critical. Review all metrics and consider pausing underperforming segments.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Campaign performance is within normal parameters. Continue monitoring key metrics.');
  }

  return suggestions;
}

export default async function CampaignPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaign(params.id);

  if (!campaign) {
    notFound();
  }

  const metrics = ['CTR', 'CPC', 'ROAS', 'Conversions', 'Spend', 'Bounce Rate'];
  const baseValues: Record<string, number> = {
    'CTR': 3.5,
    'CPC': 1.25,
    'ROAS': 4.2,
    'Conversions': 150,
    'Spend': 5000,
    'Bounce Rate': 35,
  };

  const chartData: Record<string, { data: any[]; anomalies: any[] }> = {};
  metrics.forEach((metric) => {
    const latestMetric = campaign.metrics.find((m: typeof campaign.metrics[0]) => m.name === metric);
    const baseValue = latestMetric?.value || baseValues[metric] || 100;
    chartData[metric] = generateTimeSeriesData(metric, baseValue);
  });

  const suggestions = getAISuggestions(campaign);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="mt-2 text-gray-600">Health Score: {campaign.healthScore}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
              {campaign.alerts.length > 0 ? (
                <div className="space-y-4">
                  {campaign.alerts.map((alert: typeof campaign.alerts[0]) => (
                    <AlertCard
                      key={alert.id}
                      alert={{
                        id: alert.id,
                        campaignId: alert.campaignId,
                        metricName: alert.metricName,
                        severity: alert.severity as any,
                        expected: alert.expected,
                        actual: alert.actual,
                        timestamp: alert.timestamp,
                        status: alert.status as any,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No active alerts</p>
              )}
            </div>
          </div>
          <div>
            <SuggestionBox suggestions={suggestions} />
            <div className="mt-6">
              <CampaignActions campaignId={campaign.id} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <div key={metric} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">{metric}</h3>
              <MetricChart
                data={chartData[metric].data}
                anomalies={chartData[metric].anomalies}
                label={metric}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

