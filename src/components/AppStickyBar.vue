<template>
  <!-- Sticks to the top of the scroller. Once stuck it gets a backdrop + shadow, and the
       `stuck` slot shows — e.g. filters set further up the page, following along as chips. -->
  <div ref="sentinel" aria-hidden="true" />
  <div
    ref="bar"
    v-bind="$attrs"
    :class="[
      'sticky z-10 transition-[background-color,box-shadow,border-color] duration-200 border-b',
      bleedClass,
      stuck ? 'bg-page/90 backdrop-blur-md border-line shadow-[0_12px_24px_-18px_rgb(0_0_0/0.6)]' : 'border-transparent',
    ]"
    :style="{ top: `${top}px` }"
  >
    <slot :stuck="stuck" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStuck } from '../composables/useStuck.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Offset from the top of the scroller (px) */
  top:       { type: Number, default: 0 },
  /** The scrolling element or a selector. Default: the app shell's <main> */
  scroller:  { type: [Object, String], default: 'main' },
  /** Padding / negative margins so the backdrop spans the page gutter */
  bleedClass: { type: String, default: '-mx-4 sm:-mx-8 px-4 sm:px-8 py-3' },
})
const emit = defineEmits(['update:height'])
const { sentinel, stuck } = useStuck({ scroller: props.scroller })
const bar = ref(null)

// The bar's height (it changes with wrapping / breakpoints) — v-model:height, so headers
// or a side column can stick right under it: :style="{ top: `${height}px` }"
const height = ref(0)
let observer
function setHeight(px) {
  if (px === height.value) return
  height.value = px
  emit('update:height', px)
}
onMounted(() => {
  if (!bar.value) return
  setHeight(bar.value.offsetHeight) // right away — the observer only reports on the next frame
  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(([e]) => setHeight(Math.round(e.borderBoxSize?.[0]?.blockSize ?? e.target.offsetHeight)))
  observer.observe(bar.value)
})
onUnmounted(() => observer?.disconnect())

/** bar: the sticky element · height: its current height in px · stuck: whether it's stuck */
defineExpose({ stuck, bar, height })
</script>
