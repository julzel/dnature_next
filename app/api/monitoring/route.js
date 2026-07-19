import { NextResponse } from 'next/server';

import { reportServerError } from '../../../services/monitoring';

const MAX_BODY_BYTES = 2048;

const post = async (request) => {
  const contentLength = Number(request.headers.get('content-length') || 0);

  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  try {
    const event = await request.json();

    if (
      !event ||
      typeof event.name !== 'string' ||
      typeof event.message !== 'string' ||
      typeof event.source !== 'string'
    ) {
      return new NextResponse(null, { status: 400 });
    }

    await reportServerError(new Error(event.message), {
      source: `client:${event.source}`,
      path: event.path,
    });
  } catch (error) {
    await reportServerError(error, { source: 'monitoring-route' });
    return new NextResponse(null, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
};

export { post as POST };
