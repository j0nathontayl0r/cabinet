Act as the Architect for the Cabinet knowledge base application.

Read the spec file referenced below end-to-end, plus `CLAUDE.md` for repo
conventions (tech stack, key rules, architecture, commands).

Write a plan to `ai-agents-wd/plans/<same-name>.md` using this structure:

```markdown
# Plan: <Title>

Spec: `ai-agents-wd/specs/<name>.md`

## Approach
## Affected files
<table: Path | Change | Reason>
## Interfaces / contracts
## Data / migration notes
## Risks & mitigations
## Task breakdown
<numbered tasks; each names its files and a "Done when" condition; mark
which tasks are independent vs. must be serialised, and why>
## Verification plan
```

Ground the plan in Cabinet's real layout: `src/app/api/` for API routes,
`src/components/` for UI, `src/stores/` for Zustand state, `src/lib/` for
utilities, `server/` for daemon and PTY, `data/` for file-based content.

Decompose the task breakdown so independent tasks can be implemented in
parallel by separate subagents at `/dev` time.

Verification plan should favour runnable checks: `npm run lint`,
`npx tsc --noEmit`, `npm run build`, and manual review against the 17
Cabinet key rules in `CLAUDE.md`.

Do not write production code. Stop after writing the plan and print the
next command: `/dev ai-agents-wd/plans/<same-name>.md`.

Spec:

$ARGUMENTS
