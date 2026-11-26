<template>
  <div>
    <div
      role="tablist"
      :aria-label="ariaLabel"
      :class="variant === 'pills'
        ? 'inline-flex max-w-full gap-1 p-1 rounded-control bg-surface-2 border border-line overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        : 'flex gap-1 border-b border-line overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'"
      @keydown="onKeydown"
    >
      <button
        v-for="(tab, i) in tabs"
        :id="`${uid}-tab-${tab.value}`"
        :key="tab.value"
        :ref="(el) => (buttons[i] = el)"
        type="button"
        role="tab"
        :aria-selected="active === tab.value"
        :aria-controls="`${uid}-panel-${tab.value}`"
        :tabindex="active === tab.value ? 0 : -1"
        :disabled="tab.disabled"
        :class="[
          'flex items-center gap-2 whitespace-nowrap font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
          variant === 'pills'
            ? ['h-9 px-3.5 rounded-[10px] text-sm', active === tab.value ? 'bg-surface-1 text-fg shadow-sm ring-1 ring-line' : 'text-fg-2 hover:text-fg']
            : ['relative h-11 px-4 -mb-px text-[15px] border-b-2', active === tab.value ? 'border-brand text-fg' : 'border-transparent text-fg-2 hover:text-fg hover:border-line'],
        ]"
        @click="select(tab.value)"
      >
        <component :is="tab.icon" v-if="tab.icon" :class="['w-[18px] h-[18px]', active === tab.value && 'text-brand']" aria-hidden="true" />
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined && tab.count !== null"
          class="min-w-[20px] h-5 px-1.5 rounded-md text-xs font-bold tabular flex items-center justify-center bg-surface-3 text-fg-2"
        >{{ tab.count }}</span>
      </button>
    </div>

    <div
      v-for="tab in tabs"
      v-show="active === tab.value"
      :id="`${uid}-panel-${tab.value}`"
      :key="tab.value"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-${tab.value}`"
      tabindex="0"
      :class="['outline-none', panelClass]"
    >
      <slot :name="tab.value" :tab="tab">
        <slot :tab="tab" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useId } from 'vue'

/**
 * Tabs with their panels (WAI-ARIA tabs pattern). Each panel is a named slot
 * matching the tab's value; the default slot gets { tab } as a fallback.
 * Arrow keys / Home / End move between tabs; disabled tabs are skipped.
 * For tabs that only switch a view (no panels), use AppViewTabs.
 */
const props = defineProps({
  /** Active tab value (v-model). Falls back to the first enabled tab. */
  modelValue: { type: String, default: null },
  /** [{ value, label, icon?, count?, disabled? }] */
  tabs: { type: Array, required: true },
  /** 'underline' | 'pills' */
  variant: { type: String, default: 'underline' },
  ariaLabel: { type: String, default: null },
  /** Classes for each panel */
  panelClass: { type: String, default: 'pt-5' },
})
const emit = defineEmits(['update:modelValue'])

const uid = `tb${useId().replace(/[^a-zA-Z0-9]/g, '')}`
const buttons = ref([])
const local = ref(null)
const active = computed(() => props.modelValue ?? local.value ?? props.tabs.find((t) => !t.disabled)?.value)

function select(value) {
  local.value = value
  emit('update:modelValue', value)
}

function onKeydown(e) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
  e.preventDefault()
  const enabled = props.tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0)
  const at = enabled.indexOf(props.tabs.findIndex((t) => t.value === active.value))
  const last = enabled.length - 1
  const next = enabled[{ ArrowLeft: at <= 0 ? last : at - 1, ArrowRight: at >= last ? 0 : at + 1, Home: 0, End: last }[e.key]]
  select(props.tabs[next].value)
  buttons.value[next]?.focus()
}
</script>
