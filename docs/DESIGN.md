# Ops Atlas / Visual language

**Direction:** an expedition notebook for learning infrastructure — part engineering field manual, part printed game atlas.

I wanted the interface to feel like a printed field notebook instead of another dashboard. The recurring design choices are:

- **Ink:** deep forest charcoal (#121A18) for the working canvas and dark navigation accents.
- **Paper:** warm uncoated stock (#EFEDE2) for navigation and progress readouts.
- **Signal:** expedition orange (#ED6A45) for the primary quest poster, actionable moments, and navigation markers.
- **Type:** bold system grotesk for headlines and system monospace for section codes, dates, status labels, and measurement readouts. No external font requests.
- **Shape:** squared corners (2–5px), ruled dividers, tiny diamonds, engraved navigation indicators, and map-like diagrams. No generic glowing orbs or glass cards.
- **Illustration:** original SVG route atlas in the hero, with numbered Git → Containers → Cloud waypoints. Do not substitute stock photos or AI-produced artwork.
- **Hierarchy:** one warm, high-contrast campaign billboard; quiet dark lesson canvases; paper checkpoint cards; subtle color-coded states.

## Code organization

`src/styles.css` retains foundational layout and interaction patterns. `src/field-guide.css` holds the current brand and responsive art direction, imported last by `src/main.tsx`. Prefer adding future design refinements to `field-guide.css`, not reintroducing purple-blue gradients throughout the base file.

## Interaction rules

1. Keep **all mission and flashcard text selectable and legible**, including on mobile.
2. Maintain explicit text labels and keyboard focus styling; icons are secondary.
3. Distinguish locked, completed, active, and earned states with words as well as color.
4. No third-party image hosting or remote fonts. Keep the static build privacy-friendly and fast.
5. Any decorative motion must respect `prefers-reduced-motion`.
6. Verify layout on 375px, 768px, 1024px, and 1440px widths when practical.
7. Keep game progression, browser storage, export/import, and command simulator mechanics independent from visual theming.

## Anti-patterns

Avoid glassmorphic blur, purple gradients, oversized glowing circles, identical pill badges everywhere, washed-out text, ornamental emoji walls, meaningless decorations, high-motion page transitions, and contrast-deficient microcopy.
