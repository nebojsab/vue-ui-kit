<template>
  <div class="min-h-screen bg-page">
    <header class="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur-md">
      <div class="max-w-screen-2xl mx-auto h-[72px] px-4 sm:px-8 flex items-center gap-4">
        <RouterLink to="/" class="flex items-center gap-4" aria-label="Design System home">
          <!-- Full logo from md, the mark on phones -->
          <KitLogo class="max-md:hidden h-8 text-fg" />
          <KitLogo variant="mark" class="md:hidden h-9" />
          <span class="h-5 w-px bg-line" aria-hidden="true" />
          <span class="text-sm font-bold whitespace-nowrap">Design System</span>
        </RouterLink>
        <AppBadge color="brand" size="xs">v{{ version }}</AppBadge>
        <div class="flex-1" />
        <a href="https://github.com/nebojsab/vue-ui-kit" class="icon-btn" aria-label="Source on GitHub" title="Source on GitHub">
          <CodeBracketIcon class="w-[18px] h-[18px]" />
        </a>
        <button type="button" class="icon-btn" :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'" @click="dark = !dark">
          <SunIcon v-if="dark" class="w-4 h-4" /><MoonIcon v-else class="w-4 h-4" />
        </button>
      </div>
    </header>
    <main class="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8">
      <slot />
    </main>
    <AppToaster />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SunIcon, MoonIcon, CodeBracketIcon } from '@heroicons/vue/24/outline'
import { AppBadge, AppToaster, KitLogo } from '@nebojsab/vue-ui-kit'
import pkg from '../../package.json'

const version = pkg.version
// Dark by default, like the apps; a saved choice wins
const dark = ref((() => { try { return (localStorage.getItem('uikit-theme') ?? 'dark') === 'dark' } catch { return true } })())
watch(dark, (v) => {
  document.documentElement.classList.toggle('dark', v)
  try { localStorage.setItem('uikit-theme', v ? 'dark' : 'light') } catch {}
}, { immediate: true })
</script>

<style scoped>
.icon-btn {
  @apply w-11 h-11 flex items-center justify-center rounded-control text-fg-2 bg-surface-1 border border-line hover:bg-surface-2 hover:text-fg transition-colors;
}
</style>
