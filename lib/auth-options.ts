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
          prompt: 'select_account',
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        const isAdmin = isUserAdmin(user.email);
        try {
          const dbUser = await prisma.user.upsert({
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
              role: isAdmin ? 'ADMIN' : 'TEACHER',
            },
          });

          if (!isAdmin) {
            await prisma.teacherProfile.upsert({
              where: { userId: dbUser.id },
              update: {},
              create: {
                userId: dbUser.id,
                city: 'Edirne',
                district: 'Merkez',
                school: 'Edirne Selimiye İmam Hatip Ortaokulu',
                branch: 'Matematik',
                status: 'APPROVED',
              },
            });
          }

          // Record login stats
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              lastLoginAt: new Date(),
              loginCount: { increment: 1 },
              loginLogs: {
                create: {
                  deviceCategory: 'desktop',
                  userAgent: 'Google OAuth',
                },
              },
            },
          });
        } catch (e) {
          console.warn('NextAuth Prisma upsert note:', e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role || (isUserAdmin(session.user.email) ? 'admin' : 'teacher');
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = isUserAdmin(user.email) ? 'admin' : 'teacher';
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
