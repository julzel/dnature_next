# Profesionales aliados

Public route: `/alianzas`. Sources: `docs/alianzas dnature.xlsx`, sheet
`Respuestas de formulario 1`, rows 2–12; the detailed extraction lives in
`docs/partnerships/DNAture_Partnerships_Reference.json`.

The user authorized implementation using the supplied, sufficient, unambiguous
fields. `data/partners.json` is a deliberately curated public projection. The app
never imports the workbook or internal extraction. All 10 distinct profiles have
names, stated services and a professional contact. Public copy describes those
services; it does not assert credentials, accreditation, signed agreements,
clinical outcomes, availability or verified live ownership of contact channels.

## Content selection

- Alejandro Quesada's two responses become one profile. The full name and social
  link come from row 4; the telephone comes from row 8. Only home visits appear,
  since both responses support that modality and physical-office details conflict.
- Michelle Saravia and Esteban Salmerón remain separate, with their shared
  Fisiovet CR contact. Michelle's description explicitly attributes the broad
  service list to the clinic rather than personal specialist qualifications.
- Nancy Chacon is clearly labeled non-veterinary wellbeing. The public service
  summary focuses on grooming and pet bakery, without implying clinical nutrition.
- Sebastian Peña's clear name, services and contact are included. The missing form
  timestamp/email do not become customer-facing information or inferred facts.
- The only locations shown are Dulce Nombre, Cartago; Alajuela, Alajuela; and
  Escazú centro, San José. These are broad source locations, not street addresses.
- Explicit phones become Costa Rican `tel:` links. None is assumed to be WhatsApp.
- The two dedicated calendars link out to Calendly and Confirmafy. Gabriela's
  generic website is not presented as a calendar. Social tracking parameters are
  removed; Karla's unambiguous handle is normalized into an Instagram URL.
- Ana Laura's questionable Instagram handle is omitted. Her contact note about
  scheduling through Sara is retained.
- All discounts, gifts, benefit conditions, form emails, submission timestamps,
  private review notes, unknown coverage, maps, portraits and logos are omitted.
  No missing field is replaced with a fabricated detail.

Contacts come from the workbook and are not claimed to have been independently
verified live. External services load only when a visitor follows a contact link.
No messages, appointments, payments or forms are submitted by the app.

## Rendering and discovery

The route is static and profiles/contact links are Server Components passed as
children to a small client directory. The browser receives only a public search
index and consultation modes. Search is accent-insensitive and matches all query
words across names, services, organizations and available locations. Mode filters
combine with search. Filtered rows stay hidden with native `hidden` semantics.

Without JavaScript, all profiles and contact links remain readable and crawlable;
search/filter controls remain disabled with a short explanation. Native headings,
landmarks, focus styles, status announcements, 48px actions, mobile layouts and
reduced motion follow AGENTS.md and the design system.

Navigation, footer, Nosotros and global page search link here. The public-page
registry supplies the sitemap entry. Metadata and breadcrumb/CollectionPage
schema use the visible directory; ItemList entries link to real profile anchors.
No medical, review, credential or offer schema is fabricated.
