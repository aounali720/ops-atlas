# Lab 01 — A Git repository you can safely break

**Goal:** Understand status, staging, commits, history, branches, merge and revert. **Requirements:** Git only. Run in a new empty directory, not in an existing project.

## Part A — record three states

```bash
mkdir stackbound-git-lab
cd stackbound-git-lab
git init -b main
git config user.name "Ops Atlas Learner"
git config user.email "learner@example.invalid"
printf "# Field Notes\n" > README.md
git status --short
git add README.md
git diff --staged
git commit -m "docs: add field notes"
```

In PowerShell, replace the `printf` line with `'# Field Notes' | Set-Content README.md`. **Questions:** Before `git add`, where was README.md? After `git add`, where was its content? What did the commit record?

## Part B — isolate a feature

```bash
git switch -c feature/notes
# Add a sentence to README.md in an editor
git add README.md
git commit -m "docs: add an experiment"
git switch main
git log --oneline --all --decorate --graph
git merge feature/notes
```

Predict which branch will include the new sentence before and after merge. Use `git show --stat HEAD` to explain the final merge outcome.

## Part C — undo without rewriting shared history

```bash
git log --oneline -3
git revert HEAD
```

Git may open an editor. Observe the new revert commit; it is not the deletion of an old commit. Explain why revert is generally safer than force-pushing a rewritten shared branch.

## Optional conflict drill

Create two branches from the same commit and change **the same line** differently on each. Merge one into main, then attempt the other. Inspect `git status` and conflict markers, edit to a correct combined outcome, `git add README.md`, and `git commit` to finish.

## Done when

You can explain **working tree vs index vs history**, read `git log --graph`, resolve a conflict without deleting data, and describe revert vs reset. Keep this sandbox for further experimentation or delete only this dedicated directory.
