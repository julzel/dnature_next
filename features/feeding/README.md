# Guided feeding and package estimates

Entry point: the initial guided pet questionnaire continues to
`/mi-dnature/mis-mascotas`. Existing names, species and breeds are reused. The
welcome introduces the saved pets and their breed illustrations. Each dog then
moves through Datos esenciales, Su día a día, and Últimos detalles beside a
sticky profile. Users can switch pets, review/edit the complete profiles, and
then request the daily portion and four independently priced alternatives.
Answers and the current step persist per tab, bound to each pet identity.
Meals per day are optional: a blank answer returns no per-meal breakdown. Cats have a direct review
path without being assigned a dog's formula.

## Source analysis

The storefront calls `@dnature/feeding-engine` for daily portions and the four
packages. The source lives in `dnature_website/src/features/quotations/engine`
and is maintained with the sales application.

- Adult portions use weight, neutering, body condition, activity and a calculator
  size band (up to 4 kg, up to 25 kg, over 25 kg). Percentages are multiplied by
  body weight to obtain grams. Those bands are intentionally distinct from the
  product eligibility bands. Missing table combinations return a review result.
- Practical rounding happens once, before purchasing or splitting the portion.
  The original calculated and practical quantities remain visible.
- Base: complete mixture + eggs. Funcional adds the supplement/probiotic and snack
  kits. Masticación replaces at most 20% of the daily mixture with formula
  complements. Premium combines those additions. These are merchant package
  rules, not a general claim of nutritional completeness for every individual.
- Complete recipes cover at least 80% of the formula. Wild is quoted at 100% and
  cannot silently be used in an option requiring extra formula complements.
- Eligibility uses source-bound species, age, size, ingredient, breed/anatomy,
  withdrawal, uncertainty and risk policies. Dose rules validate source cells;
  changed or missing facts cannot become automatic dose instructions.
- Real presentations, current price and finite inventory determine quantities.
  Rotation uses consecutive days. The source conservation planner checks mixture
  containers over the serving calendar; buying enough grams alone is insufficient.
- Four alternatives are compared before order discounts. Family pooling is not
  applied because these are independent, unselected pet quotes. No combined
  family availability or order total is promised.

## Adaptation and improvements

The npm manifest pins the tarball under `vendor/`. Update the shared source,
pack a new version, put it in `vendor/`, and run `npm install ./vendor/<tarball>`
to refresh the manifest and lockfile. The package includes the nutrition catalog,
corrections and purchasing rules. The container optimizer tests live with the
shared engine.

The server adapter uses **published products and inspected parent SKU
bindings** from this site's catalog. Source rows and exact source names must
match. Prices and inventory always come from this site's current commerce
snapshot and shared `productOptions` policy, never the reference workbook.
Contentful publication controls parent visibility: the live API labels every parent
`inactive` even when it sells active variants. The adapter translates that parent
flag for the engine while retaining child status, positive prices and stock from
the same `productOptions` rules used by checkout. Unknown inventory stays
unavailable. The full internal source and rule evidence
remain server-side; a small result projection contains customer-facing lines.

`POST /api/feeding/quote` validates every input, rejects client prices/overrides,
limits payload size, loads one fresh catalog snapshot, and returns `no-store`.
The existing checkout `orderTotals` supplies whole-colón rounding and 13% IVA.
Delivery remains excluded and labeled. Incomplete packages show a partial subtotal
and their missing requirements, never a complete-package price or purchase CTA.
The results view focuses on one pet at a time, with breed artwork, the daily
portion and profile facts. Four open comparison columns summarize the actual
quoted product roles, the period total and an approximate daily cost. Product
quantities, tax breakdowns, usage notes and pending requirements remain available
through native disclosures. On phones, a compact radio group compares the four
prices and displays one package at a time; larger screens show aligned columns.
Both layouts support keyboard use.
Ready packages offer a WhatsApp enquiry containing that pet's package, quantities,
estimate and tax. Incomplete packages offer a review enquiry explicitly identifying
the partial total and pending requirements. These links only open a customer-controlled
draft; they do not send messages, place an order, charge or add products to the cart.
Catalog failures return a retryable error and preserve input.

The public flow retains conservative individual review for growth, health
conditions, gestation/lactation, known or unknown allergies, and unsupported
portion-table combinations. The authenticated source's adviser override is not
exposed here. The breed policy still excludes unsupported chewing products when
anatomy is unknown. Age, weight, body condition, activity, neutering, health,
allergy status, goal, behavior and anatomy are explicit answers. Meals only split
the displayed estimate; they do not multiply the daily quantity.

In-progress answers stay in session storage. After a successful estimate, each
pet's validated feeding answers, portion or review status, package period, and
dated quote are saved through `lib/saved-feeding-plans.ts`. These records live
in local storage and are linked to the existing pet IDs. Returning visits open
Mis mascotas and read the records without calling the quote API. Package details
show the date of the saved quote and direct the customer to confirm its terms.

The dashboard lets users complete or edit one pet independently. A name or meal
count change can reuse the saved proposal. Changes to feeding inputs request a
new estimate for that pet. A change of species or breed invalidates the saved
proposal. The personalized route inherits the `/mi-dnature` noindex policy.

## Nutrition scope

The retained weight-percentage formula is DNAture's merchant estimate, not a
validated universal calorie prescription. A calorie-based replacement would need
verified energy density for each recipe and a separately approved clinical rule.
The UI identifies the estimate and encourages professional review of the animal's
response. [WSAVA nutrition guidance](https://wsava.org/global-guidelines/global-nutrition-guidelines/)
provides assessment tools and starting points; it does not validate this brand's
specific gram percentages or package compositions.

## Verification

Server tests cover the source's golden portion cases, invalid input, special-case
review, SKU binding, real-price adaptation, stock failure, four packages, preserved
ration, practical rounding and IVA. Browser checks cover guided
handoff, multiple pets, successful live-catalog calculation, error/retry, back and
refresh, cat-only flow, keyboard forms, narrow viewports and noindex behavior.
