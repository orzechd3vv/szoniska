import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        createdAt: true,
        isBlocked: true,
        isRestricted: true,
        reputation: true,
      },
    });

    const [postsCount, approvedPosts, pendingPosts, rejectedPosts] = await Promise.all([
      prisma.post.count({ where: { userId: session.user.id } }),
      prisma.post.count({ where: { userId: session.user.id, status: 'APPROVED' } }),
      prisma.post.count({ where: { userId: session.user.id, status: 'PENDING' } }),
      prisma.post.count({ where: { userId: session.user.id, status: 'REJECTED' } }),
    ]);

    return NextResponse.json({
      postsCount,
      approvedPosts,
      pendingPosts,
      rejectedPosts,
      reputation: user?.reputation || 0,
      createdAt: user?.createdAt,
      isBlocked: user?.isBlocked || false,
      isRestricted: user?.isRestricted || false,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
