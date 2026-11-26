<template>
  <AppLayout>
    <div class="flex gap-8 min-h-screen">

      <!-- ── Sticky left sidebar ─────────────────────────────────────────── -->
      <aside class="hidden lg:flex flex-col w-52 flex-shrink-0">
        <div class="sticky-aside scroll-thin w-full space-y-1 pr-1">
          <div class="mb-4 px-3">
            <p class="text-overline text-brand">Open source</p>
            <p class="text-sm font-semibold text-fg mt-0.5">Design System</p>
            <p class="text-xs text-subtle mt-0.5">Vue 3 + Tailwind CSS</p>
          </div>

          <div v-for="group in navGroups" :key="group.label" class="mb-3">
            <p class="text-xs text-subtle uppercase tracking-widest font-semibold px-3 mb-1">{{ group.label }}</p>
            <router-link
              v-for="item in group.items"
              :key="item.slug"
              :to="'/' + item.slug"
              class="block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all text-subtle hover:text-fg hover:bg-surface-2"
            >{{ item.label }}</router-link>
          </div>

          <div class="px-3 pt-3 mt-2 border-t border-line">
            <AppBadge color="brand" size="xs">v{{ version }} · {{ componentCount }} components</AppBadge>
          </div>
        </div>
      </aside>

      <!-- ── Main content — index grid ─────────────────────────────────────── -->
      <main class="flex-1 min-w-0 pb-24">

        <!-- Header -->
        <div class="flex items-start justify-between mb-2">
          <div>
            <h1 class="font-display font-bold text-[28px] sm:text-[34px] tracking-tight">Design System</h1>
            <p class="text-sm text-subtle mt-1">Vue 3 + Tailwind CSS component library · light and dark themes</p>
          </div>
          <AppBadge color="brand">v{{ version }}</AppBadge>
        </div>

        <!-- Quick stats -->
        <div class="flex flex-wrap gap-x-4 gap-y-1 mb-8 text-xs text-subtle [&>span]:whitespace-nowrap">
          <span>{{ componentCount }} components · 6 foundations · 3 composables</span>
          <span>·</span>
          <span>Dark / Light mode</span>
          <span>·</span>
          <span>WCAG AA</span>
          <span>·</span>
          <span>Live theming</span>
        </div>

        <!-- Groups -->
        <div class="space-y-10">
          <div v-for="group in navGroups" :key="group.label">
            <p class="text-overline text-subtle mb-3">{{ group.label }}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <router-link
                v-for="item in group.items"
                :key="item.slug"
                :to="'/' + item.slug"
                class="group flex items-center gap-3 p-4 rounded-xl border border-line bg-surface-1 hover:border-brand/50 hover:bg-surface-2  transition-all"
              >
                <!-- Color dot -->
                <div
                  class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm"
                  :style="{ background: item.color + '22', color: item.color }"
                >{{ item.icon }}</div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-fg group-hover:text-brand transition-colors">{{ item.label }}</p>
                  <p class="text-xs text-subtle truncate mt-0.5">{{ item.description }}</p>
                </div>
                <svg class="w-4 h-4 text-fg-muted group-hover:text-brand ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </div>
          </div>
        </div>

      </main>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../DocsLayout.vue'
import pkg from '../../../package.json'

const version = pkg.version
import AppBadge from '@ds/components/AppBadge.vue'
import { navGroups, componentCount } from '../nav'

</script>
