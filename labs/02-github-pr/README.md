# Lab 02 — Collaborate like a maintainer

**Goal:** Demonstrate issue → branch → commits → PR → review → merge. **Prerequisite:** Lab 01 and a GitHub account. Use a training repository that you own.

1. Create a new **private or public** practice repo with a README; clone it. Do not push credentials.
2. Open an issue: `docs: explain setup instructions`. Include acceptance criteria and reproducible steps.
3. Create `docs/setup-guide`, change README with installation, expected output and cleanup guidance.
4. Use `git diff --check`, `git status`, then make a descriptive commit and push with `git push -u origin docs/setup-guide`.
5. Open a PR to `main` and reference your issue with `Closes #NUMBER` in the PR body. Fill out the testing checklist and ask for feedback if a reviewer is available.
6. Review the **Files changed** tab; check for accidental tokens and unrelated file edits. Let checks finish; merge through the GitHub UI when appropriate.
7. Pull merged changes to local `main`, then delete your feature branch if no longer needed.

**Reflection:** Why is a branch safer than editing main? When do you need a fork? Which checks should block deployment? What breaks if you publish a `.env` file, even briefly?

**Proof of work:** an issue link, a merged PR link, a screenshot of passing checks (if configured), and a one-paragraph review describing a possible improvement.

Docs: <https://docs.github.com/en/pull-requests/get-started>
