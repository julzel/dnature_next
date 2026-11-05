<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

Apply these rules to new and modified code. Adding or updating these instructions
does not require an unrelated repository-wide refactor.

## SEO/GEO

- Prioritize SEO (Search Engine Optimization) and GEO (Generative Engine
  Optimization) when building or modifying public pages.
- Make the most strategically important public pages easy to discover from the
  main navigation, footer, and relevant content pages. Use crawlable internal
  links with descriptive anchor text.
- Treat accessibility, clear content structure, and semantic HTML as core
  requirements. Use meaningful page landmarks, a logical heading hierarchy,
  descriptive links, appropriate image alternatives, and native HTML elements
  that match the content and interaction.

## Design

- Use consistent spacing throughout the app. Define a shared spacing scale with
  CSS tokens (`4, 8, 12, 16, 24, 32, 48, 64, 80px`) and reuse it for page gutters,
  containers, sections, headings, forms, and components. Avoid arbitrary one-off
  spacing values for equivalent elements.
- Standardize form rhythm: label-to-control spacing, field gaps, help/error text,
  form sections, and action rows must follow the same patterns across forms.
  Reuse container widths, heading styles, and responsive gutters across pages.
- Build mobile first. Use fluid layouts and content-driven breakpoints to adapt
  from narrow phones to large screens without horizontal overflow. Check touch,
  keyboard, text wrapping, and enlarged text as well as desktop appearance.
- Prefer native HTML controls, browser behaviors, and familiar platform interaction
  patterns. Favor subtle, native-feeling motion; respect `prefers-reduced-motion`.
  Preserve accessible semantics, visible focus, and usable touch targets when styling.
- Use cool or neutral UI colors. Do not use warm tones, including warm whites,
  cream, beige, orange, or yellow UI accents. Prefer cool white and blue-gray
  surfaces. This rule overrides warmer palette proposals in design references.

## Folder structure

- Use vertical slices: organize application code by feature or business capability,
  such as `features/<feature>/`. Keep each feature's components, hooks, actions,
  data access, validation, types, styles, and tests together as needed.
- Keep `app/` focused on Next.js routing, layouts, metadata, and page composition.
  Keep feature-specific behavior inside its feature rather than spreading it
  across global technical-layer folders.
- Move code into shared folders only when it is genuinely shared between features.
  Keep feature ownership and dependencies clear; avoid generic utility dumping grounds.
- Define one React component per file, including unexported subcomponents. Extract
  additional components into their own files. Related types, constants, and
  non-component helpers may remain with their component. Next.js metadata and
  required route exports may coexist with the file's single component.

## Development

- Optimize for the installed Next.js version. Consult the bundled documentation
  before changing framework code, as required by the generated guidance above.
  Prefer framework-native routing, metadata, image optimization, and data-loading
  capabilities over custom replacements.
- Default to Server Components. Keep client boundaries small and add `use client`
  only for interactions or browser APIs. Avoid unnecessary client JavaScript,
  request waterfalls, and eager loading of noncritical assets. Choose caching and
  revalidation deliberately according to data freshness requirements.
- Pass named handler references to JSX event props: use `onClick={handleClick}`.
  Do not use inline arrow functions, inline function expressions, render-time
  handler calls, or `.bind()` in JSX event props. For item-specific arguments,
  extract an item component and define its named handler locally.
- Always give users feedback for asynchronous actions: show a pending/loading
  state, prevent duplicate submissions, and communicate completion or failure.
  Restore controls when the operation settles and preserve user input on errors.
- Handle errors explicitly. Show understandable, actionable feedback; use inline
  field errors, alerts, loading/empty/error states, or error boundaries as appropriate.
  Announce status changes accessibly with `role="status"` or an appropriate live
  region, and urgent errors with `role="alert"`. Never swallow failures silently
  or claim success before an operation actually succeeds.
- Follow DRY (Don't Repeat Yourself): reuse established components, tokens,
  validation, and business rules instead of duplicating them.
- Follow KISS (Keep It Simple): choose the simplest clear solution that meets
  current requirements. Avoid speculative abstractions, premature optimization,
  and unnecessary dependencies. Memoize handlers only when stable identity is needed.
