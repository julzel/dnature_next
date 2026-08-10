# Phase 0 behavior fixtures

The portion matrix contains all 54 adult combinations exposed by the two dog
portion flows: three sizes, two castration states, three body conditions, and
three activity levels.

The six `overWeight` + `veryActive` combinations are intentionally recorded as
unsupported. The product currently has no approved percentage for them. They
must remain unavailable until a domain owner supplies the rule in Phase 1.

The browser catalogue fixtures are enabled only with
`E2E_USE_FIXTURES=1`. They avoid coupling CI to Contentful credentials or
editorial changes and are never used by the normal production runtime.
The same flag prevents browser tests from contacting the configured hosted
Supabase project; account-aware checkout therefore follows the guest path
unless a dedicated local-auth fixture is added.

`axe-baseline.js` records three pre-existing serious color-contrast findings.
The accessibility suite fails if their route, rule, severity, or node count
grows, and it always blocks any new critical finding. Removing a finding
requires updating the baseline in the same change.
