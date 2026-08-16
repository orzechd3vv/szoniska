import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Centralized logic to check if a user object/data represents an admin.
 */
export function isUserAdmin(userData: { email?: string | null }) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

  return userData.email ? adminEmails.includes(userData.email) : false;
}

export async function checkAdminPermissions() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { isAdmin: false, error: 'Brak autoryzacji', status: 401, user: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { isAdmin: false, error: 'Użytkownik nie znaleziony', status: 404, user: null };
  }

  const isAdmin = isUserAdmin(user);

  if (!isAdmin) {
    return { isAdmin: false, error: 'Brak uprawnień', status: 403, user };
  }

  return { isAdmin: true, error: null, status: 200, user };
}

