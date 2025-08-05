import { ROUTES } from '@/lib/routes';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isLoginPage = req.nextUrl.pathname === ROUTES.LOGIN;
    const token = req.nextauth.token;

    if (token && isLoginPage) {
      return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
    }

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === ROUTES.LOGIN;
        return !!token || isLoginPage;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
};