import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'default',
          ...body,
        },
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

