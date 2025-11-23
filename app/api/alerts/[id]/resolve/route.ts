import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alert = await prisma.alert.update({
      where: { id: params.id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve alert' }, { status: 500 });
  }
}

