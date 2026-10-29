<div align="center">

# Ops Atlas

A small learning game for Git, containers, Kubernetes and cloud fundamentals.

Built with React, TypeScript and Vite. Play it in the browser or run it locally. The lessons are short enough to finish one at a time.

**8 worlds · 40 missions · 120 mission questions · 120 flashcards · 40 command checkpoints · 8 runbooks · 8 diagnostic drills**

[Get started](#-quick-start) · [Explore the curriculum](docs/CURRICULUM.md) · [Real-world labs](labs/README.md) · [Architecture](docs/ARCHITECTURE.md)

</div>

---

## Why I built it

I wanted a way to practice Git and infrastructure concepts without jumping between unrelated tutorials. Ops Atlas starts with a local Git repository, then moves into collaboration, Docker, Kubernetes, cloud and security topics. Each mission has a short explanation, a few questions and a simulated command exercise. It runs without a login or paid cloud account.

### Game features

| System | How it works |
| --- | --- |
| Campaign map | 8 themed worlds, 5 missions each, sequential unlocks |
| Lessons | Three core concepts, command examples, on-call notes, verification steps, common failure modes, and references |
| Interactive command challenge | Text-based validation of one targeted command; **does not execute a shell** |
| Knowledge checkpoints | 3 questions per level; pass 2/3 to unlock mission completion |
| Flashcard vault | 120 term/definition cards, reveal/retry, scheduled spaced review |
| Quiz arena | 15-question comprehensive or subject-specific assessments, explanations and personal best |
| XP and badges | 100 XP per regular mission; 180 XP per world boss; 8 milestones |
| Daily quest board | 3 new daily objectives: unique flashcard reviews, an operator shift, and 80%-plus arena score; reward claims reset daily |
| Streaks | Local-calendar streaks count actual study actions, not page visits; best streak retained |
| Credits & reward vault | Earn cosmetic credits on first-time mission clears, boss victories, and daily quest claims; customize your explorer |
| Victory celebrations | Mission clear dialogs, boss-chest rewards, progress previews, and responsive celebrations |
| Offline progress | Browser `localStorage`, JSON export/import, reset; no server telemetry |
| Portfolio & CI | React + TypeScript + Vite, content checks, Docker, Compose, GitHub Actions, GitHub Pages |
| Practical labs | Optional local Git/Docker/Kubernetes and architecture challenge workbooks in `labs/` |\n| Operator runbooks | Eight interactive investigations, 32 steps, 24 diagnostics, and eight decision questions in the Field manual |

> **IMPORTANT:** Ops Atlas's in-game terminal is a *simulation*. It only compares the text of a command against the mission answer (ignoring whitespace differences). It does not execute Docker commands, provision cloud resources, or verify changes to an external system. This is intentionally safe, not a replacement for a real terminal or disposable cloud lab.

## 🚀 Quick start

Requirements: **Node.js 22 or later** and npm. The first installation downloads packages; after that the browser app itself is static.

```bash
git clone https://github.com/aounali720/ops-atlas.git
cd ops-atlas
npm install
npm run dev
```

Visit the URL shown in your terminal (normally `http://localhost:5173`). If you downloaded a ZIP instead of cloning it, extract it, run `npm install` in that folder, then `npm run dev`.

To verify the project locally:

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

The `npm install` command creates a lockfile. **Commit the generated `package-lock.json`** for reproducible installs and change workflows to `npm ci` once the lockfile is checked in.

### Docker run (optional)

```bash
docker compose up --build -d
# Open http://localhost:8080
docker compose down
```

The application container serves static assets using unprivileged Nginx on port 8080. The Compose example binds to 127.0.0.1 only, drops Linux capabilities, and uses a read-only root filesystem.

### 🎮 Arcade progression rules

- **Missions:** complete the terminal and 2/3-question checkpoint to earn mission XP and credits once. Boss missions grant bigger credit drops.
- **Daily quests:** each day is based on your device's local calendar. Review **five different** flashcards, clear a mission **or** finish one quiz-arena round, and score at least 80% in an arena round. Claim each completed quest for bonus XP and credits.
- **Streak:** actual learning actions (lab, checkpoint, flashcard grade, mission, or arena submission) count. Viewing a page or buying a cosmetic does not count.
- **Reward vault:** credits unlock cosmetic identities only. No financial payments, ads, paid loot boxes, competitive rankings, or shortcuts to answers.
- **Existing saves:** the game keeps the same version-1 local save format, with validated optional new fields. Previous completed missions get their earned credits when first opening this version.
- **Privacy:** all quests, credits, streaks, achievements, and inventory remain in browser localStorage and are included in JSON export/import. Clearing browser storage without a backup clears this progress.

## 🗺️ Learning worlds

| World | Missions | Main subjects |
| :-- | :--: | :-- |
| 01 — Git Foundations | 1–5 | Repositories, status, index, commits, history, branching & undo |
| 02 — GitHub Collaboration | 6–10 | Remotes, pull requests, forks, conflicts, GitHub Actions |
| 03 — Docker Essentials | 11–15 | Images, containers, lifecycle, volumes, Docker networking |
| 04 — Container Engineering | 16–20 | Dockerfiles, caching, Compose, hardening, health checks |
| 05 — Kubernetes Operations | 21–25 | Cluster basics, Pods, Deployments, Services, configuration, debugging |
| 06 — Cloud Fundamentals | 26–30 | Service models, compute, storage, VPC, least privilege & resilience |
| 07 — Cloud Platform Engineering | 31–35 | AWS, Azure, Google Cloud, Terraform, CI/CD, SLOs & cost |
| 08 — Production & Security | 36–40 | Container isolation, SBOMs, secure workflows, incident response, launch capstone |

The curriculum is editable JSON in `src/data/curriculum.json`. Add levels without changing the rendering code. See [authoring guide](CONTRIBUTING.md).

## Live version

**[Play Ops Atlas on GitHub Pages](https://aounali720.github.io/ops-atlas/).** The included GitHub Actions workflow builds and publishes the static site from `main`. The Vite config uses the repository path when deployed to GitHub Pages.

## 🧰 Optional practical labs

[`labs/`](labs/README.md) contains separate, optional exercises you run on your own machine. Start with the Git lab before trying Docker or Kubernetes. The cloud exercises focus on planning and reviewing architecture; the website doesn't create cloud resources.

## 🔒 Privacy & security

- No hosted backend, analytics tracker, auth token or telemetry service.
- Game progress lives in your own browser. Export JSON before clearing storage.
- JSON import accepts known version-1 fields, validates mission/card IDs, and caps file size at 1 MB.
- The terminal is deterministic text comparison; it **never** sends commands to any execution backend.
- Don't enter real passwords, tokens or cloud credentials in a lesson, issue, or screenshot.
- Third-party official-doc links open in a new tab. Provider trademarks are not affiliated with this project.
- GitHub Actions workflows have scoped permissions; production users should additionally pin third-party Actions to verified commit SHAs and enforce branch protections.

## 🧪 Technical implementation

- React 19, TypeScript 5, Vite 6, minimal dependencies, responsive CSS and Lucide icons.
- Tests cover curriculum integrity, quiz generation, progress sanitation, command comparison, unlock logic and review scheduling.
- `src/data/types.ts` defines the data contract. `src/lib/game.ts` contains progression and quiz logic. `src/App.tsx` renders the game views.
- Static-only architecture deploys on GitHub Pages, any static server, or a hardened Docker/NGINX container.

See [architecture and tradeoffs](docs/ARCHITECTURE.md) and [future roadmap](docs/ROADMAP.md).

## Originality and references

The lessons and exercises were written for this project. Educational topics and command syntax are grounded in official [Git](https://git-scm.com/book/en/v2), [GitHub](https://docs.github.com/), [Docker](https://docs.docker.com/), [Kubernetes](https://kubernetes.io/docs/), [AWS](https://docs.aws.amazon.com/), [Azure](https://learn.microsoft.com/en-us/training/azure/), [Google Cloud](https://docs.cloud.google.com/docs/overview) and [Terraform](https://developer.hashicorp.com/terraform/docs) references. This project is **not** affiliated with or certified by those vendors. Links reviewed October 2026.

**License:** MIT. Contributions welcome.
