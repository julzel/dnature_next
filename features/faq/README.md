# Preguntas frecuentes

`data/development-faq.json` preserves the seven categories and 65 questions,
including original answer blocks and links, from the remote `development`
branch. Its tracked commit and Git blob are recorded in the JSON; the blob was
verified against GitHub's current branch content. The local `development` branch
is older and contains the same eleven questions as `canary`. The earlier
`data/canary-faq.json` extraction remains available for comparison. Both files
are historical source material and are not rendered as public copy.

`data/faq.json` is the public, categorized FAQ. Each item records its source
question ID and whether its wording was adapted. The source includes product
claims, storage periods and operational details that require confirmation from
current product labels, veterinary guidance, or business operations. The public
copy avoids unverified claims, points individual nutrition decisions to a
veterinarian, and cites relevant sources for raw-food handling and nutrition.
References to calculator, plan, and checkout features unavailable in this
checkout have been replaced with appropriate alternatives. Update the public
JSON after verifying new information; retain the source extraction for traceability.

The page is statically rendered with all questions in HTML. Search and topic
filters operate on the public JSON in the browser; the topic index and native
disclosures remain usable without JavaScript. Questions can be edited or added
by updating the public JSON and assigning each item to a topic. Add source links
where appropriate. The page uses ordinary metadata and breadcrumbs; it does not
rely on FAQ rich results.
