# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When building AI chat features - breaking changes from v4. | ai-sdk-5 | /home/nicolas/.config/opencode/skills/ai-sdk-5/SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | /home/nicolas/.config/opencode/skills/branch-pr/SKILL.md |
| When building REST APIs with Django - ViewSets, Serializers, Filters. | django-drf | /home/nicolas/.config/opencode/skills/django-drf/SKILL.md |
| When writing C# code, .NET APIs, or Entity Framework models. | dotnet | /home/nicolas/.config/opencode/skills/dotnet/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | /home/nicolas/.config/opencode/skills/go-testing/SKILL.md |
| When user asks to release, bump version, update homebrew, or publish a new version. | homebrew-release | /home/nicolas/.config/opencode/skills/homebrew-release/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | /home/nicolas/.config/opencode/skills/issue-creation/SKILL.md |
| When user asks to create an epic, large feature, or multi-task initiative. | jira-epic | /home/nicolas/.config/opencode/skills/jira-epic/SKILL.md |
| When user asks to create a Jira task, ticket, or issue. | jira-task | /home/nicolas/.config/opencode/skills/jira-task/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | /home/nicolas/.config/opencode/skills/judgment-day/SKILL.md |
| When working with Next.js - routing, Server Actions, data fetching. | nextjs-15 | /home/nicolas/.config/opencode/skills/nextjs-15/SKILL.md |
| When writing E2E tests - Page Objects, selectors, MCP workflow. | playwright | /home/nicolas/.config/opencode/skills/playwright/SKILL.md |
| When user wants to review PRs (even if first asking what's open), analyze issues, or audit PR/issue backlog. | pr-review | /home/nicolas/.config/opencode/skills/pr-review/SKILL.md |
| When writing Python tests - fixtures, mocking, markers. | pytest | /home/nicolas/.config/opencode/skills/pytest/SKILL.md |
| When writing React components - no useMemo/useCallback needed. | react-19 | /home/nicolas/.config/opencode/skills/react-19/SKILL.md |
| When writing Angular components, services, templates, or making architectural decisions about component placement. | scope-rule-architect-angular | /home/nicolas/.config/opencode/skills/angular/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI. | skill-creator | /home/nicolas/.config/opencode/skills/skill-creator/SKILL.md |
| When building a presentation, slide deck, course material, stream web, or talk slides. | stream-deck | /home/nicolas/.config/opencode/skills/stream-deck/SKILL.md |
| When styling with Tailwind - cn(), theme variables, no var() in className. | tailwind-4 | /home/nicolas/.config/opencode/skills/tailwind-4/SKILL.md |
| When reviewing technical exercises, code assessments, candidate submissions, or take-home tests. | technical-review | /home/nicolas/.config/opencode/skills/technical-review/SKILL.md |
| When writing TypeScript code - types, interfaces, generics. | typescript | /home/nicolas/.config/opencode/skills/typescript/SKILL.md |
| When using Zod for validation - breaking changes from v3. | zod-4 | /home/nicolas/.config/opencode/skills/zod-4/SKILL.md |
| When managing React state with Zustand. | zustand-5 | /home/nicolas/.config/opencode/skills/zustand-5/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### ai-sdk-5
- Import `useChat` from `@ai-sdk/react`, not `ai`
- Use `DefaultChatTransport({ api })`, not the old `api` option on `useChat`
- Render `message.parts`, not `message.content`
- Extract text by filtering `part.type === "text"`
- Prefer `sendMessage({ text })` and local input state instead of legacy handlers

### branch-pr
- Every PR MUST link an approved issue and MUST have exactly one `type:*` label
- Branch names MUST match `type/description` using lowercase `a-z0-9._-`
- Use conventional commits only and follow the repository PR template
- Include summary bullets, file changes table, and test plan in the PR body
- Do not open blank PRs; automation will block them

### django-drf
- Prefer `ModelViewSet` plus `filterset_class` for CRUD resources
- Switch serializers by action (`create`, `update`, default read serializer)
- Put write-only secrets like passwords in dedicated create serializers
- Use `@action` for resource-specific endpoints instead of ad-hoc views
- Keep authorization in DRF permission classes, not inline conditionals

### dotnet
- Use Minimal APIs for new endpoints with typed results
- Prefer primary constructors for DI; avoid manual readonly field assignment
- Keep Clean Architecture boundaries: Domain, Application, Infrastructure, WebApi
- Configure EF Core with Fluent API and `ApplyConfigurationsFromAssembly`
- Do not use data annotations as the main persistence configuration strategy

### go-testing
- Default to table-driven tests with `t.Run` subtests
- Test Bubbletea state transitions by calling `Update` directly
- Use `teatest` for interactive TUI flows instead of brittle manual orchestration
- Prefer golden files for complex rendered output snapshots
- Keep tests idiomatic Go: explicit assertions, no hidden magic

### homebrew-release
- Follow the project-specific release flow: build, tag, GitHub release, then formula update
- Use the correct tag format per repo (`Vx.y.z` vs `vx.y.z`)
- Compute SHA256 from the released artifacts before editing the formula
- Update both source repo and tap repo when the workflow requires it
- Keep formula install/test blocks aligned with the published asset names

### issue-creation
- Always use the repository issue templates; blank issues are disabled
- New issues enter `status:needs-review`; PRs require maintainer `status:approved`
- Search for duplicates before creating a new issue
- Questions belong in Discussions, not Issues
- Include full reproduction steps or user-facing request details in the template

### jira-epic
- Epic titles MUST use `[EPIC] Feature Name`
- Include feature overview, grouped requirements, technical considerations, and checklist
- Organize requirements by functional area with specific, testable bullets
- Always call out performance, data integration, and UI component impacts
- Use Mermaid diagrams for architecture or flow when the feature is substantial

### jira-task
- Split multi-component work into separate tasks; do not hide API+UI in one ticket
- Bugs use sibling tasks; features use parent task plus child implementation tasks
- Parent feature tasks stay user-facing; child tasks hold technical details
- Acceptance criteria must be concrete and component-specific
- Record dependencies explicitly when UI is blocked by API or shared groundwork

### judgment-day
- Use only when the user explicitly requests the judgment-day style review
- Resolve the skill registry before launching judges so standards are injected
- Run two blind reviews in parallel; neither judge should know about the other
- Only confirmed criticals/real warnings drive re-judgment loops
- After two fix iterations, escalate to the user before continuing automatically

### nextjs-15
- Follow App Router conventions (`app/`, `page.tsx`, `layout.tsx`, route handlers)
- Prefer Server Components by default; add `'use client'` only for interactive code
- Use Server Actions for mutations and revalidation/redirect flow
- Fetch data in parallel with `Promise.all` and stream slow sections with `Suspense`
- Keep API logic in `app/api/**/route.ts` with `NextRequest`/`NextResponse`

### playwright
- If MCP/browser exploration exists, inspect the real UI before writing tests
- Keep one spec file per page area; do not explode suites into many tiny spec files
- Prefer `getByRole`, then `getByLabel`, then `getByText`, then `getByTestId`
- Avoid CSS/id selectors unless there is no resilient semantic selector
- Use Page Object Model with shared base-page behavior for navigation and helpers

### pr-review
- Always gather PR metadata and diff before judging a change
- Read the current codebase context, not just the patch
- Block merges for secrets, broken code, debug files, or clear regression risks
- Request changes for missing validation, conflicts, or incomplete features
- Review output should classify mergeability with explicit evidence

### pytest
- Use plain pytest functions/classes with `pytest.raises` for error paths
- Prefer fixtures for setup/teardown and shared test state
- Put shared fixtures in `conftest.py`
- Use `unittest.mock.patch`/`MagicMock` for external boundaries
- Reach for `@pytest.mark.parametrize` instead of repeating near-identical tests

### react-19
- Do NOT add `useMemo` or `useCallback` for routine memoization; React Compiler handles it
- Use named imports from `react`; avoid `import React from "react"`
- Prefer Server Components first; add `'use client'` only for hooks/browser APIs/events
- Use `use()` for promises/context where appropriate
- Treat `ref` as a regular prop; `forwardRef` is usually unnecessary now

### scope-rule-architect-angular
- All components are standalone; do not organize features with NgModules
- Use signals, `computed`, and `effect` instead of lifecycle-heavy patterns
- Prefer `input()`/`output()` and `inject()` over legacy decorators/constructors
- Apply the Scope Rule strictly: 1 feature = local, 2+ features = shared
- Use business-driven Screaming Architecture names, not technical suffix soup

### skill-creator
- Create a skill only for repeated, non-trivial patterns or workflows
- Use the standard `skills/{name}/SKILL.md` layout with optional `assets/` and `references/`
- Frontmatter must include `name`, `description` with trigger, Apache-2.0, author, and version
- Keep `references/` pointing to local docs, not arbitrary web links
- Favor decision trees, critical rules, and minimal examples over long prose

### stream-deck
- Build presentation decks as a single-page HTML app with no framework or build step
- Keep everything within the viewport; no vertical scrolling between slides
- Use inline SVG for diagrams; do not rely on external image files for core visuals
- Follow the Gentleman Kanagawa Blur palette and preserve contrast ratios
- Structure slides as text-left / figure-right with module metadata in `data-*` attributes

### tailwind-4
- Never use `var()` or raw hex colors inside `className`
- Use Tailwind semantic utilities directly for static styling
- Use `cn()` only when classes are conditional or need conflict merging
- Put truly dynamic values in the `style` prop, not dynamic Tailwind hacks
- CSS custom properties are acceptable for third-party libraries that cannot accept classes

### technical-review
- Evaluate submissions on the six fixed factors: styling, expertise, quality, extras, explanation, notes
- Tests are a major seniority signal; absence is a red flag
- Look explicitly for secrets, leaked company data, and unsafe defaults
- Score with evidence from the code, not vibes
- Output should be structured, comparable, and decision-oriented

### typescript
- Prefer const objects plus derived union types over handwritten string unions
- Keep interfaces flat; extract nested shapes into dedicated interfaces
- Never use `any`; use `unknown`, guards, or generics instead
- Use utility types instead of rewriting derivative shapes manually
- Import types with `import type` when only the type side is needed

### zod-4
- Use Zod 4 top-level validators like `z.email()`, `z.uuid()`, and `z.url()`
- Replace `nonempty()` string usage with `.min(1)` where appropriate
- Put schema-level errors in the new `{ error: ... }` options objects
- Prefer discriminated unions for tagged result shapes
- Use `safeParse` at boundaries where validation failures should not throw

### zustand-5
- Build stores with typed interfaces and explicit actions
- Use `persist` only when state genuinely needs storage-backed durability
- Select narrow slices from the store; avoid subscribing to the whole store
- Use `useShallow` when consuming multiple fields together
- Handle async actions inside the store with explicit loading and error state

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| claude.md | /home/nicolas/dev/aciumweb/claude.md | Atomic Design Híbrido architecture rules |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
