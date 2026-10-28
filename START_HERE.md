# Ops Atlas — start here

Ops Atlas is a browser game I made to practice Git, Docker, Kubernetes and cloud basics.

**Repository:** https://github.com/aounali720/ops-atlas

## Run locally

Install Node.js 22+ and Git, then run:

```powershell
git clone https://github.com/aounali720/ops-atlas.git
cd ops-atlas
npm install
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## Deploy using GitHub Pages

Visit repository **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. The included workflow builds and publishes the site.

Expected website URL: https://aounali720.github.io/ops-atlas/

## What's real versus simulated?

The in-browser training terminal **does not execute commands**. For real Git, Docker, Kubernetes and cloud practices, use the guarded `labs/` workbooks and your own disposable environment. Never store tokens in the repository.

Tests: `npm run validate:content`, `npm run typecheck`, `npm test`, `npm run build`.
