<template>
  <!-- "Swoosh" (light trails): a beam rising on the diagonal, bottom left → top right,
       below the copy. Light and dark have their own look:
         light — a white beam with a soft white/indigo halo over an indigo and pink wash
         dark  — a white-hot core with a violet/blue glow over an indigo corner
       Static, fixed colours. Put it absolutely inside a relative, overflow-hidden bg-brand-hero
       panel and keep the copy in the top two thirds — the beam runs below it. -->
  <svg
    viewBox="0 0 600 800"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
    class="pointer-events-none select-none"
  >
    <defs>
      <!-- Along the beam (left → right): fades in from the corner, full in the middle, fades out -->
      <linearGradient :id="`${uid}-core`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0" />
        <stop offset=".25" stop-color="#fff" />
        <stop offset=".85" stop-color="#fff" />
        <stop offset="1" stop-color="#fff" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="`${uid}-violet`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#C04BD8" stop-opacity="0" />
        <stop offset=".3" stop-color="#C04BD8" />
        <stop offset=".65" stop-color="#8B6BFF" />
        <stop offset="1" stop-color="#4F6BFF" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="`${uid}-halo`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#EEF2FF" stop-opacity="0" />
        <stop offset=".3" stop-color="#fff" />
        <stop offset=".8" stop-color="#E0E7FF" />
        <stop offset="1" stop-color="#E0E7FF" stop-opacity="0" />
      </linearGradient>
      <filter :id="`${uid}-wide`" x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <filter :id="`${uid}-soft`" x="-20%" y="-60%" width="140%" height="220%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <radialGradient :id="`${uid}-cyan`" cx="1" cy="1" r=".75">
        <stop offset="0" stop-color="#6366F1" stop-opacity=".6" />
        <stop offset="1" stop-color="#6366F1" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="`${uid}-cyan-strong`" cx="1" cy=".95" r=".95">
        <stop offset="0" stop-color="#6366F1" stop-opacity=".9" />
        <stop offset=".55" stop-color="#818CF8" stop-opacity=".4" />
        <stop offset="1" stop-color="#6366F1" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="`${uid}-yellow`" cx="0" cy="1" r=".7">
        <stop offset="0" stop-color="#F9A8D4" stop-opacity=".55" />
        <stop offset="1" stop-color="#F9A8D4" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Light: indigo bottom right, pink bottom left, a white beam with a pale halo -->
    <g class="dark:hidden">
      <rect width="600" height="800" :fill="`url(#${uid}-cyan-strong)`" />
      <rect width="600" height="800" :fill="`url(#${uid}-yellow)`" />
      <g v-for="(s, i) in STRANDS" :key="i" :opacity="s.opacity">
        <path :d="s.d" :stroke="`url(#${uid}-halo)`" stroke-width="60" stroke-linecap="round" :filter="`url(#${uid}-wide)`" />
        <path :d="s.d" :stroke="`url(#${uid}-halo)`" stroke-width="16" stroke-linecap="round" :filter="`url(#${uid}-soft)`" />
        <path :d="s.d" :stroke="`url(#${uid}-core)`" :stroke-width="s.core * 2.2" stroke-linecap="round" />
      </g>
    </g>

    <!-- Dark: indigo corner, a white-hot core with a violet glow -->
    <g class="hidden dark:inline">
      <rect width="600" height="800" :fill="`url(#${uid}-cyan)`" opacity=".8" />
      <g v-for="(s, i) in STRANDS" :key="i" :opacity="s.opacity">
        <path :d="s.d" :stroke="`url(#${uid}-violet)`" stroke-width="36" stroke-linecap="round" :filter="`url(#${uid}-wide)`" opacity=".8" />
        <path :d="s.d" :stroke="`url(#${uid}-violet)`" stroke-width="9" stroke-linecap="round" :filter="`url(#${uid}-soft)`" />
        <path :d="s.d" :stroke="`url(#${uid}-core)`" :stroke-width="s.core" stroke-linecap="round" />
      </g>
    </g>
  </svg>
</template>

<script setup>
import { useId } from 'vue'

// Strands of one beam, rising from the bottom edge to the right edge — between the copy
// and the footer, so neither is crossed. The first is the brightest.
const STRANDS = [
  { d: 'M 110 900 C 320 770 480 650 690 470', core: 3, opacity: 1 },
  { d: 'M 140 910 C 345 785 505 670 700 500', core: 1.5, opacity: 0.6 },
  { d: 'M 80 890 C 295 755 455 630 680 440', core: 1.1, opacity: 0.4 },
]
const uid = `bs${useId().replace(/[^a-zA-Z0-9]/g, '')}`
</script>
