import { quoteRequestSchema } from "@/features/feeding/lib/intake";
import { createFeedingQuote } from "@/features/feeding/server/quote";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ message: "Enviá los datos del formulario en formato JSON." }, { status: 415, headers });
  if (Number(request.headers.get("content-length")) > 32_000) return Response.json({ message: "Hay demasiados datos en esta solicitud." }, { status: 413, headers });
  let value: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 32_000) return Response.json({ message: "Hay demasiados datos en esta solicitud." }, { status: 413, headers });
    value = JSON.parse(raw);
  } catch { return Response.json({ message: "No pudimos leer los datos. Revisá el formulario." }, { status: 400, headers }); }
  const parsed = quoteRequestSchema.safeParse(value);
  if (!parsed.success) return Response.json({ message: "Revisá la edad, el peso y las respuestas de cada mascota antes de continuar." }, { status: 400, headers });
  try { return Response.json(await createFeedingQuote(parsed.data), { headers }); }
  catch { return Response.json({ message: "No pudimos consultar precios y disponibilidad. Tus respuestas siguen aquí; intentá de nuevo." }, { status: 503, headers }); }
}
