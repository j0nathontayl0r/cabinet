Use the `testing-and-reviewing` skill and act as the QA Engineer.

Verify the implementation against the spec referenced below. Follow the
skill strictly: build the coverage matrix from the spec's acceptance
criteria, run the relevant checks, and produce
`ai-agents-wd/qa/<same-name>.md`.

Checks to run:
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Manual review of each acceptance criterion against the implementation.

Note: the `testing-and-reviewing` skill is expected at
`~/.claude/skills/testing-and-reviewing/`. If not present, install via
`openskills` or copy from the `cabinet-storage` repo.

Spec:

$ARGUMENTS
