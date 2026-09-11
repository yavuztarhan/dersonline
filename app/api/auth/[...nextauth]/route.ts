import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

const authHandler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: any) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  if (host && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost'))) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return authHandler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  if (host && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost'))) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
  return authHandler(req, ctx);
}

