# Architecture and tradeoffs

## Overview

```text
Browser / GitHub Pages / static Nginx
  └── React 19 + TypeScript SPA (no backend)
        ├── Campaign UI (8 worlds, 40 missions)
        ├── `curriculum.json` (source of truth)
        ├── `game.ts` (pure scoring/unlocks/review functions)
        ├── Quiz arena (derived MCQs; in-memory attempt state)
        ├── Terminal simulator (string normalizer + exact comparison)
        └── localStorage + JSON export/import (versioned save)
```

This is deliberately **static-first**: cheap hosting, no authentication service, no cloud bill and no secrets stored on a server. GitHub Actions builds/deploys assets; Docker/NGINX is an optional packaging route.

## Domain boundaries

| Location | Responsibility |
| --- | --- |
| `src/data/curriculum.json` | Original course content with stable IDs and official sources |
| `src/data/types.ts` | TypeScript contracts for content and progress |
| `src/lib/game.ts` | Pure progression, question generation, memory review, sanitization |
| `src/lib/game.test.ts` | QA for the content, core rules and edge cases |
| `src/App.tsx` | Views, learner interactions, browser persistence |
| `src/styles.css` | Responsive layouts, design tokens, accessible visual states |
| `labs/` | Separate, optional real-world exercises run by the learner |

## Progress engine

Mission N is unlocked after completing mission N-1 (mission 1 is always unlocked). To clear a mission, pass a text-only command checkpoint and at least two of three quiz questions. Each completion awards 100 XP, or 180 XP for a boss, once. Exam mastery is tracked independently; best score contributes one badge. Flashcards are due immediately until rated. A successful rating schedules 1 day, then 3 days, then approximately 2.2× longer intervals; an unsuccessful rating resets to one day. This is not a validated adaptive learning algorithm.

## Security model

**In-game terminal:** no eval, no shell, no remote API call; a string is compared to a curated answer. This prevents accidental host modification, but should never be mistaken for lab validation. All source text rendered through React's normal escaped text path. The import parser checks version, whitelists known IDs, clamps values and imposes a 1 MB limit. The app makes no credential requests.

**Tradeoffs:** Progress doesn't synchronize between devices, can be cleared with browser storage, and is self-attested. Exports can be edited; badges are educational, not credentials. No server ensures a tiny threat surface and simpler deployments. The GitHub workflows use scoped permissions but production-grade supply-chain protection would pin third-party Actions to reviewed full commit hashes and enable dependency scanning/branch protection.

## Deployment

- **Local dev:** `npm run dev` serves Vite assets for development.
- **GitHub Pages:** `.github/workflows/pages.yml` builds using a base URL derived from `GITHUB_REPOSITORY`, uploads `dist/`, then deploys Pages.
- **Docker:** multistage Node build → static unprivileged Nginx. The Compose example binds to loopback, drops capabilities and mounts temporary write directories.

## Known v1 limitations

- Terminal accepts one **exact** expected command (whitespace normalized); equivalent aliases are not recognized.
- Flashcards are not synchronized, and reviewing does not prove knowledge.
- No drag-and-drop editor, multi-select, architecture builder, sandboxed shell, real cloud API, teacher accounts or signed certificates yet.
- Accessibility has been designed with semantic controls and reduced motion, but automated browser-based accessibility validation is still recommended before a large public launch.
- `package-lock.json` should be generated on a machine with registry access and committed, followed by switching CI/Docker installation to `npm ci`.
