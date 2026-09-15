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
        const cleanEmail = user.email.trim().toLowerCase();
        const isAdmin = isUserAdmin(cleanEmail);
        const rawName = (user.name || '').trim();
        let firstName = '';
        let lastName = '';
        if (rawName) {
          const parts = rawName.split(/\s+/);
          if (parts.length === 1) {
            firstName = parts[0];
          } else {
            lastName = parts.pop() || '';
            firstName = parts.join(' ');
          }
        }

        try {
          const dbUser = await prisma.user.upsert({
            where: { email: cleanEmail },
            update: {
              name: rawName || 'Google Kullanıcısı',
              ...(firstName ? { firstName } : {}),
              ...(lastName ? { lastName } : {}),
              avatar: user.image || undefined,
              ...(isAdmin ? { role: 'ADMIN' } : {}),
            },
            create: {
              email: cleanEmail,
              name: rawName || 'Google Kullanıcısı',
              firstName: firstName || '',
              lastName: lastName || '',
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
                city: '',
                district: '',
                school: '',
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

          console.log(`[NextAuth signIn] Google user ${cleanEmail} synced to PostgreSQL successfully (DB ID: ${dbUser.id})`);
        } catch (e) {
          console.error('[NextAuth signIn] Error upserting Google user to PostgreSQL:', e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || (isUserAdmin(session.user.email) ? 'admin' : 'teacher');
        (session.user as any).status = token.status || 'approved';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const cleanEmail = user.email.trim().toLowerCase();
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
            include: { teacherProfile: true }
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.sub = dbUser.id;
            token.role = dbUser.role === 'ADMIN' || isUserAdmin(cleanEmail) ? 'admin' : dbUser.role.toLowerCase();
            token.status = dbUser.teacherProfile?.status?.toLowerCase() || 'approved';
          }
        } catch (e) {
          console.error('[NextAuth jwt] Error retrieving DB user:', e);
        }
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
