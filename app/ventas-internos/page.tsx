import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { SalesDashboard } from "@/features/sales/components/sales-dashboard";
import { getAvifySalesDataset } from "@/features/sales/server/avify-orders";

export const metadata: Metadata = {
  title: "Ventas internas | DNAture",
  robots: { index: false, follow: false },
};

export default async function InternalSalesPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await connection();
  const dataset = await getAvifySalesDataset();
  return <SalesDashboard dataset={dataset} />;
}
