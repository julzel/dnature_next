export type IntegrationService = "Avify" | "Contentful";
export type IntegrationErrorCode = "CONFIGURATION" | "NETWORK" | "TIMEOUT" | "HTTP" | "INVALID_RESPONSE" | "GRAPHQL";

export class IntegrationError extends Error {
  readonly retryable: boolean;

  constructor(
    readonly service: IntegrationService,
    readonly code: IntegrationErrorCode,
    message: string,
    readonly status?: number,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "IntegrationError";
    this.retryable = code === "NETWORK" || code === "TIMEOUT" || status === 429 || (status !== undefined && status >= 500);
  }
}
