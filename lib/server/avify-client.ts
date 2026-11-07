import "server-only";
import { IntegrationError } from "./integration-error";
import { requestIntegrationJson, requiredEnvironment, responseRecord } from "./integration-http";

export async function queryAvify(query: string, variables: Record<string, unknown> = {}) {
  const endpoint = requiredEnvironment("Avify", "AVIFY_GRAPHQL_URL");
  let url: URL;
  try { url = new URL(endpoint); } catch { throw new IntegrationError("Avify", "CONFIGURATION", "AVIFY_GRAPHQL_URL must be an HTTPS URL."); }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new IntegrationError("Avify", "CONFIGURATION", "AVIFY_GRAPHQL_URL must use HTTPS without credentials, a query, or a fragment.");
  }
  const apiKey = requiredEnvironment("Avify", "AVIFY_API_KEY");
  const body = responseRecord(await requestIntegrationJson("Avify", url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({ query, variables }),
  }), "Avify", "response");
  if (body.errors !== undefined && (!Array.isArray(body.errors) || body.errors.length > 0)) {
    throw new IntegrationError("Avify", "GRAPHQL", "Avify could not complete the request.");
  }
  return responseRecord(body.data, "Avify", "data");
}
