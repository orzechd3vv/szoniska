import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const filter = searchParams.get('filter') || 'latest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 6;
    const skip = (page - 1) * limit;
    
    // Sprawdź czy użytkownik jest zablokowany
    if (session?.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isBlocked: true },
      });
      
      if (user?.isBlocked) {
        return NextResponse.json(
          { error: 'Twoje konto jest zablokowane. Nie możesz przeglądać postów.' },
          { status: 403 }
        );
      }
    }

    // Budowanie warunku wyszukiwania
    const whereCondition: any = {
      status: 'APPROVED',
    };

    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: any[] = [{ isPinned: 'desc' }];

    if (filter === 'popular') {
      orderBy.push({
        comments: {
          _count: 'desc'
        }
      });
    } else {
      orderBy.push({ createdAt: 'desc' });
    }

    const totalPosts = await prisma.post.count({ where: whereCondition });
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    const posts = await prisma.post.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        votes: session?.user ? {
          where: { userId: session.user.id },
          select: { type: true }
        } : false,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: orderBy,
      skip,
      take: limit,
    });

    // Bulk fetch vote counts in 1 single query for blazing fast performance
    const postIds = posts.map(p => p.id);
    const voteAggregations = postIds.length > 0 ? await prisma.vote.groupBy({
      by: ['postId', 'type'],
      where: { postId: { in: postIds } },
      _count: { type: true }
    }) : [];

    const postsWithVotes = posts.map((post) => {
      const postVotes = voteAggregations.filter(v => v.postId === post.id);
      const upvotes = postVotes.find(v => v.type === 'UPVOTE')?._count.type || 0;
      const downvotes = postVotes.find(v => v.type === 'DOWNVOTE')?._count.type || 0;
      const userVote = (post as any).votes?.[0]?.type || null;
      
      return {
        ...post,
        upvotes,
        downvotes,
        userVote,
        votes: undefined // Remove raw votes from response
      };
    });

    return NextResponse.json({
      posts: postsWithVotes,
      totalPages,
      currentPage: page,
      totalPosts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('>>> API POSTS: Request received');
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('Post creation failed: Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`Starting post creation for user: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isBlocked: true, isRestricted: true },
    });

    if (!user) {
      console.log(`Post creation failed: User ${userId} not found in database`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isBlocked) {
      console.log(`Post creation failed: User ${userId} is blocked`);
      return NextResponse.json(
        { error: 'Twoje konto jest zablokowane. Nie możesz tworzyć postów.' },
        { status: 403 }
      );
    }

    if (user.isRestricted) {
      console.log(`Post creation failed: User ${userId} is restricted`);
      return NextResponse.json(
        { error: 'Twoje konto ma ograniczenia. Nie możesz tworzyć postów.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, images, videos, facebookUrl, instagramUrl, tiktokUrl, isAnonymous } = body;

    console.log('Creating post with data:', {
      title,
      imagesCount: images?.length || 0,
      videosCount: videos?.length || 0,
      isAnonymous
    });

    const post = await prisma.post.create({
      data: {
        title,
        description,
        images: images || [],
        videos: videos || [],
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        isAnonymous: isAnonymous || false,
        userId: userId,
        status: 'PENDING',
      },
    });

    console.log(`Post created successfully: ${post.id}`);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      error: 'Failed to create post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
