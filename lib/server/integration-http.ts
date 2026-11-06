import "server-only";
import { IntegrationError, type IntegrationService } from "./integration-error";

export const INTEGRATION_TIMEOUT_MS = 10_000;

export async function requestIntegrationJson(service: IntegrationService, url: URL, init: RequestInit = {}): Promise<unknown> {
  const signal = AbortSignal.timeout(INTEGRATION_TIMEOUT_MS);
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  let response: Response;
  try {
    response = await fetch(url, { ...init, headers, cache: "no-store", redirect: "error", signal });
  } catch {
    // Do not attach raw network errors: they can contain URLs, headers, or credentials.
    throw new IntegrationError(service, signal.aborted ? "TIMEOUT" : "NETWORK", `${service} could not be reached.`);
  }
  if (!response.ok) {
    const reset = response.headers.get("Retry-After") ?? response.headers.get("X-Contentful-RateLimit-Reset");
    const seconds = reset && /^\d+$/.test(reset) ? Number(reset) : undefined;
    throw new IntegrationError(service, "HTTP", `${service} returned HTTP ${response.status}.`, response.status, seconds);
  }
  try {
    return await response.json();
  } catch {
    throw new IntegrationError(service, signal.aborted ? "TIMEOUT" : "INVALID_RESPONSE", `${service} did not return valid JSON.`);
  }
}

export function requiredEnvironment(service: IntegrationService, key: string): string {
  const value = process.env[key]?.trim();
  if (!value) throw new IntegrationError(service, "CONFIGURATION", `${key} must be configured on the server.`);
  return value;
}

export function responseRecord(value: unknown, service: IntegrationService, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalidResponse(service, path);
  return value as Record<string, unknown>;
}

export function responseString(value: unknown, service: IntegrationService, path: string): string {
  if (typeof value !== "string") invalidResponse(service, path);
  return value;
}

export function invalidResponse(service: IntegrationService, path: string): never {
  throw new IntegrationError(service, "INVALID_RESPONSE", `${service} returned an invalid response at ${path}.`);
}

export function integerInRange(value: number, min: number, max: number, name: string): number {
  if (!Number.isInteger(value) || value < min || value > max) throw new RangeError(`${name} must be an integer between ${min} and ${max}.`);
  return value;
}
