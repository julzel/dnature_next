import { loadEnvConfig } from "@next/env";
import { checkAvifyConnection, getAvifyProducts } from "../features/catalog/server/avify";
import { getContentfulContentTypes, getContentfulEntries } from "../features/content/server/contentful";
import { IntegrationError } from "../lib/server/integration-error";

loadEnvConfig(process.cwd());

async function main() {
  const checks = [
    { service: "Avify", run: async () => {
      await checkAvifyConnection();
      const products = await getAvifyProducts({ pageSize: 1 });
      return { connected: true, totalProducts: products.totalCount, inventoryScope: process.env.AVIFY_LOCATION_ID?.trim() ? "configured location" : "global" };
    } },
    { service: "Contentful", run: async () => {
      const models = await getContentfulContentTypes();
      const products = await getContentfulEntries({ contentType: "product", limit: 1 });
      return { connected: true, contentTypes: models.items.map((model) => model.sys.id), publishedProducts: products.total };
    } },
  ];
  const results = await Promise.allSettled(checks.map((check) => check.run()));
  results.forEach((result, index) => {
    if (result.status === "fulfilled") console.log(JSON.stringify({ service: checks[index].service, ...result.value }));
    else {
      const error = result.reason;
      console.error(JSON.stringify({ service: checks[index].service, connected: false, code: error instanceof IntegrationError ? error.code : "UNEXPECTED", message: error instanceof IntegrationError ? error.message : "The connection check failed.", status: error instanceof IntegrationError ? error.status : undefined }));
      process.exitCode = 1;
    }
  });
}

void main();
