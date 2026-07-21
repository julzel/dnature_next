import { NextResponse } from 'next/server';

import { searchSite } from '../../../features/Search/server';
import { reportServerError } from '../../../services/monitoring';

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 60;

const GET = async (request) => {
  const query = new URL(request.url).searchParams.get('q')?.trim() || '';

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [] });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { results: [], error: 'La búsqueda es demasiado larga.' },
      { status: 400 }
    );
  }

  try {
    const results = await searchSite(query);

    return NextResponse.json(
      { results },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    await reportServerError(error, { source: 'site-search' });

    return NextResponse.json(
      {
        results: [],
        error: 'No pudimos completar la búsqueda. Intenta de nuevo.',
      },
      { status: 503 }
    );
  }
};

export { GET };
