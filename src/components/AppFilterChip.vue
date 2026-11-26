<template>
  <!-- Toggle filter chip. Off: neutral, the tone shows on the icon. On: soft tone fill + ×.
       Clicking again clears it — the chip itself is where the filter lives (no separate list). -->
  <button
    type="button"
    :aria-pressed="active"
    :title="active ? 'Click to clear' : undefined"
    :class="[
      'inline-flex items-center gap-2 rounded-full border font-bold whitespace-nowrap transition-colors',
      size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-9 px-3.5 text-[13px]',
      active ? TONE[tone].on : TONE[tone].off,
      // Tighter right side only when the × is there, so a chip without one keeps its width
      active && clearable && (size === 'sm' ? 'pr-2' : 'pr-2.5'),
    ]"
  >
    <component :is="icon" v-if="icon" :class="[size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4', TONE[tone].icon]" aria-hidden="true" />
    <slot>{{ label }}</slot>
    <XMarkIcon v-if="active && clearable" :class="[size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-fg-2']" aria-hidden="true" />
  </button>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  label:     { type: String, default: '' },
  active:    { type: Boolean, default: false },
  /** 'brand' | 'sales' | 'presales' | 'marketing' | 'vendor' | 'reseller' | 'enduser' | 'neutral' */
  tone:      { type: String, default: 'brand' },
  icon:      { type: [Object, Function], default: null },
  /** Show × while active */
  clearable: { type: Boolean, default: true },
  /** 'sm' (28px) | 'md' (36px) */
  size:      { type: String, default: 'md' },
})

// Full class strings so Tailwind keeps them
const TONE = {
  brand:     { off: 'border-line text-fg-2 hover:text-fg hover:border-brand/50',     on: 'bg-brand/15 border-brand/60 text-fg',         icon: 'text-brand' },
  sales:     { off: 'border-line text-fg-2 hover:text-fg hover:border-sales/50',     on: 'bg-sales/15 border-sales/60 text-fg',         icon: 'text-sales' },
  presales:  { off: 'border-line text-fg-2 hover:text-fg hover:border-presales/50',  on: 'bg-presales/15 border-presales/60 text-fg',   icon: 'text-presales' },
  marketing: { off: 'border-line text-fg-2 hover:text-fg hover:border-marketing/50', on: 'bg-marketing/15 border-marketing/60 text-fg', icon: 'text-marketing' },
  vendor:    { off: 'border-line text-fg-2 hover:text-fg hover:border-vendor/50',    on: 'bg-vendor/15 border-vendor/60 text-fg',       icon: 'text-vendor' },
  reseller:  { off: 'border-line text-fg-2 hover:text-fg hover:border-reseller/50',  on: 'bg-reseller/15 border-reseller/60 text-fg',   icon: 'text-reseller' },
  enduser:   { off: 'border-line text-fg-2 hover:text-fg hover:border-enduser/50',   on: 'bg-enduser/15 border-enduser/60 text-fg',     icon: 'text-enduser' },
  neutral:   { off: 'border-line text-fg-2 hover:text-fg hover:bg-surface-2',        on: 'bg-surface-3 border-line text-fg',            icon: 'text-fg-muted' },
}
</script>
