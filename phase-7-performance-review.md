# Phase 7 performance review — 2026-07-18

## Scope

This is the first continuous-optimization review. It compares the checked-in
local-fixture baseline (`performance-baseline.json`, revision `212902d`) to the
current branch capture (revision `16037c3`) using desktop Chrome and iPhone 13
emulation across every protected route.

The review command is now repeatable:

```sh
npm run review:performance
```

It writes ignored, per-run `performance-current.json` and
`performance-review.md` artifacts. CI uploads both artifacts for every quality
run. Do not replace the checked-in baseline without an owner-reviewed,
like-for-like comparison.

## Result

The current fixture review reported four directional budget warnings:

| Profile | Route | Signal | Baseline | Current | Review limit |
| --- | --- | --- | ---: | ---: | ---: |
| Desktop | `/` | CLS | 0.0029 | 0.2707 | 0.0229 |
| Desktop | `/` | Lab LCP | 64 ms | 356 ms | 164 ms |
| Mobile | `/productos/` | Lab LCP | 116 ms | 680 ms | 216 ms |
| Mobile | `/productos/receta-de-prueba/` | Lab LCP | 84 ms | 464 ms | 184 ms |

JavaScript transfer decreased on every protected route (for example, desktop
home fell from 1,099 KiB to 635 KiB). Image transfer and request counts remained
within the review budgets.

## Decision and follow-up

These values are intentionally **not** an automatic release failure. The local
baseline and current capture are individual lab runs; the unusually low original
LCP values and the one desktop-home CLS reading need confirmation before treating
them as a regression. The project owner must run three like-for-like preview
captures, retain the generated reports with the deployment, and investigate any
median warning with browser performance tooling before changing the baseline or
enforcing a budget.

INP is captured when an interaction timing entry exists. It is null for this
initial navigation-only review, so interaction tests or field data remain
required for INP sign-off.
