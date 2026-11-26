<template>
  <!-- Vue UI Kit logo. 'full' = mark + wordmark (letters follow currentColor — set text-fg),
       'mark' = the gradient square only (compact rail, phone header, favicon). Size it with h-*. -->
  <svg
    :viewBox="variant === 'mark' ? '0 0 32 32' : '0 0 132 32'"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="label"
    :class="variant === 'mark' && 'aspect-square'"
  >
    <defs>
      <linearGradient :id="`${uid}-g`" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#4F46E5" />
        <stop offset="1" stop-color="#A855F7" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" :fill="`url(#${uid}-g)`" />
    <rect x="8" y="8" width="9.5" height="9.5" rx="2.5" fill="#fff" />
    <rect x="14.5" y="14.5" width="9.5" height="9.5" rx="2.5" fill="#fff" fill-opacity=".6" />
    <text
      v-if="variant !== 'mark'"
      x="42" y="22.5"
      fill="currentColor"
      font-family="Inter, ui-sans-serif, system-ui, sans-serif"
      font-size="17" font-weight="700" letter-spacing="-0.3"
    >{{ label }}</text>
  </svg>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  /** 'full' (mark + name) | 'mark' (square only) */
  variant: { type: String, default: 'full' },
  /** Name shown next to the mark, and the accessible label */
  label: { type: String, default: 'UI Kit' },
})

// Unique gradient id per instance — duplicate ids break gradients when one copy is hidden
const uid = `kl${useId().replace(/[^a-zA-Z0-9]/g, '')}`
</script>
