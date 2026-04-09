import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, searchParams } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isCreatorPage = pathname.startsWith('/creator');
  const isVoterPage = pathname.startsWith('/voter');

  // Handle unauthenticated users trying to access protected routes
  if (!token && (isCreatorPage || isVoterPage)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle authenticated users routing based on role
  if (token) {
    if (isAuthPage) {
      if (token.role === 'creator') return NextResponse.redirect(new URL('/creator/dashboard', request.url));
      if (token.role === 'voter') return NextResponse.redirect(new URL('/voter/dashboard', request.url));
    }

    if (isCreatorPage && token.role !== 'creator') {
      return NextResponse.redirect(new URL('/voter/dashboard', request.url));
    }

    if (isVoterPage && token.role !== 'voter') {
      return NextResponse.redirect(new URL('/creator/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/creator/:path*', '/voter/:path*', '/login', '/signup'],
};
