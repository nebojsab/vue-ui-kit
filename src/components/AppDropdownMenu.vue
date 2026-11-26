<template>
  <div ref="root" class="relative inline-flex">
    <slot name="trigger" :open="open" :toggle="toggle" :attrs="triggerAttrs">
      <button
        type="button"
        v-bind="triggerAttrs"
        class="h-10 px-3.5 inline-flex items-center gap-2 rounded-control border border-line bg-surface-1 text-sm font-semibold text-fg hover:bg-surface-2 transition-colors"
        @click="toggle"
      >
        {{ label }}
        <ChevronDownIcon :class="['w-4 h-4 text-fg-muted transition-transform', open && 'rotate-180']" aria-hidden="true" />
      </button>
    </slot>

    <Teleport to="body">
      <Transition :name="placement === 'top' ? 'menu-up' : 'menu'">
        <div
          v-if="open"
          :id="menuId"
          ref="panel"
          role="menu"
          :aria-label="label"
          :class="['z-[90] min-w-[12rem] rounded-xl border border-line bg-surface-1 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-y-auto scroll-thin', widthClass]"
          :style="{ ...style, maxHeight: `${maxHeight}px` }"
          @keydown="onKeydown"
        >
          <template v-for="(item, i) in items" :key="i">
            <div v-if="item.divider" role="separator" class="my-1.5 h-px bg-line" />
            <p v-else-if="item.heading" class="px-2.5 pt-2 pb-1 text-overline text-fg-muted">{{ item.heading }}</p>
            <button
              v-else
              :ref="(el) => (refs[i] = el)"
              type="button"
              role="menuitem"
              tabindex="-1"
              :disabled="item.disabled"
              :class="[
                'w-full flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-sm text-left outline-none transition-colors',
                'disabled:opacity-40 disabled:pointer-events-none',
                item.danger ? 'text-danger hover:bg-danger/10 focus:bg-danger/10' : 'text-fg hover:bg-surface-2 focus:bg-surface-2',
              ]"
              @click="choose(item)"
            >
              <component :is="item.icon" v-if="item.icon" :class="['w-[18px] h-[18px] flex-shrink-0', item.danger ? '' : 'text-fg-muted']" aria-hidden="true" />
              <span class="flex-1 truncate">{{ item.label }}</span>
              <kbd v-if="item.shortcut" class="ml-4 font-sans text-xs text-fg-muted tracking-wide">{{ item.shortcut }}</kbd>
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted, useId } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useFloating } from '../utils/floating.js'

/**
 * Menu of actions under a button (WAI-ARIA menu button). Opens with click, Enter,
 * Space or ArrowDown; arrows / Home / End move, typing jumps to a label, Esc closes
 * and returns focus. Teleported like AppPopover, so nothing clips it.
 * Custom trigger: <template #trigger="{ toggle, attrs }"><button v-bind="attrs" @click="toggle">…
 */
const props = defineProps({
  /** [{ label, icon?, shortcut?, danger?, disabled?, onClick? } | { divider: true } | { heading }] */
  items: { type: Array, required: true },
  /** Trigger text, and the menu's accessible name */
  label: { type: String, default: 'Actions' },
  /** 'start' | 'end' — which edge of the trigger the menu lines up with */
  align: { type: String, default: 'start' },
  widthClass: { type: String, default: '' },
})
const emit = defineEmits(['select'])

const root = ref(null)
const panel = ref(null)
const refs = ref([])
const open = ref(false)
const menuId = `dm${useId().replace(/[^a-zA-Z0-9]/g, '')}`
const { style, placement, maxHeight, start, stop } = useFloating(root, { align: props.align, minBelow: 200 })

const triggerAttrs = computed(() => ({
  'aria-haspopup': 'menu',
  'aria-expanded': open.value,
  'aria-controls': open.value ? menuId : undefined,
  onKeydown: (e) => {
    if (['ArrowDown', 'Enter', ' '].includes(e.key) && !open.value) { e.preventDefault(); openAt(0) }
    else if (e.key === 'ArrowUp' && !open.value) { e.preventDefault(); openAt(-1) }
  },
}))

const enabled = () => props.items.map((it, i) => (!it.divider && !it.heading && !it.disabled ? i : -1)).filter((i) => i >= 0)
const focusIndex = (i) => refs.value[i]?.focus()

async function openAt(which) {
  open.value = true
  await nextTick()
  const list = enabled()
  focusIndex(which === -1 ? list[list.length - 1] : list[0])
}
function toggle() { open.value ? close() : openAt(0) }
function close(returnFocus = true) {
  open.value = false
  if (returnFocus) root.value?.querySelector('[aria-haspopup]')?.focus()
}
function choose(item) {
  item.onClick?.()
  emit('select', item)
  close()
}

function onKeydown(e) {
  const list = enabled()
  const at = list.indexOf(refs.value.indexOf(document.activeElement))
  const go = (k) => { e.preventDefault(); focusIndex(list[k]) }
  if (e.key === 'ArrowDown') go(at >= list.length - 1 ? 0 : at + 1)
  else if (e.key === 'ArrowUp') go(at <= 0 ? list.length - 1 : at - 1)
  else if (e.key === 'Home') go(0)
  else if (e.key === 'End') go(list.length - 1)
  else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close() }
  else if (e.key === 'Tab') close(false)
  else if (e.key.length === 1 && /\S/.test(e.key)) {
    // Typeahead: next item whose label starts with the key
    const ch = e.key.toLowerCase()
    const order = [...list.slice(at + 1), ...list.slice(0, at + 1)]
    const hit = order.find((i) => props.items[i].label?.toLowerCase().startsWith(ch))
    if (hit !== undefined) focusIndex(hit)
  }
}

watch(open, (v) => (v ? start() : stop()))

function onDoc(e) {
  if (!open.value) return
  if (root.value?.contains(e.target) || panel.value?.contains(e.target)) return
  close(false)
}
onMounted(() => document.addEventListener('mousedown', onDoc))
onUnmounted(() => document.removeEventListener('mousedown', onDoc))

defineExpose({ close })
</script>

<style scoped>
.menu-enter-active, .menu-leave-active,
.menu-up-enter-active, .menu-up-leave-active { transition: opacity 0.12s ease, translate 0.12s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; translate: 0 -4px; }
.menu-up-enter-from, .menu-up-leave-to { opacity: 0; translate: 0 4px; }
</style>
