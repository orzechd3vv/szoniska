import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface ShortLinkPageProps {
  params: {
    id: string;
  };
}

export default async function ShortLinkPage({ params }: ShortLinkPageProps) {
  const { id } = params;

  // Reserved paths that shouldn't be treated as post IDs
  // Although Next.js handles static routes first, this is a safety measure
  const reservedPaths = ['profile', 'kontakt', 'regulamin', 'api', 'admin', 'auth'];
  if (reservedPaths.includes(id.toLowerCase())) {
    return redirect('/'); // This shouldn't happen if static routes exist, but just in case
  }

  // Check if it's a valid post ID
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { id: true }
    });

    if (post) {
      redirect(`/posts/${id}`);
    }
  } catch (error) {
    console.error('Error in short link redirect:', error);
  }

  // If no post found, redirect to home or show 404
  redirect('/');
}
