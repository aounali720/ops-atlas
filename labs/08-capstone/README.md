# Lab 08 — Final boss: production release dossier

Your team maintains a small public application with a Node.js API, persistent state and a static frontend. You must propose a secure release workflow covering source control, container builds, quality gates, workload identity, deployment, monitoring, and recovery. No production access is needed.

## Mission objectives

1. **Version control** — Protected main branch, documented contribution process, PR template, ownership and review rules.
2. **Container** — Minimal Dockerfile, `.dockerignore`, non-root runtime, healthcheck, image vulnerability report, SBOM and digest-pinned deploy.
3. **Delivery** — CI tests/build/review, constrained token permissions, artifact provenance and release approvals.
4. **Runtime architecture** — Sketch a K8s or managed-container deployment with ingress, private database and durable object storage.
5. **Security** — IAM roles, secret injection strategy, private networking, logging and basic threat model.
6. **Reliability** — SLO, alert ownership, rolling update/rollback plan, backup/restore drill and incident playbook.
7. **Costs** — Document compute, storage, logs, egress, budgets and the assumptions behind estimates.
8. **Portfolio presentation** — README, architecture diagram, screenshots of tests, limitations, and demonstration video outline.

## 100-point rubric

| Category | Points | Evaluation |
| --- | ---: | --- |
| Git and code review | 10 | Traceable PR, checks, reproducible commits |
| Docker & runtime | 15 | Minimal secure image, no build secrets in layers |
| Continuous delivery | 15 | CI, immutable artifacts, least-privilege deployment identity |
| Kubernetes/cloud architecture | 15 | Correct network and workload configuration |
| Security/threat model | 15 | Credible least-privilege and mitigations |
| Monitoring/reliability | 15 | Actionable SLO, rollback, recovery test |
| Cost controls | 5 | Explicit budget assumptions and alerts |
| Documentation/demo | 10 | Clear evidence and honest limitations |

**Passing:** 80+ points with no critical security gap (hardcoded production key, public unrestricted database, or untrusted PR code using production tokens). Include a separate `DECISIONS.md` for tradeoffs, `RUNBOOK.md` for incidents, and `RECOVERY.md` for restore evidence.

## Boss event simulation

At 10:15 UTC, error rate rises after a rollout. At 10:19, alerts fire. The database remains healthy, but requests to `/api/orders` time out. Write an incident timeline, identify which dashboards to check, give a safe rollback decision, and outline the next-day postmortem. Do **not** invent evidence of successful remediation; label any unknown metrics as hypothetical.

**Victory condition:** You can describe how code travels from a PR to a monitored, recoverable production release without handing secret credentials to untrusted jobs.
