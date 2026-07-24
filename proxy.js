import { NextResponse } from 'next/server';

const proxy = () => {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
};

export const config = {
  matcher: '/avify-test/:path*',
};

export { proxy };
