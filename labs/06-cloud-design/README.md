# Lab 06 — Architect for a real workload (no cloud charges)

**Scenario:** A small company wants a three-tier app for 5,000 daily visitors, upload storage, a private relational database, CI deployments, and a reasonable monthly cost ceiling. Your task is to design, **not provision**, a reliable and secure architecture.

## Required architecture worksheet

| Layer | Requirement | Your decision | Why / tradeoff |
| --- | --- | --- | --- |
| DNS & TLS | Public HTTPS traffic | | |
| Application | Web API; occasional traffic spikes | | |
| Database | Private, daily backups and restore tests | | |
| Uploads | Durable objects | | |
| Networking | No public database endpoint | | |
| Identity | Workload identity, least privilege | | |
| Observability | Errors, latency, alert owner | | |
| Resilience | Recover from instance/zone failure | | |
| Cost | Forecast, budget alert, teardown plan | | |

## Map your design to three providers

| Primitive | AWS example | Azure example | Google Cloud example |
| --- | --- | --- | --- |
| Virtual compute | EC2 | Azure Virtual Machines | Compute Engine |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Private networking | VPC | Virtual Network | VPC |
| Identity | IAM | Microsoft Entra ID / Azure RBAC | Cloud IAM |
| Managed SQL | RDS | Azure SQL Database / Azure Database services | Cloud SQL |
| Logging | CloudWatch | Azure Monitor | Cloud Logging |

These are rough functional counterparts, not 1:1 equivalents. Verify each provider's networking scopes, APIs, limits, and pricing before building.

## Threat-model checkpoint

- A developer accidentally shares an access key. Which controls limit blast radius?
- A bucket is misconfigured for public reads. How will you detect this?
- Database is lost. What recovery point and recovery time objectives did you choose, and how can you test them?
- Traffic doubles overnight. Which controls prevent budget surprises?

**Deliverables:** architecture diagram (any tool), one-page justification, least-privilege IAM permissions table, rough *pricing worksheet with explicit assumptions* (do not invent current prices), backup/restore checklist, and security review.

**Cost warning:** Cloud providers may charge for resources even in a free-tier account. This lab contains no provisioning instructions; before trying real services set a budget and billing alarms, and plan cleanup.

Docs: <https://docs.aws.amazon.com/> · <https://learn.microsoft.com/en-us/training/azure/> · <https://docs.cloud.google.com/docs/overview>
