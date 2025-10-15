import { NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from './i18n/request';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, etc.
  const shouldHandle = !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.includes('.');

  if (!shouldHandle) return NextResponse.next();

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Get locale from cookie or Accept-Language header
  const cookieLocale = request.cookies.get('locale')?.value;
  let locale = cookieLocale || defaultLocale;

  if (!cookieLocale) {
    const negotiator = new Negotiator({ headers: { 'accept-language': request.headers.get('accept-language') || '' } });
    const languages = negotiator.languages();
    locale = match(languages, locales, defaultLocale);
  }

  // Redirect to the locale-prefixed URL
  request.nextUrl.pathname = `/${locale}${pathname || '/'}`;
  const response = NextResponse.redirect(request.nextUrl);

  // Set the locale cookie
  response.cookies.set('locale', locale, { path: '/', sameSite: 'strict' });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
