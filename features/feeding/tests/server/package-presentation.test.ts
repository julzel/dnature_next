import assert from "node:assert/strict";
import { test } from "node:test";
import { packageContents, packageWhatsAppUrl } from "../../lib/package-presentation";
import { previewPackages, previewQuote } from "../fixtures/quote-preview";

test("package enquiries preserve the selected pet, quantities, tax and incomplete status", () => {
  for (const pack of previewPackages) {
    const url = new URL(packageWhatsAppUrl(pack, previewQuote.pets[0], 28));
    assert.equal(url.hostname, "wa.me");
    assert.equal(url.pathname, "/50671848868");
    const message = url.searchParams.get("text")!;
    assert.ok(message.includes(`paquete ${pack.name}`));
    assert.match(message, /Luna/);
    assert.match(message, /28 días.*600 g al día/);
    assert.match(message, /IVA \(13%\)/);
    assert.match(message, /Envío no incluido/);
    assert.match(message, /no confirma una compra/);
    for (const line of pack.lines) assert.ok(message.includes(`${line.quantity} × ${line.name} · ${line.presentation}`));
    if (!pack.ready) {
      assert.match(message, /Total parcial; paquete incompleto/);
      assert.ok(message.includes(pack.issues[0]));
    } else assert.doesNotMatch(message, /Total parcial/);
  }
});

test("package summary uses only quoted roles and combines individual snack roles", () => {
  const base = previewPackages[0];
  assert.deepEqual(packageContents(base), ["Mezcla completa", "Huevo"]);
  assert.deepEqual(packageContents({ ...base, lines: [] }), []);
  const line = base.lines[0];
  assert.deepEqual(packageContents({ ...base, lines: [{ ...line, role: "Snack · Premio" }, { ...line, role: "Snack · Masticación" }] }), ["Snacks"]);
});
