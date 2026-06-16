# CLAUDE.md — Cabinet (j0nathontayl0r fork)

Cabinet is an AI-first self-hosted knowledge base and startup OS where all content lives as markdown files on disk and AI agents collaborate within that workspace.

> Full detail on every section below lives in `docs/CLAUDE.md`. This file is the fast-load convention index for agents.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript |
| UI | Tailwind CSS + shadcn/ui — base-ui based, NOT Radix. No `asChild` prop. |
| Editor | Tiptap (ProseMirror) with markdown roundtrip via HTML intermediate |
| State | Zustand: tree-store, editor-store, ai-panel-store, task-store, app-store |
| Fonts | Inter (sans), JetBrains Mono (code) |
| Icons | Lucide — no emoji in system chrome |
| Markdown | gray-matter (frontmatter), unified/remark (MD→HTML), turndown (HTML→MD) |
| AI providers | Claude Code, Codex CLI, Cursor CLI, OpenCode, Copilot CLI, Grok CLI, Pi, generic CLI adapter |

## Architecture

```
src/
  app/api/tree/              → GET tree structure from /data
  app/api/pages/[...path]/   → GET/PUT/POST/DELETE/PATCH pages
  app/api/assets/[...path]/  → GET/PUT static file serving + raw file writes
  app/api/search/            → GET full-text search
  app/api/agents/            → conversations, providers, tasks, scheduler, skills
  app/api/git/               → git log, diff, commit endpoints
  stores/                    → Zustand stores
  components/sidebar/        → tree navigation, drag-and-drop, context menu
  components/editor/         → Tiptap WYSIWYG + toolbar, viewers
  components/ai-panel/       → right-side AI chat panel
  components/tasks/          → task board + detail panel
  components/agents/         → agents workspace + conversation views
  components/jobs/           → jobs manager UI
  components/terminal/       → xterm.js web terminal
  components/composer/       → shared composer + runtime picker (@page, @agent, @skill)
  components/skills/         → skill library UI
  lib/storage/               → filesystem ops (path-utils, page-io, tree-builder)
  lib/markdown/              → MD↔HTML conversion
  lib/git/                   → git service (auto-commit, history, diff)
  lib/agents/                → adapter runtime, conversation runner, personas, providers
  lib/agents/skills/         → skill loader, trust gating, sync, discovery
  lib/jobs/                  → job scheduler (node-cron)
server/
  cabinet-daemon.ts          → unified daemon: adapters, PTY, scheduler, event bus
  pty/                       → PTY session module
data/                        → content directory (KB pages, tasks, jobs)
```

## Key Rules

1. **No database** — everything is files on disk under `/data`
2. **Pages** are directories with `index.md` + assets, or standalone `.md` files. PDFs and CSVs are first-class content types.
3. **Frontmatter** (YAML) stores metadata: title, created, modified, tags, icon, order
4. **Path traversal prevention** — all resolved paths must start with DATA_DIR
5. **shadcn/ui uses base-ui** (not Radix) — DialogTrigger, ContextMenuTrigger etc. do NOT have `asChild`
6. **Dark mode default** — theme toggle available, use `next-themes` with `attribute="class"`
7. **Auto-save** — debounced 500ms after last keystroke in editor-store
8. **AI runs use a mixed runtime model** — tasks/jobs/heartbeats default to structured adapters; terminal mode (PTY) runs in the same daemon via `server/pty/`
9. **Terminal is a first-class runtime** — not deprecated. User-selectable per task via the Native / Terminal toggle in the composer.
10. **Version restore** — users can restore any page to a previous git commit via the Version History panel
11. **Embedded apps** — dirs with `index.html` + no `index.md` render as iframes. Add `.app` marker for full-screen mode.
12. **Linked repos** — `.repo.yaml` in a data dir links it to a Git repo (local path + remote URL) for agent context
13. **Office documents** — `.docx`, `.xlsx`/`.xlsm`, `.pptx` render inline via dynamically-imported client viewers (read-only)
14. **Google Workspace pages** — markdown page with `google:` frontmatter key renders via `GoogleDocViewer` instead of Tiptap
15. **Skills** — Anthropic-format bundles (`SKILL.md`). Precedence: cabinet-scoped > cabinet-root > linked-repo > system (`~/.claude/skills/`) > legacy-home
16. **Registry templates** — carousel and registry browser read from `https://raw.githubusercontent.com/hilash/cabinets/HEAD/manifest.json`. Do NOT hand-edit `registry-manifest.ts`.
17. **No em-dashes in user-facing copy** — no `—` in UI strings, onboarding, or in-app docs. Use a period, comma, or parentheses. Em-dashes in code comments and internal docs are fine.

## Commands

```bash
npm run dev          # Next.js dev server (localhost:4000)
npm run dev:daemon   # Unified daemon (localhost:4100) — PTY + adapters + scheduler
npm run dev:all      # Both servers
npm run build        # Production build
npm run lint         # ESLint
npm run skills:sync  # Verify skills-lock.json against on-disk bundles
npx tsc --noEmit     # Type-check without emitting
```

After every change, append an entry to `PROGRESS.md`:
```
[YYYY-MM-DD] Brief description of what changed.
```

## Fork-specific context (j0nathontayl0r/cabinet)

This fork extends the upstream hilash/cabinet with a container-based runtime for Kubernetes deployment:

- **Dockerfile** — at repo root. Multi-stage build that produces a single image containing both the Next.js app and the daemon, with Claude Code and Codex CLIs bundled. In Kubernetes the Deployment uses two containers from the same image, each overriding `command:` to run one process.
- **GHCR publish** — `.github/workflows/docker-publish.yml` builds and pushes to `ghcr.io/j0nathontayl0r/cabinet` on merge to main.
- **K8s deployment** — managed via the portainer GitOps repo (`k8s/cabinet/`). The app runs on the `role=infra` node at 192.168.1.117, exposed at `https://cabinet.jonny.blue`.
- **Persistent volume** — Claude and Codex auth is persisted via a PVC mounted into the container so credentials survive pod restarts.

## Development agent workflow

| Command | Role | Output |
|---|---|---|
| `/po <goal>` | Product Owner | `ai-agents-wd/specs/<name>.md` |
| `/architect <spec>` | Architect | `ai-agents-wd/plans/<name>.md` |
| `/dev <plan>` | Developer | Production code |
| `/qa <spec>` | QA Engineer | `ai-agents-wd/qa/<name>.md` |

See `docs/CLAUDE.md` for full detail on AI editing behaviour, cabinetai CLI invariants, frontend debugging, and skills system internals.
