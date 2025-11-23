import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simulate real-time anomaly detection
export async function GET() {
  try {
    // Check if database tables exist, if not return placeholder response
    try {
      await prisma.$queryRaw`SELECT 1 FROM Campaign LIMIT 1`;
    } catch (error: any) {
      if (error.code === 'P2021') {
        // Table doesn't exist yet, return placeholder response
        return NextResponse.json({
          alerts: [
            {
              id: 'placeholder-1',
              campaignId: '2',
              metricName: 'CTR',
              severity: 'CRITICAL',
              expected: 3.5,
              actual: 1.2,
              timestamp: new Date(),
              status: 'ACTIVE',
            },
          ],
          timestamp: new Date(),
          message: 'Using placeholder data - database not initialized',
        });
      }
      throw error;
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        metrics: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    const newAlerts = [];

    for (const campaign of campaigns) {
      for (const metric of campaign.metrics) {
        // Simulate Z-score calculation
        const zScore = (Math.random() - 0.5) * 4; // Random Z-score between -2 and 2

        // Determine if anomaly based on Z-score and threshold
        const threshold = metric.threshold || 2.0;
        const isAnomaly = Math.abs(zScore) > threshold;

        if (isAnomaly) {
          // Determine severity based on Z-score magnitude
          let severity: 'CRITICAL' | 'WARNING' | 'INFO' = 'INFO';
          if (Math.abs(zScore) > 3.0) {
            severity = 'CRITICAL';
          } else if (Math.abs(zScore) > 2.5) {
            severity = 'WARNING';
          }

          // Calculate expected vs actual
          const expected = metric.value;
          const deviation = (zScore / 3) * 0.3; // 30% max deviation
          const actual = expected * (1 + deviation);

          // Check if alert already exists
          const existingAlert = await prisma.alert.findFirst({
            where: {
              campaignId: campaign.id,
              metricName: metric.name,
              status: 'ACTIVE',
              timestamp: {
                gte: new Date(Date.now() - 3600000), // Last hour
              },
            },
          });

          if (!existingAlert) {
            const alert = await prisma.alert.create({
              data: {
                campaignId: campaign.id,
                metricName: metric.name,
                severity,
                expected,
                actual,
                timestamp: new Date(),
              },
            });
            newAlerts.push(alert);

            // Update campaign health score
            const activeAlerts = await prisma.alert.count({
              where: {
                campaignId: campaign.id,
                status: 'ACTIVE',
              },
            });

            const criticalAlerts = await prisma.alert.count({
              where: {
                campaignId: campaign.id,
                status: 'ACTIVE',
                severity: 'CRITICAL',
              },
            });

            const healthScore = Math.max(
              0,
              Math.min(100, 100 - activeAlerts * 10 - criticalAlerts * 20)
            );

            await prisma.campaign.update({
              where: { id: campaign.id },
              data: { healthScore },
            });
          }
        }
      }
    }

    return NextResponse.json({ alerts: newAlerts, timestamp: new Date() });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return NextResponse.json({ error: 'Failed to detect anomalies' }, { status: 500 });
  }
}

