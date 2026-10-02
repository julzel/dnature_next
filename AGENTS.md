<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# DNAture UI guidance

Before implementing or changing components and views, read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). It documents the current brand expression, implemented tokens, reusable components, responsive patterns, and defaults for new work.

Use the existing source components and preserve the stylesheet order in `src/main.tsx`. Distinguish implemented values from recommendations and conceptual assets. Keep additions scoped to their component, and inspect the result at mobile and desktop sizes.

The user's task and explicit preferences take precedence over this guide. Keep the design guide current when intentionally changing a shared pattern.


<!-- END:nextjs-agent-rules -->
