import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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
    },
  });

  // Create 5 campaigns with dummy data
  const campaigns = [
    { name: 'Summer Sale 2024', healthScore: 85 },
    { name: 'Product Launch Campaign', healthScore: 45 },
    { name: 'Brand Awareness Q2', healthScore: 92 },
    { name: 'Retargeting Campaign', healthScore: 38 },
    { name: 'Holiday Promo', healthScore: 78 },
  ];

  for (const campaign of campaigns) {
    let created = await prisma.campaign.findFirst({
      where: { name: campaign.name },
    });

    if (!created) {
      created = await prisma.campaign.create({
        data: {
          name: campaign.name,
          healthScore: campaign.healthScore,
        },
      });
    } else {
      created = await prisma.campaign.update({
        where: { id: created.id },
        data: { healthScore: campaign.healthScore },
      });
    }

    // Create some initial metrics with historical data
    const metrics = ['CTR', 'CPC', 'ROAS', 'Conversions', 'Spend', 'Bounce Rate'];
    const baseValues: Record<string, number> = {
      'CTR': 3.5,
      'CPC': 1.25,
      'ROAS': 4.2,
      'Conversions': 150,
      'Spend': 5000,
      'Bounce Rate': 35,
    };

    // Create historical metrics (last 30 hours)
    for (const metricName of metrics) {
      const baseValue = baseValues[metricName] || 100;
      for (let i = 29; i >= 0; i--) {
        const timestamp = new Date(Date.now() - i * 3600000);
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        const value = baseValue * (1 + variation);
        
        await prisma.metric.create({
          data: {
            campaignId: created.id,
            name: metricName,
            value: value,
            timestamp: timestamp,
            threshold: 2.0,
            sensitivity: 50,
            zScore: (Math.random() - 0.5) * 3, // Random Z-score for demo
          },
        });
      }
    }

    // Create some sample alerts
    if (campaign.healthScore < 50) {
      await prisma.alert.create({
        data: {
          campaignId: created.id,
          metricName: 'CTR',
          severity: 'CRITICAL',
          expected: 3.5,
          actual: 1.2,
          timestamp: new Date(Date.now() - 3600000),
          status: 'ACTIVE',
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

