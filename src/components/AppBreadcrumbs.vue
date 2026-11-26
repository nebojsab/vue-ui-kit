<template>
  <nav :aria-label="ariaLabel">
    <ol class="flex flex-wrap items-center gap-1 text-sm">
      <template v-for="(item, i) in shown" :key="i">
        <li v-if="i > 0" aria-hidden="true" class="text-fg-muted">
          <ChevronRightIcon class="w-3.5 h-3.5" />
        </li>
        <li class="min-w-0">
          <button
            v-if="item.collapsed"
            type="button"
            class="px-1.5 h-7 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors"
            :aria-label="`Show ${hiddenCount} more`"
            @click="expanded = true"
          >…</button>
          <span
            v-else-if="i === shown.length - 1"
            aria-current="page"
            class="flex items-center gap-1.5 px-1 font-semibold text-fg truncate max-w-[16rem]"
          >
            <component :is="item.icon" v-if="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />{{ item.label }}
          </span>
          <component
            :is="item.to && linkTag !== 'a' ? linkTag : 'a'"
            v-else
            v-bind="item.to && linkTag !== 'a' ? { to: item.to } : { href: item.href ?? item.to }"
            class="flex items-center gap-1.5 px-1 rounded-md text-fg-2 hover:text-brand transition-colors truncate max-w-[12rem]"
          >
            <component :is="item.icon" v-if="item.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />{{ item.label }}
          </component>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup>
import { ref, computed, getCurrentInstance, resolveDynamicComponent } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

/**
 * Where you are in a hierarchy. The last item is the current page (not a link).
 * Long trails collapse the middle into "…", which expands on click.
 * Links use <RouterLink> when the app has vue-router, plain <a> otherwise.
 */
const props = defineProps({
  /** [{ label, to?, href?, icon? }] — first is the root, last is the current page */
  items: { type: Array, required: true },
  /** Collapse the middle when there are more items than this (0 = never) */
  maxItems: { type: Number, default: 4 },
  ariaLabel: { type: String, default: 'Breadcrumb' },
})

const instance = getCurrentInstance()
const router = instance?.appContext.config.globalProperties.$router
const linkTag = router ? resolveDynamicComponent('RouterLink') : 'a'

const expanded = ref(false)
const hiddenCount = computed(() => props.items.length - 3)
const shown = computed(() => {
  const all = props.items
  if (expanded.value || !props.maxItems || all.length <= props.maxItems) return all
  return [all[0], { collapsed: true }, ...all.slice(-2)]
})
</script>
