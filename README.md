# Vue UI Kit

A Vue 3 + Tailwind CSS component library: design tokens (light and dark), a Tailwind preset,
43 components, layout shells, composables and decorative art.

**Docs:** https://nebojsab.github.io/vue-ui-kit/ · locally `npm run dev`

## What's inside

| | |
|---|---|
| `styles.css` | Tokens (light + dark, CSS variables), gradients (`bg-brand-vivid · night · aurora · soft · hero`), base styles, utilities (`.card`, `.card-interactive`, `.text-overline`, `.tabular`, `.sticky-aside`…), Inter (300–800; `font-mono` = Inter with tabular figures) |
| `tailwind-preset` | Colours mapped to the tokens (slate neutrals, indigo `brand`, `accent-blue · purple · pink · amber` for categories), fonts, type scale, radii, shadows, animations |
| Components | 43: `AppButton`, `AppInput`, `AppDateInput`, `AppSelect`, `AppCombobox`, `AppCheckbox`, `AppToggleGroup`, `AppCopyButton`, `AppFilterChip`, `AppFilterTile`, `DataTable`, `StatCard`, `AppModal`, `AppConfirmDialog`, `AppDrawer`, `AppPopover`, `AppToaster`… |
| Layout | `AppSidebar` (floating, collapsible), `AppUserMenu` (topbar), `AppBottomNav` (phones), `AppStickyBar`, `AppBackToTop` |
| Composables | `useInfiniteList` (load as you scroll), `useStuck` (sticky state), `useFloating` (popover/list positioning) |
| Art | `FlowLines` (interactive), `LightStreak`, `Swoosh` (light trails, light/dark) |
| Logo | `KitLogo` (`full`, `mark`), `BrandLogo` (renders any app's own SVG logo), `logo/logo-mark.svg` (favicon) |
| `toast()` | App-wide toasts without a store library |

Source is shipped as `.vue` files, so the app's Vite compiles them. Peer deps: `vue@^3.5`, `@heroicons/vue@^2`, `tailwindcss@^3.4`.

## Use it in an app

**Install**, straight from GitHub:
```bash
npm i github:nebojsab/vue-ui-kit
```
or, while developing both side by side, from a local folder:
```json
"@nebojsab/vue-ui-kit": "file:../vue-ui-kit"
```

**Wire it up**
```js
// tailwind.config.js
import uiKitPreset, { uiKitContent } from '@nebojsab/vue-ui-kit/tailwind-preset'
export default {
  presets: [uiKitPreset],
  content: ['./index.html', './src/**/*.{vue,js}', ...uiKitContent],
}
```
```css
/* src/assets/main.css */
@import '@nebojsab/vue-ui-kit/styles.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```
```js
// vite.config.js: one copy of Vue
resolve: { dedupe: ['vue', '@heroicons/vue'] }
```
```vue
<script setup>
import { AppButton, StatCard, AppToaster, toast } from '@nebojsab/vue-ui-kit'
</script>
```
Dark mode: toggle the `dark` class on `<html>`. Wrap a section in `.theme-dark` to keep it dark in both themes.

**Theming:** every colour is an RGB-channel CSS variable (`--ui-brand`, `--ui-surface-1`, `--ui-accent-purple`, …) in
`src/styles/index.css`. Override them in your app's CSS to retheme the whole kit.

**App shell**
```vue
<AppSidebar :groups="groups" :footer-items="tools" v-model:collapsed="collapsed">
  <template #logo="{ collapsed }">
    <KitLogo v-if="collapsed" variant="mark" class="h-8" />
    <KitLogo v-else label="My App" class="h-8 text-fg" />
  </template>
</AppSidebar>
<div :class="['md:ml-[88px]', !collapsed && 'lg:ml-[280px]']"> … </div>
<AppBottomNav :tabs="tabs" :more="more" :action="{ label: 'New' }" @action="open" />
```
`groups: [{ title, items: [{ to, label, icon, tag?, alert? }] }]`. Links use `<RouterLink>` when the app has vue-router.

**Floating panels:** `AppPopover` and `AppCombobox` lists are teleported to `<body>` with fixed
coordinates, so modals and scrolling cards can't clip them. They open upwards when there's no room below.

**Gamification:** `AppPeriodTabs`, `AppCountdown`, `AppRewardBox` and `AppXpBar` use the gold `reward` tokens for points, levels and time-boxed challenges.

## Working on the kit

```bash
npm install
npm run dev          # docs on http://localhost:5173, every component live
npm run build:docs   # static docs build → docs-dist/
```
Docs live in `docs/` and import the package source directly.

## License

[MIT](LICENSE)

## Deploy

`.github/workflows/docs-pages.yml` builds the docs and publishes them to GitHub Pages on every push
to `main`. The workflow passes the repo name as `BASE_PATH`, and `build:docs:pages` copies
`index.html` to `404.html` so deep links work.
