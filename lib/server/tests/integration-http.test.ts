import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrationError } from "../integration-error";
import { requestIntegrationJson } from "../integration-http";

test("transport keeps authentication in headers, disables caching, and refuses redirects", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: URL, init: RequestInit) => {
    assert.equal(url.search, "");
    assert.equal(new Headers(init.headers).get("api-key"), "secret-test-key");
    assert.equal(new Headers(init.headers).get("Accept"), "application/json");
    assert.equal(init.redirect, "error");
    assert.equal(init.cache, "no-store");
    assert.ok(init.signal instanceof AbortSignal);
    return Response.json({ ok: true });
  });
  assert.deepEqual(await requestIntegrationJson("Avify", new URL("https://api.avify.com/graphql"), { headers: { "api-key": "secret-test-key" } }), { ok: true });
});

test("rate limits retain retry information without exposing the upstream body", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("private upstream details", { status: 429, headers: { "X-Contentful-RateLimit-Reset": "2" } }));
  await assert.rejects(requestIntegrationJson("Contentful", new URL("https://cdn.contentful.com/")), (error: unknown) => {
    assert.ok(error instanceof IntegrationError);
    assert.equal(error.status, 429);
    assert.equal(error.retryAfterSeconds, 2);
    assert.equal(error.retryable, true);
    assert.doesNotMatch(error.message, /private upstream details/);
    return true;
  });
});

test("authentication failures are not treated as retryable or exposed verbatim", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("secret-token", { status: 401 }));
  await assert.rejects(requestIntegrationJson("Avify", new URL("https://api.avify.com/graphql")), (error: unknown) => {
    assert.ok(error instanceof IntegrationError);
    assert.equal(error.status, 401);
    assert.equal(error.retryable, false);
    assert.doesNotMatch(error.message, /secret-token/);
    return true;
  });
});

test("network errors are sanitized and classified", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Authorization: secret-token"); });
  await assert.rejects(requestIntegrationJson("Contentful", new URL("https://cdn.contentful.com/")), (error: unknown) => {
    assert.ok(error instanceof IntegrationError);
    assert.equal(error.code, "NETWORK");
    assert.equal(error.retryable, true);
    assert.doesNotMatch(error.message, /secret-token/);
    assert.equal(error.cause, undefined);
    return true;
  });
});

test("timeouts are bounded and distinguishable from invalid JSON", async (t) => {
  t.mock.method(AbortSignal, "timeout", () => AbortSignal.abort());
  t.mock.method(globalThis, "fetch", async () => { throw new Error("aborted"); });
  await assert.rejects(requestIntegrationJson("Avify", new URL("https://api.avify.com/graphql")), { code: "TIMEOUT", retryable: true });
});

test("malformed successful responses fail explicitly", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("not-json"));
  await assert.rejects(requestIntegrationJson("Contentful", new URL("https://cdn.contentful.com/")), { code: "INVALID_RESPONSE" });
});
