# Roadmap: from educational MVP to immersive DevOps RPG

## v1 — Included in this release

8 worlds/40 sequential missions, 120 questions, 120 flashcards, simulated terminal, hints, checkpoints, XP, boss stages, 8 achievements, 15-question practice exams, review scheduling, local saves, JSON backup, 8 optional real lab workbooks, responsive UI, GitHub Pages and Docker deploy templates.

## v1.1 — Quality and authoring (proposed)

- Generate and commit npm lockfile; pin GitHub Actions to reviewed full SHA revisions.
- Browser e2e tests (Playwright), axe accessibility audit, mobile-device QA.
- Localization and improved learning accessibility; keyboard shortcuts and audible feedback as opt-in.
- Author tooling and CI JSON-schema validation, source link checker, typo correction and course reviewer checklist.
- Filter dashboard by bookmarks/skills and expose a clearer missed-questions review queue.

## v2 — More game mechanics (proposed)

- Scenario decision trees, command ordering, YAML drag-and-drop, log analysis puzzles and cloud architecture matching.
- Mission narrative arcs, side quests, cross-world puzzles, evidence-based achievements and progress visualizations.
- Additional advanced routes: OCI internals, Helm, Kubernetes RBAC, Terraform state, policy-as-code, containers in AWS ECS/EKS, Azure AKS and GKE.
- Difficulty profiles: beginner, interview-focused, platform engineer, and security engineer.

## v3 — Real interactive labs (proposed; security-sensitive)

- Per-user ephemeral disposable containers with strict CPU/memory/time limits and no privileged Docker socket.
- Deterministic grading of filesystem/network state rather than checking command text.
- Permission-constrained Kubernetes simulators and optional local kind/minikube integration.
- Automatic cost budgets and explicit opt-in before any real cloud provisioning.
- No untrusted code execution on site visitors' devices or shared hosts.

## v4 — Collaboration and verifiable portfolios (proposed)

- Optional accounts and encrypted cloud sync (not required for offline use).
- Group classrooms, course authoring/review, educator analytics with consent.
- Shareable public portfolios that distinguish actual lab evidence from simulated progress.
- Internationalization, documented curriculum revision policy and vendor-change monitoring.

This roadmap is *aspirational*, not a claim that future features are available today. Prioritize measurable learning outcomes, strict sandbox security and affordability over adding novelty for its own sake.
