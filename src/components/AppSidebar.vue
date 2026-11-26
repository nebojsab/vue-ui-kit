<template>
  <!-- App sidebar (md+) — a floating panel, like Figma's. Icon rail (w-16) on md; on lg the
       full panel (w-64), which collapses to the rail. Phones use AppBottomNav instead.
       Pair with a content offset: md:ml-[88px] and, when expanded, lg:ml-[280px].
       brand: the brand gradient when open, a solid fill from the same gradient on the rail
       (a gradient squeezed into 64px looks pinched). -->
  <aside
    :class="[
      'fixed left-3 top-3 bottom-3 z-30 hidden md:flex flex-col rounded-2xl',
      brand
        ? ['bg-brand-hero sidebar-brand border border-line', collapsed && 'is-rail']
        : 'bg-surface-1/95 dark:bg-[#0B1020]/95 backdrop-blur-md border border-line',
      'shadow-[0_16px_40px_-16px_rgb(0_0_0/0.55)]',
      'transition-all duration-200 ease-out',
      c.width,
    ]"
  >
    <!-- Logo: full on the panel, compact and centred on the rail -->
    <component
      :is="linkTag"
      v-bind="linkProps(homeTo)"
      :class="['flex items-center px-4 md:px-0 md:justify-center h-[72px] flex-shrink-0 transition-all duration-200 ease-out', c.logoPad]"
      :aria-label="homeLabel"
    >
      <span :class="[LABEL, c.label]"><slot name="logo" :collapsed="false" /></span>
      <span :class="['flex-shrink-0 animate-fade-in', c.railFlex]"><slot name="logo" :collapsed="true" /></span>
    </component>

    <!-- Collapse / expand (lg+) — a round chevron sitting on the panel's right edge -->
    <button
      type="button"
      class="hidden lg:flex absolute -right-3.5 top-[22px] z-10 w-7 h-7 rounded-full items-center justify-center bg-surface-2 border border-line text-fg-2 hover:text-fg hover:bg-surface-3 shadow-sm transition-colors"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :aria-expanded="!collapsed"
      :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="$emit('update:collapsed', !collapsed)"
    >
      <ChevronLeftIcon :class="['w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200', collapsed && 'rotate-180']" aria-hidden="true" />
    </button>

    <!-- Nav groups -->
    <nav :aria-label="navLabel" :class="['flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-2 py-2 space-y-5', c.navPad]">
      <div v-for="group in groups" :key="group.title" class="space-y-1">
        <p v-if="group.title" :class="c.groupTitle" class="px-3 pb-1.5 overflow-hidden whitespace-nowrap transition-all duration-200 ease-out text-[11px] font-extrabold uppercase tracking-[0.1em] text-fg-muted">
          {{ group.title }}
        </p>
        <div :class="c.rail" class="mx-2 mb-2 border-t border-line animate-fade-in" aria-hidden="true" />
        <component
          :is="linkTag"
          v-for="item in group.items"
          :key="item.to"
          v-bind="linkProps(item.to)"
          :class="navItemClass(item)"
          :aria-current="active(item) ? 'page' : undefined"
          :title="item.label"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span :class="[LABEL, c.label]">{{ item.label }}</span>
          <span
            v-if="item.tag != null"
            :class="c.tag"
            class="relative ml-auto h-[22px] rounded-md bg-surface-3 font-mono text-[11px] font-bold text-brand items-center whitespace-nowrap transition-all duration-200 ease-out"
          >
            {{ item.tag }}
            <span v-if="item.alert" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warning ring-2 ring-surface-1" :aria-label="item.alertLabel ?? 'Needs attention'" />
          </span>
          <!-- Rail: the tag shrinks to a dot on the icon -->
          <span
            v-if="item.tag != null || item.alert"
            :class="['absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-surface-1', item.alert ? 'bg-warning' : 'bg-brand', c.railDot]"
            aria-hidden="true"
          />
        </component>
      </div>
    </nav>

    <!-- Bottom: tools (e.g. Design System) and anything extra -->
    <div :class="['p-4 md:p-2 space-y-1 flex-shrink-0', c.bottomPad]">
      <template v-if="footerItems.length">
        <div class="mx-2 mb-2 border-t border-line" aria-hidden="true" />
        <nav :aria-label="toolsLabel" class="space-y-1">
          <component
            :is="linkTag"
            v-for="item in footerItems"
            :key="item.to"
            v-bind="linkProps(item.to)"
            :class="navItemClass(item)"
            :aria-current="active(item) ? 'page' : undefined"
            :title="item.label"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span :class="[LABEL, c.label]">{{ item.label }}</span>
          </component>
        </nav>
      </template>

      <slot name="bottom" :collapsed="collapsed" />

    </div>
  </aside>
</template>

<script setup>
import { computed, getCurrentInstance, resolveDynamicComponent } from 'vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

/**
 * groups:      [{ title, items: [{ to, label, icon, tag?, alert? }] }]
 *              tag = a short count/label on the right (a dot on the rail); alert = warning dot
 * footerItems: [{ to, label, icon }] — pinned to the bottom (tools, docs)
 * Links use <RouterLink> when the app has vue-router, plain <a> otherwise.
 */
const props = defineProps({
  groups:      { type: Array, required: true },
  footerItems: { type: Array, default: () => [] },
  /** v-model:collapsed — persist it in the app (e.g. localStorage) */
  collapsed:   { type: Boolean, default: false },
  /** (item) => boolean. Default: path match, '/' exact */
  isActive:    { type: Function, default: null },
  homeTo:      { type: String, default: '/' },
  homeLabel:   { type: String, default: 'Home' },
  navLabel:    { type: String, default: 'Main' },
  toolsLabel:  { type: String, default: 'Tools' },
  /** Hero gradient when open, solid indigo tint / deep indigo on the compact rail */
  brand:       { type: Boolean, default: false },
})
defineEmits(['update:collapsed'])

const instance = getCurrentInstance()
const router = instance?.appContext.config.globalProperties.$router
const linkTag = router ? resolveDynamicComponent('RouterLink') : 'a'
// RouterLink gets `to`, a plain <a> gets `href` — never both: a fallthrough href="undefined"
// would overwrite the one RouterLink renders (no pointer, no open-in-new-tab)
const linkProps = (to) => (linkTag === 'a' ? { href: to } : { to })

function active(item) {
  if (!item.to) return false
  if (props.isActive) return props.isActive(item)
  const path = router?.currentRoute.value.path ?? window.location.pathname
  return item.to === '/' ? path === '/' : path.startsWith(item.to)
}

// Responsive class sets. md is always the icon rail; lg is full unless collapsed.
// On lg, labels stay in the DOM and animate width/opacity so collapsing feels fluid
// (display toggles can't transition). Full literal strings so Tailwind's scanner sees them.
const LABEL = 'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out'

const c = computed(() => props.collapsed
  ? {
      width: 'w-64 md:w-16',
      label: 'block md:hidden lg:block lg:max-w-0 lg:opacity-0',
      tag: 'flex px-2 md:hidden lg:flex lg:max-w-0 lg:px-0 lg:opacity-0 lg:overflow-hidden',
      railDot: 'hidden md:block',
      groupTitle: 'block md:hidden lg:block lg:max-h-0 lg:pb-0 lg:opacity-0',
      rail: 'hidden md:block',
      railFlex: 'hidden md:flex',
      itemGap: 'gap-3 md:gap-0',
      logoPad: '',
      navPad: '',
      bottomPad: '',
      justify: '',
    }
  : {
      width: 'w-64 md:w-16 lg:w-64',
      label: 'block md:hidden lg:block lg:max-w-[208px] lg:opacity-100',
      tag: 'flex px-2 md:hidden lg:flex lg:max-w-[48px] lg:opacity-100',
      railDot: 'hidden md:block lg:hidden',
      groupTitle: 'block md:hidden lg:block lg:max-h-8 lg:opacity-100',
      rail: 'hidden md:block lg:hidden',
      railFlex: 'hidden md:flex lg:hidden',
      itemGap: 'gap-3 md:gap-0 lg:gap-3',
      logoPad: 'lg:px-6 lg:justify-start', // rail: centred mark; open panel: full logo from the left
      navPad: 'lg:px-4',
      bottomPad: 'lg:p-4',
      justify: 'lg:justify-start',
    })

function navItemClass(item) {
  return [
    'relative flex items-center h-11 px-3 md:justify-center rounded-xl text-[15px] font-bold transition-all duration-200 ease-out',
    c.value.justify,
    c.value.itemGap,
    active(item)
      ? 'bg-surface-2 text-fg ring-1 ring-inset ring-line [&>svg]:text-brand'
      : 'text-fg-2 hover:bg-surface-2 hover:text-fg',
  ]
}
</script>
