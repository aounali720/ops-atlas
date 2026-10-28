# Contributing to Ops Atlas

Thank you for improving the game. Please open an issue before proposing major changes, keep PRs focused, and don't include credentials or real infrastructure details in examples.

## Extend the curriculum

Open `src/data/curriculum.json`. Each new mission requires a stable `id`, world, `order`, `number`, three concepts (term + definition), one four-choice scenario (`correct` is a zero-based index), a simulated `lab` (prompt, answer, hint), command `example`, safety `tip`, source URLs and XP. Keep explanations original and cite authoritative docs in `sources`.

**Important:** The v1 progression engine assumes exactly five lessons per world and a total order. If adding a ninth world or sixth mission, update UI counters, constants, progression tests and README before publishing. Preserve existing IDs so returning users keep their progress.

## Validate your work

```bash
npm install
npm run typecheck
npm test
npm run build
```

If you expand the flashcard content, update cardinality assertions in `src/lib/game.test.ts`. If you add new progress fields, version the schema in `src/lib/game.ts` and define a migration. Document the terminal's limitations honestly: matching command text is **not** executing or grading a real shell operation.

## Style and accessibility

Use proper buttons for actions and links for navigation. Support keyboard access and reduced motion. Preserve the clear lesson structure: concept, example, lab, quiz, feedback, next step. Keep the site usable at 320px wide.

## License

Contributions are submitted under this project's MIT License unless otherwise stated.
