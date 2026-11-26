# Changelog

All notable changes to this project. The format follows [Keep a Changelog](https://keepachangelog.com/)
and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Templates** in the docs: Dashboard, Settings, Sign in and Projects (list + edit drawer). These are full
  pages built only from kit components, with a live preview at desktop, tablet and phone widths,
  full-screen view (`/preview/<name>`), and copy-paste source.

### Changed
- `AppTabs` hides the scrollbar on tab strips that scroll (phones).
- Type declarations name kebab-case events correctly (`onRowClick`, `onSignOut`).

### Removed
- **Breaking:** `Swoosh` art component. It came from the original brand, so the next release is 2.0.0.

## [1.0.0] — 2026-11-26 · [npm](https://www.npmjs.com/package/@nebojsab/vue-ui-kit/v/1.0.0)

First public release.

### Added
- 49 Vue 3 components, including the new **Tabs**, **Accordion**, **Alert**, **Dropdown Menu**,
  **Pagination** and **Breadcrumbs**.
- Semantic design tokens for light and dark themes: slate neutrals, an indigo brand, and
  `accent-blue/purple/pink/amber` for categories.
- Named radii as CSS variables (`--ui-radius-control/card/panel`).
- Tailwind CSS v4 entry (`tailwind-v4.css`) next to the v3 preset.
- TypeScript declarations for every component (`src/index.d.ts`, generated from props).
- Docs site organised by Atomic Design, with Principles, Radius & Elevation, Motion & Layers and a
  live Theming playground. Each page has its own title, description and social preview.
