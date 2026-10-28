# Research notebook — primary sources and learning decisions

Research date: **October 28, 2026**. This document explains which primary sources informed the original learning sequence. Product features, prices, certification domains and cloud services can change; use live official documentation when performing actual operations. The project copies no vendor lesson text.

## Git & GitHub

- [Pro Git book](https://git-scm.com/book/en/v2): source control models, index, commits, branches, merges, history and recovery.
- [GitHub Hello World](https://docs.github.com/en/get-started/using-github/hello-world): first repository, branch, commit and pull request.
- [GitHub learning resources](https://docs.github.com/en/get-started/start-your-journey/git-and-github-learning-resources): GitHub Skills' interactive workflow focus.
- [GitHub Actions quickstart](https://docs.github.com/en/actions/get-started/quickstart): workflow events, jobs, steps and automation; minimally scoped tokens.
- [GitHub authentication docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure): credential and repository safety.

**Curriculum choice:** put local Git before hosting concepts, introduce PR reviews before privileged CI automation, and teach reverting shared history safely.

## Docker, containers & Compose

- [Docker learning path](https://docs.docker.com/learn/paths/get-started-with-docker-containers/): images/containers, volumes and Compose in a progression.
- [First Docker lab](https://docs.docker.com/guides/lab-container-getting-started/): run, inspect and build real containers.
- [Building images](https://docs.docker.com/get-started/docker-concepts/building-images/): context, caching, tags, multi-stage builds and small images.
- [Compose quickstart](https://docs.docker.com/compose/gettingstarted/): multi-container app, service networking and YAML-defined composition.
- [Secure build lab](https://docs.docker.com/guides/lab-building-images/): non-root, smaller runtime, build secrets and layer pitfalls.

**Curriculum choice:** separate lifecycle from image construction; make storage/networking prerequisite concepts for Compose; distinguish readable commands from actual system execution.

## Kubernetes

- [Kubernetes concepts](https://kubernetes.io/docs/concepts/): nodes, workloads, services, storage, configuration and security abstractions.
- [Kubernetes basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/): create, deploy, expose, scale, update and troubleshoot.

**Curriculum choice:** teach stable Services after ephemeral Pods, and emphasize resource requests, probes, RBAC/Secrets and event-driven debugging.

## Cloud & platform engineering

- [Azure fundamentals study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900): shared responsibility, compute, networking, storage, management and governance.
- [Microsoft Learn Azure](https://learn.microsoft.com/en-us/training/azure): provider-specific service mapping.
- [Google Cloud overview](https://docs.cloud.google.com/docs/overview): cloud organization, regions/zones and service families.
- [AWS documentation](https://docs.aws.amazon.com/): original provider guidance for IAM, EC2, VPC and S3.
- [Terraform docs](https://developer.hashicorp.com/terraform/docs): infrastructure as code and plan/state concepts.

**Curriculum choice:** compare **principles** before service names; prioritize least privilege, operational responsibility, resilience, observability and budgeting. Do not assume any cloud exercise is free.

## Security & reliability

- [GitHub Actions security](https://docs.github.com/en/actions/security-for-github-actions): token permissions, workflow trust and runner hardening guidance.
- [Docker security](https://docs.docker.com/security/): container/runtime and software supply-chain risk management.
- [Kubernetes security concepts](https://kubernetes.io/docs/concepts/security/): Pod policies, API authorization, secrets and workloads.

**Curriculum choice:** introduce defense-in-depth and supply-chain practices before the final rollout/rollback and incident-response bosses. A simulated lab cannot award proof of real-system competence: use optional real labs and the 100-point capstone rubric.

## Pedagogy / accessibility decisions

- Short missions reduce cognitive load; three concept cards connect terminology to practical commands.
- Quizzes display why an answer is correct, not just correct/incorrect.
- Flashcard review intervals encourage active recall; the algorithm is deliberately simple and makes no scientific accuracy claim.
- Incorrect in-game commands are safe: the application never executes them.
- Keyboard-focusable buttons, semantic headings, reduced-motion support and no mandatory login make the experience approachable.

## Roadmap validation principles

Before adding true hands-on remote sandboxes: isolate untrusted code, enforce limits and timeouts, prevent host/container escape, use per-session identities, prevent cloud billing, and never let the application execute arbitrary shell commands on a user's machine. See [ROADMAP](ROADMAP.md).
