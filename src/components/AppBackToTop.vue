<template>
  <!-- Back to top — appears once you've scrolled a screen or so down a long page -->
  <Transition name="btt">
    <button
      v-if="visible"
      type="button"
      :class="[
        preview ? 'absolute right-4 bottom-4' : 'fixed right-4 sm:right-8',
        'z-30 w-12 h-12 rounded-full bg-surface-2 border border-line text-fg',
        'shadow-[0_12px_30px_-10px_rgb(0_0_0/0.6)] flex items-center justify-center',
        'hover:bg-surface-3 hover:border-brand/50 hover:text-brand transition-colors',
        !preview && offsetClass,
      ]"
      :aria-label="label"
      :title="label"
      @click="toTop"
    >
      <ChevronUpIcon class="w-5 h-5 stroke-[2.5]" />
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUpIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  /** The scrolling element, or a selector for it. Default: the app shell's <main>, else the window */
  target:      { type: [Object, String], default: 'main' },
  /** Show after this many pixels */
  offset:      { type: Number, default: 700 },
  label:       { type: String, default: 'Back to top' },
  /** Bottom position — clear a phone bottom bar by default */
  offsetClass: { type: String, default: 'bottom-[calc(6rem+env(safe-area-inset-bottom))] md:bottom-8' },
  /** Docs / previews: sit in the bottom-right of the nearest positioned box instead of the viewport */
  preview:     { type: Boolean, default: false },
})
/** update:visible — e.g. to lift toasts out of the corner while the button shows */
const emit = defineEmits(['update:visible'])

const visible = ref(false)
let el = null
const scrollTop = () => (el === window ? window.scrollY : el.scrollTop)
function onScroll() {
  const v = scrollTop() > props.offset
  if (v !== visible.value) emit('update:visible', (visible.value = v))
}
function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
onMounted(() => {
  el = typeof props.target === 'string' ? document.querySelector(props.target) ?? window : props.target ?? window
  el.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => el?.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.btt-enter-active, .btt-leave-active { transition: opacity .2s ease, transform .2s cubic-bezier(.2,.8,.2,1); }
.btt-enter-from, .btt-leave-to { opacity: 0; transform: translateY(8px) scale(.9); }
</style>
