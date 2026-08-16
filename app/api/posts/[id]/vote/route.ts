import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await req.json(); // UPVOTE or DOWNVOTE
    const { id: postId } = params;
    const userId = session.user.id;

    // 1. Get the post to find the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const authorId = post.userId;

    // 2. Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    let reputationChange = 0;

    if (existingVote) {
      if (existingVote.type === type) {
        // Toggle off: Remove vote
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        reputationChange = type === 'UPVOTE' ? -1 : 1;
      } else {
        // Change vote: Update type
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
        // If changed from DOWN to UP: +2 reputation
        // If changed from UP to DOWN: -2 reputation
        reputationChange = type === 'UPVOTE' ? 2 : -2;
      }
    } else {
      // New vote
      await prisma.vote.create({
        data: {
          type,
          userId,
          postId,
        },
      });
      reputationChange = type === 'UPVOTE' ? 1 : -1;
    }

    // 3. Update author's reputation
    if (reputationChange !== 0) {
      await prisma.user.update({
        where: { id: authorId },
        data: {
          reputation: {
            increment: reputationChange,
          },
        },
      });
    }

    // 4. Return new counts
    const upvotes = await prisma.vote.count({
      where: { postId, type: 'UPVOTE' },
    });
    const downvotes = await prisma.vote.count({
      where: { postId, type: 'DOWNVOTE' },
    });

    return NextResponse.json({
      upvotes,
      downvotes,
      userVote: existingVote?.type === type ? null : type,
    });
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
