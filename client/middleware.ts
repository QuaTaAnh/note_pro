import { ROUTES } from '@/lib/routes';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isLoginPage = req.nextUrl.pathname === ROUTES.LOGIN;

    if (req.nextauth.token && isLoginPage) {
      return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [ROUTES.LOGIN],
};