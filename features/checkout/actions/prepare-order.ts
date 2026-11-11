"use server";

import { prepareOrder } from "../server/prepare-order";
import type { OrderRequest, OrderResult } from "../types/order";

export async function prepareOrderAction(input: OrderRequest): Promise<OrderResult> {
  try { return await prepareOrder(input); }
  catch { return { ok: false, message: "No pudimos verificar el precio y la disponibilidad. Conservamos tus datos y tu carrito; intentá generar el pedido de nuevo." }; }
}
