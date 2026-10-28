# Ops Atlas: optional real-world labs

The in-game command challenges are **simulated text checks**. These eight companion workbooks teach you to run actual commands in **your own authorized, disposable environment**. Labs are optional and require software that may not be installed; none runs automatically when you launch the website.

| Lab | Difficulty | Requirements | Outcome |
| --- | --- | --- | --- |
| [01: Git sandbox](01-git-sandbox/README.md) | Beginner | Git CLI | Working tree, index, branches, revert, conflict handling |
| [02: GitHub PR](02-github-pr/README.md) | Beginner | GitHub account + Git | Create an issue and a reviewable PR |
| [03: Docker lifecycle](03-docker-lifecycle/README.md) | Beginner | Docker Engine/Desktop | Image, container, ports, logs, volumes |
| [04: Compose stack](04-compose-stack/README.md) | Intermediate | Docker + Compose | Two services, DNS, health checks, named volume |
| [05: Kubernetes](05-kubernetes/README.md) | Intermediate | kind or minikube + kubectl | Deployment, ConfigMap, Service, rollouts, events |
| [06: Cloud design](06-cloud-design/README.md) | Intermediate | None | Secure, budget-aware three-tier architecture |
| [07: CI security](07-ci-security/README.md) | Advanced | Text editor/GitHub | Secure-by-default Actions threat review |
| [08: Production capstone](08-capstone/README.md) | Advanced | Previous labs | End-to-end deployment dossier and rubric |

## Safety rules

1. Use a dedicated training directory, test cluster, and non-production accounts. Do not use an employer's infrastructure without authorization.
2. Never commit `.env`, cloud keys, personal data or kubeconfig; use placeholders.
3. Commands can modify files and remove lab resources. Read each cleanup command before running it.
4. Docker images use third-party public registries; review what you pull.
5. Real cloud environments can cost money. The cloud design lab intentionally does **not** ask you to create any resources.

## Feedback loop

**Predict → Execute in the lab → Observe → Explain → Document**. Before each command, predict the output. After it runs, capture a screenshot or an anonymized excerpt; write two sentences explaining what changed. Keep a GitHub journal of what you learned.
