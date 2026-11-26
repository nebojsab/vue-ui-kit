# Contributing

Thanks for helping out! Issues and pull requests are welcome.

## Setup

```bash
npm install
npm run dev     # docs with every component, live
```

## Adding or changing a component

1. **Component:** `src/components/App<Name>.vue` uses `<script setup>`, plain JavaScript and
   runtime `defineProps({...})`. Put a JSDoc comment on each prop. A comment that starts with
   `'a' | 'b'` becomes the prop's type.
2. **Export it** from `src/index.js` (alphabetical).
3. **Types:** run `npm run build:types`, then commit `src/index.d.ts`.
4. **Docs:** add an entry (title, description, when to use / not, props, stories with a live demo)
   in `docs/src/views/docs/*.js` or `ComponentView.vue`, and list it in `docs/src/nav-data.js`.
5. **Check:** both themes, keyboard only, and a phone-width window.

## Rules

Read the [Principles](https://nebojsab.github.io/vue-ui-kit/principles/). In short:

- Use tokens (`bg-surface-1`, `text-fg-2`, `border-line`), never raw hex or `dark:` pairs.
- Give one colour one meaning.
- Keep focus visible everywhere, and follow the WAI-ARIA pattern for the widget.
- Never use colour alone. Add an icon or a word.
- Don't use `@apply` inside component `<style>` blocks. Put the classes in the template, so the
  kit builds with Tailwind v3 and v4.

## Releasing

Bump `version` in `package.json`, add a `CHANGELOG.md` entry, then push a tag `vX.Y.Z`.
CI publishes to npm.
