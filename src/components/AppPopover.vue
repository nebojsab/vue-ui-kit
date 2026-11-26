<template>
  <div ref="root" class="relative inline-flex">
    <slot name="trigger" :open="open" :toggle="toggle" />
    <!-- Teleported with fixed coordinates: modals and scrolling cards can't clip it,
         and it opens above the trigger when there's no room below -->
    <Teleport to="body">
      <Transition :name="placement === 'top' ? 'pop-up' : 'pop'">
        <div
          v-if="open"
          ref="panel"
          role="dialog"
          :aria-label="label"
          :class="[
            'z-[90] rounded-2xl border border-line bg-surface-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] p-5 overflow-y-auto scroll-thin',
            widthClass,
          ]"
          :style="{ ...style, maxHeight: `${maxHeight}px` }"
          @keydown.esc.stop="close"
        >
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useFloating } from '../utils/floating.js'

/** Click-to-open panel (filters, menus, help). Closes on outside click and Esc. */
const props = defineProps({
  label: { type: String, default: null },
  /** 'start' | 'end' — which edge of the trigger the panel lines up with */
  align: { type: String, default: 'start' },
  widthClass: { type: String, default: 'w-80' },
})

const root = ref(null)
const panel = ref(null)
const open = ref(false)
const { style, placement, maxHeight, update, start, stop } = useFloating(root, { align: props.align })

const toggle = () => { open.value = !open.value }
const close = () => { open.value = false }

watch(open, async (v) => {
  if (!v) return stop()
  start()
  await nextTick()
  // Width comes from widthClass — measure it once rendered so align/edges are exact
  const w = panel.value?.offsetWidth
  if (w) {
    const r = root.value.getBoundingClientRect()
    const left = props.align === 'end' ? r.right - w : r.left
    style.value = { ...style.value, left: `${Math.round(Math.min(Math.max(12, left), window.innerWidth - w - 12))}px`, right: 'auto' }
  }
})

function onDoc(e) {
  if (!open.value) return
  if (root.value?.contains(e.target) || panel.value?.contains(e.target)) return
  close()
}
// Esc from inside a modal closes the popover first, not the modal
function onKey(e) { if (open.value && e.key === 'Escape') { e.stopPropagation(); close() } }
onMounted(() => {
  document.addEventListener('mousedown', onDoc)
  document.addEventListener('keydown', onKey, true)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onDoc)
  document.removeEventListener('keydown', onKey, true)
})

defineExpose({ close, update })
</script>

<style scoped>
.pop-enter-active, .pop-leave-active,
.pop-up-enter-active, .pop-up-leave-active { transition: opacity 0.15s ease, translate 0.15s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; translate: 0 -4px; }
.pop-up-enter-from, .pop-up-leave-to { opacity: 0; translate: 0 4px; }
</style>
