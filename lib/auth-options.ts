import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

export const ADMIN_EMAILS = [
  'powerose@gmail.com',
  'maarifakademi.com.tr@gmail.com',
  'viziteci325@gmail.com',
];

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((e) => e.toLowerCase() === trimmed);
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        const isAdmin = isUserAdmin(user.email);
        try {
          await prisma.user.upsert({
            where: { email: user.email.toLowerCase() },
            update: {
              name: user.name || 'Google Kullanıcısı',
              avatar: user.image || undefined,
              ...(isAdmin ? { role: 'ADMIN' } : {}),
            },
            create: {
              email: user.email.toLowerCase(),
              name: user.name || 'Google Kullanıcısı',
              avatar: user.image || undefined,
              role: isAdmin ? 'ADMIN' : 'STUDENT',
            },
          });
        } catch (e) {
          // Non-fatal: local auth store and session will still proceed
          console.warn('NextAuth Prisma upsert note:', e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role || (isUserAdmin(session.user.email) ? 'admin' : 'student');
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = isUserAdmin(user.email) ? 'admin' : 'student';
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'maarif_super_secret_jwt_key_2026',
  debug: process.env.NODE_ENV === 'development',
};
