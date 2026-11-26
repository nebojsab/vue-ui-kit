<template>
  <div class="relative inline-flex group/tip">
    <slot />
    <div
      role="tooltip"
      :class="[
        'absolute z-50 px-2 py-1 text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none',
        'bg-surface-3 text-fg border border-line shadow-lg',
        'opacity-0 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 transition-opacity duration-150',
        positionClass,
      ]"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  /** 'top' | 'bottom' | 'left' | 'right' */
  position: { type: String, default: 'top' },
  /** For top/bottom: 'center' | 'start' (left edges line up) | 'end' (right edges line up — near the right edge of a card) */
  align: { type: String, default: 'center' },
})

const ALIGN = { center: 'left-1/2 -translate-x-1/2', start: 'left-0', end: 'right-0' }

const positionClass = computed(() => {
  const x = ALIGN[props.align] ?? ALIGN.center
  return {
    top: `bottom-full mb-2 ${x}`,
    bottom: `top-full mt-2 ${x}`,
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[props.position] ?? `bottom-full mb-2 ${x}`
})
</script>
