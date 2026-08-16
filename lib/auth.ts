import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from './adminAuth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email i hasło są wymagane');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Nieprawidłowy email lub hasło');
        }

        // Pozwalamy na logowanie nawet bez weryfikacji (od razu po rejestracji)
        // Weryfikacja będzie wymagana do niektórych akcji w przyszłości

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Nieprawidłowy email lub hasło');
        }

        if (user.isBlocked) {
          throw new Error('Twoje konto zostało zablokowane');
        }

        // Sprawdź czy użytkownik ma włączoną 2FA
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.twoFactorCode) {
            throw new Error('2FA_REQUIRED'); // Specjalny błąd dla frontendu
          }

          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: credentials.twoFactorCode.toString().trim(),
            window: 2,
          });

          if (!verified) {
            throw new Error('Nieprawidłowy kod 2FA');
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;

      try {
        if (account.provider === 'google') {
          const googleId = account.providerAccountId;
          const googleProfile = profile as any;
          const email = googleProfile.email;

          // 1. Szukaj po Google ID
          let dbUser = await prisma.user.findFirst({
            where: { googleId },
          });

          // 2. Jeśli nie ma po Google ID, szukaj po Emailu
          if (!dbUser && email) {
            dbUser = await prisma.user.findUnique({
              where: { email },
            });
            
            if (dbUser) {
              // Przypisz Google ID do istniejącego konta
              dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: { googleId },
              });
            }
          }

          if (dbUser) {
            if (dbUser.isBlocked) return false;
            
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                name: googleProfile.name,
                image: googleProfile.picture,
              },
            });
          } else {
            dbUser = await prisma.user.create({
              data: {
                googleId,
                name: googleProfile.name,
                email: googleProfile.email,
                image: googleProfile.picture,
              },
            });
          }

          user.id = dbUser.id;
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        const user = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (user) {
          session.user.isAdmin = isUserAdmin(user);
          session.user.name = user.name;
          session.user.email = user.email || '';
          session.user.image = user.image;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes('callbackUrl=%2Fauth%2Fcallback') || url.includes('callbackUrl=/auth/callback')) {
        return `${baseUrl}/auth/callback`;
      }
      if (url.includes('callbackUrl=')) {
        const urlObj = new URL(url, baseUrl);
        const callbackUrl = urlObj.searchParams.get('callbackUrl');
        if (callbackUrl) {
          return `${baseUrl}${callbackUrl}`;
        }
      }
      if (url.startsWith('/auth/callback')) {
        return `${baseUrl}/auth/callback`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/auth/callback`;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
};

