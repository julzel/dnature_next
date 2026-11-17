# Quiénes somos

The `/nosotros` page uses the current site header/footer and the graphic design
system's flat surfaces, square edges, and spacing tokens. Its shared `PageHero`
uses the Products page's dark-blue surface and white/mint display typography.
Only the mission/vision explorer is a Client Component. The three essence
disclosures use native `details` elements and work without JavaScript.

Content is an editorial adaptation of
`docs/graphic-design/DNAture_Brand_Reference.json`, verified against the Spanish
`DNA-BRANDBOOK.pdf`:

| Page content | Brand evidence |
| --- | --- |
| Introduction and DNA + Nature | `brand_strategy.name`, origin and animal audience; pp. 2–3 |
| Purpose and science/empathy statement | Manifesto, p. 4; purpose, p. 9 |
| Mission and vision | `brand_strategy.mission_summary` and `vision_summary`; pp. 5–6 |
| Ciencia, Conciencia, Manada and their associations | `brand_strategy.emotional_territory`; p. 17, with the current `project_context.community_concept` override |
| Practical expressions of those principles | Sabio/Cuidador, voice and personality; pp. 10–13 |

The three dimensions adapt the brand's documented emotional territory. The
user's 2026-11-16 direction replaces the source term “Tribu” with “Manada” in
current website copy, describing pets, guardians and supporting professionals
as one community. The original PDF wording remains historical evidence in the
brand reference. Mission expresses purpose; vision remains
aspirational. Product efficacy, disease prevention/treatment, FEDIAF conformity,
compostability, staff credentials, and current professional services are not
asserted from unverified brandbook claims. No history, founders, testimonials,
or metrics have been invented. The walking illustration is brand artwork, not
a customer or clinical case.

`data/about-content.ts` holds the section copy. Keep its source distinctions
when updating the page. Visible sections and native links support discovery;
metadata, breadcrumbs, and AboutPage JSON-LD describe the actual page.
