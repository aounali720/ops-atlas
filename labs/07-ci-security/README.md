# Lab 07 — Harden a delivery pipeline

**Goal:** Identify paths for untrusted contributions to access high-privilege workflow contexts and design mitigations. This lab is a review exercise; do not run intentionally insecure workflows with real secrets.

## Safe baseline

Read [`safe-workflow.example.yml`](safe-workflow.example.yml) and compare it with `.github/workflows/ci.yml`. Check each of these properties:

1. Is the `GITHUB_TOKEN` least privileged by default?
2. Are pull-request builds granted access to production credentials?
3. Are third-party Actions audited/pinned to a trusted full commit SHA for high assurance?
4. Does the workflow validate types, content, tests, and build outputs?
5. Are deployments separated from CI and gated by environments/approval when needed?
6. Does the pipeline preserve an immutable artifact digest and produce an SBOM for release artifacts?
7. Can a dependency update or `package.json` script change what the runner executes?

## Threat scenarios

- A pull request changes `package.json` scripts to exfiltrate a deployment token. What design principle blocks it?
- A third-party action tag is compromised. How would you notice, reduce risk, and recover?
- A registry `latest` tag is moved after passing tests. How should promotion work?

**Deliverable:** a one-page threat model with assets, attacker-controlled surfaces, trust boundaries, and remediations ordered by impact. Propose a hardened pipeline design in a PR; no secrets required.

References: <https://docs.github.com/en/actions/security-for-github-actions> · <https://docs.docker.com/security/>
