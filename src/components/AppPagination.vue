<template>
  <nav :aria-label="ariaLabel" class="flex flex-wrap items-center justify-between gap-3">
    <p v-if="showSummary" class="text-sm text-fg-muted tabular" aria-live="polite">
      {{ from }}–{{ to }} of {{ total }}
    </p>
    <ul class="flex items-center gap-1">
      <li>
        <button type="button" :class="[btn, idle, 'px-2']" :disabled="modelValue <= 1" aria-label="Previous page" @click="go(modelValue - 1)">
          <ChevronLeftIcon class="w-4 h-4" aria-hidden="true" />
        </button>
      </li>
      <!-- Phones: "3 / 12"; sm and up: page numbers -->
      <li class="sm:hidden px-2 text-sm text-fg-2 tabular" aria-current="page">{{ modelValue }} / {{ pageCount }}</li>
      <li v-for="(p, i) in pages" :key="i" class="hidden sm:block">
        <span v-if="p === '…'" class="w-9 h-9 flex items-center justify-center text-fg-muted" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          :class="[btn, p === modelValue ? 'bg-brand text-brand-on border-brand hover:bg-brand-hover' : idle]"
          :aria-current="p === modelValue ? 'page' : undefined"
          :aria-label="`Page ${p}`"
          @click="go(p)"
        >{{ p }}</button>
      </li>
      <li>
        <button type="button" :class="[btn, idle, 'px-2']" :disabled="modelValue >= pageCount" aria-label="Next page" @click="go(modelValue + 1)">
          <ChevronRightIcon class="w-4 h-4" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

/**
 * Page numbers for long lists and tables. Keeps first, last and the pages around
 * the current one; gaps become "…". On phones it shrinks to "3 / 12".
 * For feeds that load as you scroll, use useInfiniteList instead.
 */
const props = defineProps({
  /** Current page, 1-based (v-model) */
  modelValue: { type: Number, default: 1 },
  /** Total number of items */
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 20 },
  /** Pages shown on each side of the current one */
  siblings: { type: Number, default: 1 },
  /** "21–40 of 312" on the left */
  showSummary: { type: Boolean, default: true },
  ariaLabel: { type: String, default: 'Pagination' },
})
const emit = defineEmits(['update:modelValue'])

const btn = 'min-w-9 h-9 px-2.5 rounded-lg border text-sm font-semibold tabular transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center'
const idle = 'border-line bg-surface-1 text-fg-2 hover:bg-surface-2 hover:text-fg'

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const from = computed(() => (props.total ? (props.modelValue - 1) * props.pageSize + 1 : 0))
const to = computed(() => Math.min(props.total, props.modelValue * props.pageSize))

const pages = computed(() => {
  const n = pageCount.value
  const cur = props.modelValue
  const lo = Math.max(2, cur - props.siblings)
  const hi = Math.min(n - 1, cur + props.siblings)
  const out = [1]
  if (lo > 2) out.push(lo === 3 ? 2 : '…')
  for (let p = lo; p <= hi; p++) out.push(p)
  if (hi < n - 1) out.push(hi === n - 2 ? n - 1 : '…')
  if (n > 1) out.push(n)
  return out
})

function go(p) {
  const next = Math.min(Math.max(1, p), pageCount.value)
  if (next !== props.modelValue) emit('update:modelValue', next)
}
</script>
