import { NextResponse } from 'next/server';

import { refreshSupabaseSession } from './services/supabase/proxy';

const isProtectedAccountPath = (pathname) =>
  pathname === '/cuenta' ||
  (pathname.startsWith('/cuenta/') &&
    !pathname.startsWith('/cuenta/iniciar-sesion'));

const redirectWithAuthHeaders = (url, sessionResponse) => {
  const redirectResponse = NextResponse.redirect(url);
  const authHeaders = ['cache-control', 'expires', 'pragma'];

  authHeaders.forEach((name) => {
    const value = sessionResponse.headers.get(name);
    if (value) redirectResponse.headers.set(name, value);
  });

  const setCookies = sessionResponse.headers.getSetCookie?.() || [];
  if (setCookies.length) {
    setCookies.forEach((value) => {
      redirectResponse.headers.append('set-cookie', value);
    });
  } else {
    const setCookie = sessionResponse.headers.get('set-cookie');
    if (setCookie) redirectResponse.headers.set('set-cookie', setCookie);
  }

  return redirectResponse;
};

const proxy = async (request) => {
  const { pathname } = request.nextUrl;

  if (
    process.env.NODE_ENV === 'production' &&
    pathname.startsWith('/avify-test')
  ) {
    return new NextResponse(null, { status: 404 });
  }

  const { claims, response } = await refreshSupabaseSession(request);

  if (isProtectedAccountPath(pathname) && !claims?.sub) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/cuenta/iniciar-sesion';
    signInUrl.search = '';
    signInUrl.searchParams.set('siguiente', `${pathname}${request.nextUrl.search}`);
    return redirectWithAuthHeaders(signInUrl, response);
  }

  return response;
};

export const config = {
  matcher: [
    '/cuenta/:path*',
    '/auth/:path*',
    '/checkout/:path*',
    '/avify-test/:path*',
  ],
};

export { proxy };
