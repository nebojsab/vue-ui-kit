<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <AppSegmentControl v-model="width" :options="SIZES" size="sm" aria-label="Preview width" />
      <a :href="src" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
        Open full screen <ArrowTopRightOnSquareIcon class="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
    <div class="rounded-card border border-line bg-surface-2 p-2 sm:p-3 overflow-hidden">
      <!-- Browser-ish frame; the iframe width drives the template's breakpoints -->
      <div class="mx-auto transition-[max-width] duration-300 ease-out" :style="{ maxWidth: width === 'full' ? '100%' : `${width}px` }">
        <div class="flex items-center gap-1.5 px-3 h-8 rounded-t-xl bg-surface-3/70 border border-b-0 border-line">
          <span class="w-2.5 h-2.5 rounded-full bg-danger/60" /><span class="w-2.5 h-2.5 rounded-full bg-warning/60" /><span class="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <iframe
          :key="src"
          :src="src"
          :title="`${title} template preview`"
          loading="lazy"
          class="block w-full rounded-b-xl border border-line bg-page"
          :style="{ height: `${height}px` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import AppSegmentControl from '@ds/components/AppSegmentControl.vue'

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, required: true },
  height: { type: Number, default: 760 },
})

const SIZES = [
  { label: 'Desktop', value: 'full' },
  { label: 'Tablet', value: 820 },
  { label: 'Phone', value: 390 },
]
const width = ref('full')

// Follow the docs theme toggle
const dark = ref(document.documentElement.classList.contains('dark'))
let mo
onMounted(() => {
  mo = new MutationObserver(() => { dark.value = document.documentElement.classList.contains('dark') })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
onBeforeUnmount(() => mo?.disconnect())

const src = computed(() => `${import.meta.env.BASE_URL}preview/${props.name}?theme=${dark.value ? 'dark' : 'light'}`)
</script>
