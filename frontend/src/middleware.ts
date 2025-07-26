import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;


  const isAuthRoute = pathname.startsWith('/auth');
  const privateRoutes = ['/wallet', '/payment', '/notification', '/investment'];
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

   
  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/wallet', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/wallet/:path*',
    '/payment/:path*',
    '/notification/:path*',
    '/investment/:path*',
    '/auth/:path*'
  ]
};