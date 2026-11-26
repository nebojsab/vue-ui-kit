<template>
  <!-- Any app's own logo as inline SVG, so letters can follow the text colour in light/dark.
       Feed it raw SVG strings; write gradient ids as LOGOID-… and each instance gets unique ids. -->
  <span class="inline-flex [&>svg]:h-full [&>svg]:w-auto" role="img" :aria-label="label" v-html="svg" />
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  /** Raw SVG strings (import '…/logo-wordmark.svg?raw') */
  wordmark: { type: String, required: true },
  mark: { type: String, required: true },
  /** 'wordmark' | 'mark' */
  variant: { type: String, default: 'wordmark' },
  label: { type: String, required: true },
})

// Unique gradient ids per instance — duplicate ids break gradients when one copy is hidden
const uid = `lg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
const svg = computed(() =>
  (props.variant === 'mark' ? props.mark : props.wordmark)
    .replaceAll('LOGOID', uid)
    .replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"'))
</script>
