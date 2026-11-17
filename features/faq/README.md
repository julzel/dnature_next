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

## Help-center experience (2026-11-17)

The shared interior hero retains its height, heading and breadcrumb alignment;
its decorative dog-and-cat artwork reuses an approved engraving. Four editorial
shortcuts lead directly to existing answers (they are not popularity claims).
A pictographic topic index is sticky on desktop; on mobile it becomes a sticky,
native disclosure that closes after a selection. There are no content cards.

Live search covers questions, answers, lists, search terms and topic descriptions.
It ignores accents and case, accepts multiple terms, and recognizes common query
forms such as “envíos” and “porciones”. Typing searches all topics, so a previous
filter cannot silently hide an answer. Discovery shortcuts give way to results
while searching. Empty results have both a reset and a WhatsApp contact path.

Topic and question anchors restore the appropriate topic on arrival and with
Back/Forward. A question link also opens its answer and moves keyboard focus to
its summary. Each answer can copy a bookmarkable link; when clipboard access is
blocked (including some HTTP/local browsers), a labeled, selectable URL is shown.
Native disclosures allow more than one answer to remain open, animate when
supported, and respect reduced motion. All 65 answers and source links remain in
the server-rendered HTML and readable without JavaScript. Search and clipboard
controls are hidden in that fallback. Public nutritional and business answers
remain in `data/faq.json`; this redesign does not introduce new health claims.
