import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './app/i18n/config';
import { verifyJWT } from './lib/auth/jwt';

const PUBLIC_PATHS = [
  /^\/_next\//,
  /\/api\/promo\/validate/,
  /\/favicon\.ico$/,
  /\.(jpg|jpeg|png|gif|svg|css|js)$/,
  /^\/(en|lv|ru)\/auth/,
  /^\/(en|lv|ru)\/unauthorized/,
];

const ADMIN_PATHS = /^\/(en|lv|ru)\/admin/;
const HOME_PATH = /^\/(en|lv|ru)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izlaist middleware API maršrutiem
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Izlaist middleware publiskajiem ceļiem
  if (PUBLIC_PATHS.some(pattern => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Apstrādāt lokalizācijas maršrutēšanu
  const pathnameHasLocale = locales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!pathnameHasLocale) {
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}${pathname === '/' ? '' : pathname}`,
        request.url
      )
    );
  }

  // Iegūt lokāli no ceļa
  const locale = pathname.split('/')[1];

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Izlaist publiskos failus un API maršrutus
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Atbilst visiem ceļiem, izņemot statiskos failus un API maršrutus
    '/((?!api/promo/validate|_next/static|_next/image|favicon.ico).*)',
  ],
};
