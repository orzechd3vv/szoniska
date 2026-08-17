import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    
    const maintenance = await prisma.systemMaintenance.findFirst({
      where: {
        type: 'all',
        isActive: true,
        endTime: {
          gte: now,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (maintenance) {
      return NextResponse.json({
        isMaintenance: true,
        reason: maintenance.reason,
        endTime: maintenance.endTime,
      });
    }

    return NextResponse.json({ isMaintenance: false });
  } catch (error) {
    console.error('Error checking global maintenance:', error);
    return NextResponse.json({ isMaintenance: false });
  }
}
