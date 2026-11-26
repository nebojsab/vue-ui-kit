<template>
  <!-- A count that filters: click to show only these, click again (×) to clear.
       Zero is muted and not clickable — it would only lead to an empty list. -->
  <button
    type="button"
    :aria-pressed="active"
    :disabled="muted"
    :title="active ? 'Click to clear' : undefined"
    :class="[
      'relative w-full h-full text-left rounded-2xl border p-4 transition-all',
      active
        ? 'bg-brand/10 border-brand/60 ring-1 ring-inset ring-brand/40'
        : muted
          ? 'bg-transparent border-line border-dashed opacity-60 cursor-default'
          : 'bg-surface-1 border-line hover:border-brand/40 hover:bg-surface-2',
    ]"
  >
    <XMarkIcon v-if="active" class="absolute top-3 right-3 w-4 h-4 text-fg-2" aria-hidden="true" />
    <span :class="['block text-overline leading-snug min-h-[2.6em] pr-5', active ? 'text-brand' : 'text-fg-muted']">{{ label }}</span>
    <span class="block font-display font-bold text-[30px] leading-tight tabular mt-1">{{ value }}</span>
    <span v-if="sublabel" class="block text-[13px] mt-0.5 text-fg-muted">{{ sublabel }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  label:    { type: String, required: true },
  value:    { type: [Number, String], default: 0 },
  sublabel: { type: String, default: null },
  active:   { type: Boolean, default: false },
  /** Mute and disable a zero (unless it's the active one) */
  muteZero: { type: Boolean, default: true },
})
const muted = computed(() => props.muteZero && !props.active && !Number(props.value))
</script>
