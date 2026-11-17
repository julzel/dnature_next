import assert from "node:assert/strict";
import { test } from "node:test";
import { parseVisitPreference } from "../../data/visit-preference";

test("only supported versioned visit choices are restored", () => {
  for (const visit of ["guided", "explore"] as const) assert.equal(parseVisitPreference(JSON.stringify({ version: 1, visit })), visit);
  for (const raw of [null, "", "invalid", "null", '"guided"', '{"version":2,"visit":"guided"}', '{"version":1,"visit":"other"}', "x".repeat(201)]) assert.equal(parseVisitPreference(raw), null);
});
