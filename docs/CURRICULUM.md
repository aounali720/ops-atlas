# Curriculum: 8 worlds, 40 missions

The learning sequence is designed for newcomers who want to progress to practical cloud engineering. Each mission includes a brief, **three concepts**, a concrete command example, a **text-only** terminal checkpoint, **three scored questions**, three review flashcards, and a link to primary documentation. Every fifth mission is a world boss.

## Learning model

1. **Learn** core definitions and decisions through concise lessons.
2. **Practice** the correct command syntax in the non-executing, simulated terminal.
3. **Check** understanding with 3 questions (2/3 needed).
4. **Complete** both checkpoints to unlock the next mission and earn XP.
5. **Review** cards using a simple increasing-interval schedule.
6. **Apply** the concept for real in optional, disposable labs under [`labs/`](../labs/README.md).

## Full syllabus

### World 01: Git Foundations

*Learn the version-control mental model, then make safe changes with confidence.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 01 | **Why version control matters** | Repository, Commit, Working tree |
| 02 | **Initialize and inspect** | git init, git status, Untracked file |
| 03 | **Stage and commit changes** | Staging area, git add, git commit |
| 04 | **Read history and diffs** | git log, git diff, --staged |
| 05 👑 | **Branches, merges, and recovery** | Branch, Merge, git revert |

**Primary references:** [Source 1](https://git-scm.com/book/en/v2) · [Source 2](https://docs.github.com/en/get-started/learning-to-code/getting-started-with-git)

### World 02: GitHub Collaboration

*Turn local commits into teamwork: remotes, reviews, and automated checks.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 06 | **Remote repositories** | Remote, git push, git fetch |
| 07 | **Pull requests and reviews** | Pull request, Base branch, Review |
| 08 | **Forks, issues, and contributions** | Fork, Issue, Upstream remote |
| 09 | **Resolve merge conflicts** | Conflict marker, Conflict resolution, git diff --check |
| 10 👑 | **Automate with GitHub Actions** | Workflow, Job, GITHUB_TOKEN |

**Primary references:** [Source 1](https://docs.github.com/en/get-started/using-github/hello-world) · [Source 2](https://docs.github.com/en/actions/get-started/quickstart) · [Source 3](https://skills.github.com/)

### World 03: Docker Essentials

*Move from images and containers to persistent, networked workloads.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 11 | **Images versus containers** | Image, Container, Registry |
| 12 | **Run and inspect containers** | docker run, docker ps -a, Port publishing |
| 13 | **Container lifecycle and logs** | docker logs, docker exec, docker stop |
| 14 | **Volumes and persistence** | Named volume, Bind mount, Writable layer |
| 15 👑 | **Networking and container DNS** | Bridge network, Service discovery, Host port |

**Primary references:** [Source 1](https://docs.docker.com/learn/paths/get-started-with-docker-containers/) · [Source 2](https://docs.docker.com/guides/lab-container-getting-started/)

### World 04: Container Engineering

*Build small, secure, reproducible, observable container applications.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 16 | **Write your first Dockerfile** | FROM, COPY, CMD |
| 17 | **Image layers and caching** | Layer cache, Build context, .dockerignore |
| 18 | **Compose multi-service apps** | Compose service, depends_on, docker compose config |
| 19 | **Small and hardened images** | Multi-stage build, USER instruction, Image digest |
| 20 👑 | **Health and observability** | Healthcheck, Readiness, docker stats |

**Primary references:** [Source 1](https://docs.docker.com/get-started/docker-concepts/building-images/) · [Source 2](https://docs.docker.com/compose/gettingstarted/) · [Source 3](https://docs.docker.com/guides/lab-building-images/)

### World 05: Kubernetes Operations

*Operate, scale, expose, and debug containerized workloads.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 21 | **Cluster architecture** | Control plane, Node, kubectl |
| 22 | **Pods and deployments** | Pod, Deployment, ReplicaSet |
| 23 | **Services and networking** | Service, ClusterIP, Ingress |
| 24 | **Configuration, secrets, storage** | ConfigMap, Secret, PersistentVolumeClaim |
| 25 👑 | **Debugging and scaling** | kubectl describe, Resource request, HorizontalPodAutoscaler |

**Primary references:** [Source 1](https://kubernetes.io/docs/concepts/) · [Source 2](https://kubernetes.io/docs/tutorials/kubernetes-basics/)

### World 06: Cloud Fundamentals

*Choose the right cloud primitives and understand the tradeoffs.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 26 | **Cloud models and shared responsibility** | IaaS, PaaS, Shared responsibility |
| 27 | **Compute decision matrix** | Virtual machine, Managed container runtime, Serverless function |
| 28 | **Object, block, and file storage** | Object storage, Block storage, File storage |
| 29 | **VPC, subnets, and endpoints** | VPC, Subnet, Security group |
| 30 👑 | **Identity, resilience, and backups** | Least privilege, Availability zone, Recovery point objective |

**Primary references:** [Source 1](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) · [Source 2](https://docs.cloud.google.com/docs/overview)

### World 07: Cloud Platform Engineering

*Automate deployments, permissions, monitoring, and cost controls.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 31 | **AWS architecture primitives** | EC2, S3, IAM |
| 32 | **Compare Azure and Google Cloud** | Azure Virtual Network, Google Cloud VPC, Azure Blob Storage |
| 33 | **Infrastructure as code** | Infrastructure as code, Terraform plan, State file |
| 34 | **CI/CD and registries** | Continuous integration, Continuous delivery, Artifact provenance |
| 35 👑 | **Monitoring, reliability, and costs** | SLO, Metrics, Cloud budget alert |

**Primary references:** [Source 1](https://docs.aws.amazon.com/) · [Source 2](https://learn.microsoft.com/en-us/training/azure) · [Source 3](https://developer.hashicorp.com/terraform/docs)

### World 08: Production & Security

*Protect the software supply chain and handle realistic production incidents.*

| Level | Topic | Essential concepts |
| --- | --- | --- |
| 36 | **Container attack surfaces** | Rootless container, Read-only root filesystem, Linux capability |
| 37 | **Supply chain and SBOMs** | SBOM, Signature, Vulnerability scanning |
| 38 | **Secure GitHub Actions** | OIDC federation, permissions key, Protected environment |
| 39 | **Respond to a bad deployment** | Rollback, Incident timeline, Postmortem |
| 40 👑 | **Final boss: ship safely** | Defense in depth, Immutable deployment, Disaster recovery test |

**Primary references:** [Source 1](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure) · [Source 2](https://docs.docker.com/security/) · [Source 3](https://docs.github.com/en/actions/security-for-github-actions)

## Assessment and progression

| Activity | Scoring | Validation |
| --- | --- | --- |
| In-game command | Pass/fail | Exact command text ignoring whitespace; no execution |
| Lesson quiz | 2 or 3 correct out of 3 | Explanations displayed after selecting each choice |
| Mission completion | 100 XP or 180 XP (boss) | Earned once after both checkpoints passed |
| Mock exam | 15 MCQ | 80% triggers Exam Slayer achievement |
| Flashcards | Due intervals: 1, 3, and increasing days | Self-rated recall: Got it / Not yet |

**Limitations:** A typed command being accepted is not proof that it works against a real host, that credentials exist, or that systems are securely configured. The quizzes provide formative assessment, not industry certification. The current build includes no production sandbox or automatically provisioned cloud infrastructure.

## Recommended route

**New to the stack:** finish Worlds 01–04 first, then run local labs 01–04. **Already comfortable with Git/Docker:** still complete the checkpoint missions, then concentrate on Kubernetes, cloud networking, IAM, supply chain and the capstone. **Security professionals:** pay particular attention to private networking, least privilege, secret handling, build provenance, CI trust boundaries and incident recovery.

## Beyond the game

Produce portfolio artifacts: a clean PR, Dockerized app, secure Compose stack, Kubernetes manifest with probes, a cloud cost/threat model, and a documented deployment+rollback plan. Include screenshots from **your own real labs**, not the simulated terminal, as evidence of actual system skills.
