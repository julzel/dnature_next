import { getProductPrices } from '../../../services/product-prices';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json(await getProductPrices(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      { error: 'No se pudieron cargar los precios actuales. Intenta de nuevo.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
