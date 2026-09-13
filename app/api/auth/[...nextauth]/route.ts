import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextRequest } from 'next/server';

const authHandler = NextAuth(authOptions);

function syncNextAuthUrl(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto =
    req.headers.get('x-forwarded-proto') ||
    req.nextUrl.protocol.replace(':', '') ||
    (req.url.startsWith('https') ? 'https' : 'http');
  if (host) {
    process.env.NEXTAUTH_URL = `${proto}://${host}`;
  }
}

export async function GET(req: NextRequest, ctx: any) {
  syncNextAuthUrl(req);
  return authHandler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  syncNextAuthUrl(req);
  return authHandler(req, ctx);
}
