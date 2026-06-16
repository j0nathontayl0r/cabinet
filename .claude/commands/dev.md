Implement the plan referenced below.

Procedure:
1. Read both `ai-agents-wd/specs/<name>.md` and
   `ai-agents-wd/plans/<name>.md` end-to-end, plus `CLAUDE.md` for repo
   conventions.
2. Implement every task in the plan's task breakdown, working through
   independent tasks in parallel where possible.
3. After each change batch, append an entry to `PROGRESS.md`.

Cabinet key rules to enforce at all times (see `CLAUDE.md` for full list):
- No database — all content lives as files under `data/`.
- shadcn/ui uses base-ui, NOT Radix — no `asChild` on triggers.
- No em-dashes in any user-facing string or copy.
- TypeScript strict — no `any`, no suppressed type errors.
- Path traversal prevention — all resolved paths must start with DATA_DIR.
- App Router conventions — server components by default; `"use client"` only
  where interactivity requires it; API routes under `src/app/api/`.

Plan:

$ARGUMENTS
