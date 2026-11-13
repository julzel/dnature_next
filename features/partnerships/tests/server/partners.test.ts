import assert from "node:assert/strict";
import { test } from "node:test";
import source from "../../../../docs/partnerships/DNAture_Partnerships_Reference.json";
import data from "../../data/partners.json";
import { directoryEntry, matchesPartner } from "../../lib/directory";
import type { Partner } from "../../types/partner";

const partners = data as Partner[];

test("public profiles use source identities and contacts without private or ambiguous fields", () => {
  assert.equal(partners.length, 10);
  assert.equal(new Set(partners.map((partner) => partner.id)).size, 10);
  for (const partner of partners) {
    const original = source.partners.find((entry) => entry.id === partner.id)!;
    assert.equal(partner.name, original.public_profile.name);
    assert.deepEqual(partner.phones.map((phone) => phone.href), original.public_profile.contacts.phones.map((phone) => phone.tel_url));
    for (const phone of partner.phones) assert.match(phone.href, /^tel:\+506\d{8}$/);
    for (const link of partner.links) {
      assert.ok(Object.values(original.public_profile.contacts).includes(link.href));
      assert.ok(["http:", "https:"].includes(new URL(link.href).protocol));
    }
    assert.equal(partner.modalities.length > 0, true);
    assert.ok(!("benefit" in partner));
    assert.ok(!("review" in partner));
    assert.ok(!("email" in partner));
  }
  assert.equal(partners.flatMap((partner) => partner.links).filter((link) => link.kind === "booking").length, 2);
  assert.ok(!JSON.stringify(data).match(/@gmail|__gcr|pending_confirmation|source_cell|discount_percent|whatsapp_url/));
});

test("duplicates, clinic attribution, non-veterinary services and ambiguous modalities retain their distinctions", () => {
  const alejandro = partners.find((partner) => partner.id === "alejandro-quesada-bolanos")!;
  assert.deepEqual(alejandro.modalities, ["home_visit"]);
  const michelle = partners.find((partner) => partner.id === "michelle-saravia-hernandez")!;
  const esteban = partners.find((partner) => partner.id === "esteban-salmeron-sibaja")!;
  assert.notEqual(michelle.id, esteban.id);
  assert.equal(michelle.phones[0].href, esteban.phones[0].href);
  assert.match(michelle.summary, /^En Fisiovet CR:/);
  assert.equal(partners.find((partner) => partner.id === "nancy-chacon-vega")?.group, "wellbeing");
  assert.equal(partners.find((partner) => partner.id === "ana-laura-gonzalez-arias")?.links.length, 0);
});

test("directory search handles accents, word order, missing location and combined mode filters", () => {
  const entries = partners.map(directoryEntry);
  assert.deepEqual(entries.filter((entry) => matchesPartner(entry, "ECOGRAFIA quesada", "home_visit")).map((entry) => entry.id), ["alejandro-quesada-bolanos"]);
  assert.equal(entries.filter((entry) => matchesPartner(entry, "ecografía", "in_person")).length, 0);
  assert.equal(entries.filter((entry) => matchesPartner(entry, "", "online")).length, 3);
  assert.deepEqual(entries.filter((entry) => matchesPartner(entry, "cartago nutricion", "online")).map((entry) => entry.id), ["karla-tatiana-alvarado-rodriguez"]);
  assert.equal(entries.filter((entry) => matchesPartner(entry, "   ", "all")).length, 10);
  assert.equal(entries.filter((entry) => matchesPartner(entry, "no existe", "all")).length, 0);
});
