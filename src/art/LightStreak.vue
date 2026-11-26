<template>
  <!-- "Light streak": a white-hot core with a violet/pink glow, fading at both
       ends. Decorative art — fixed colours, not theme tokens. -->
  <svg
    viewBox="0 0 1000 400"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    class="pointer-events-none select-none"
  >
    <defs>
      <linearGradient :id="`${uid}-fade`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset=".35" stop-color="#fff" stop-opacity="1" />
        <stop offset=".85" stop-color="#fff" stop-opacity="1" />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="`${uid}-glow`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6D5BFF" stop-opacity="0" />
        <stop offset=".4" stop-color="#8B6BFF" />
        <stop offset=".8" stop-color="#C04BD8" />
        <stop offset="1" stop-color="#EC4899" stop-opacity="0" />
      </linearGradient>
      <filter :id="`${uid}-blur`" x="-10%" y="-50%" width="120%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>

    <g v-for="(d, i) in paths" :key="i" :opacity="i === 0 ? 1 : 0.55">
      <path :d="d" :stroke="`url(#${uid}-glow)`" stroke-width="22" stroke-linecap="round" :filter="`url(#${uid}-blur)`" opacity=".9" />
      <path :d="d" :stroke="`url(#${uid}-glow)`" stroke-width="6" stroke-linecap="round" opacity=".9" />
      <path :d="d" :stroke="`url(#${uid}-fade)`" stroke-width="2" stroke-linecap="round" />
    </g>
  </svg>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  /** One or more SVG path strings in a 1000×400 box; the first is the brightest */
  paths: {
    type: Array,
    default: () => [
      'M -40 390 C 320 375 640 300 1040 90',
      'M -40 420 C 360 400 700 330 1040 150',
    ],
  },
})
const uid = `ls${useId().replace(/[^a-zA-Z0-9]/g, '')}`
</script>
