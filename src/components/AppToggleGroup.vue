<template>
  <!-- Grouped on/off settings, each group the full width (permissions, notification types…).
       A group's header strip opens and closes it — name · n/total · what's on, when closed — and has
       Turn all on/off; open, a row per item with a switch. v-model the keys that are on;
       @toggle(key, on) fires once per change, so callers can save item by item.
       variant="cards" (1.11): each group is its own rounded card with a gap between, the group name as
       a real title and its n/total as a pill — easier to see which item belongs to which set. -->
  <div>
    <div :class="[inset, 'py-2 flex items-center justify-end', !cards && 'border-b border-line']">
      <button type="button" class="text-[12px] font-semibold text-fg-2 hover:text-fg inline-flex items-center gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand" @click="toggleAll">
        <ChevronUpDownIcon class="w-4 h-4" aria-hidden="true" />{{ allOpen ? 'Collapse all' : 'Expand all' }}
      </button>
    </div>

    <div :class="cards && [inset, 'pb-5 space-y-3']">
    <fieldset
      v-for="g in groups"
      :key="g.key"
      :class="cards ? 'rounded-2xl border border-line bg-surface-2/40 overflow-hidden' : 'border-b border-line last:border-0'"
      :disabled="disabled"
    >
      <legend class="sr-only">{{ g.label }}</legend>
      <div :class="cards ? ['px-4 py-3 flex items-center gap-3', isOpen(g) && 'border-b border-line'] : [inset, 'py-2.5 bg-surface-2/60 flex items-center gap-2.5']">
        <button
          type="button"
          class="min-w-0 flex-1 flex items-center gap-2.5 text-left rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand"
          :aria-expanded="isOpen(g)"
          :aria-controls="`tg-${uid}-${g.key}`"
          @click="toggle(g)"
        >
          <ChevronRightIcon :class="['w-3.5 h-3.5 text-fg-muted flex-shrink-0 transition-transform', isOpen(g) && 'rotate-90']" aria-hidden="true" />
          <template v-if="cards">
            <span class="text-[14px] font-semibold text-fg">{{ g.label }}</span>
            <span :class="['px-2 py-0.5 rounded-full text-[11.5px] font-semibold tabular', onIn(g) ? 'bg-brand/15 text-brand' : 'bg-fg-muted/15 text-fg-muted']">{{ onIn(g) }}/{{ g.items.length }}</span>
          </template>
          <template v-else>
            <span class="text-overline text-fg-muted">{{ g.label }}</span>
            <span :class="['text-[11.5px] font-semibold tabular', onIn(g) ? 'text-brand' : 'text-fg-muted']">{{ onIn(g) }}/{{ g.items.length }}</span>
          </template>
          <!-- Closed: what's on, so nothing hides behind the fold -->
          <span v-if="!isOpen(g)" class="min-w-0 truncate text-[12.5px] text-fg-2">{{ summary(g) }}</span>
        </button>
        <button
          v-if="bulk && !disabled && g.items.some((i) => !i.locked)"
          type="button"
          class="flex-shrink-0 text-[12px] font-semibold text-brand hover:underline rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand"
          @click="setGroup(g, onIn(g) < g.items.length)"
        >{{ onIn(g) < g.items.length ? 'Turn all on' : 'Turn all off' }}</button>
      </div>
      <ul v-show="isOpen(g)" :id="`tg-${uid}-${g.key}`" class="divide-y divide-line">
        <li v-for="i in g.items" :key="i.key">
          <!-- On: a brand tint and a bar on the leading edge, so what's switched on stands out at a glance
               (not just by weight); off stays readable in the secondary text colour -->
          <label
            :class="[
              cards ? 'px-4' : inset, 'py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center', showCodes && 'md:grid-cols-[minmax(0,1fr)_200px_auto]', 'gap-x-6 gap-y-0.5 transition-colors',
              has(i.key) ? 'relative bg-brand/[0.07] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-brand' : '',
              !disabled && !i.locked && (has(i.key) ? 'cursor-pointer hover:bg-brand/[0.11]' : 'cursor-pointer hover:bg-surface-2'),
            ]"
          >
            <span class="min-w-0">
              <span :class="['block text-[14px]', has(i.key) ? 'text-fg font-semibold' : 'text-fg-2']">{{ i.label }}</span>
              <span v-if="i.hint" class="block text-[12.5px] text-fg-muted">{{ i.hint }}</span>
            </span>
            <code v-if="showCodes" :class="['max-md:hidden text-[12px]', has(i.key) ? 'text-brand' : 'text-fg-muted']">{{ i.code ?? i.key }}</code>
            <AppToggle
              size="sm"
              :model-value="has(i.key)"
              :disabled="disabled || i.locked"
              :aria-label="subject ? `${subject}: ${i.label}` : i.label"
              @update:model-value="set(i.key, $event)"
            />
          </label>
        </li>
      </ul>
    </fieldset>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useId } from 'vue'
import { ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import AppToggle from './AppToggle.vue'

const props = defineProps({
  /** [{ key, label, items: [{ key, label, hint?, code?, locked? }] }] — locked = can't be switched */
  groups: { type: Array, required: true },
  /** Keys that are on (v-model) */
  modelValue: { type: Array, required: true },
  /** Whose settings, for screen readers: "Sales" → "Sales: Browse vendors" */
  subject: { type: String, default: '' },
  /** Read-only */
  disabled: { type: Boolean, default: false },
  /** Side padding of strips and rows — match the card or modal around it */
  inset: { type: String, default: 'px-6 sm:px-7' },
  /** A middle column with each item's code (e.g. a permission key) on wider screens */
  showCodes: { type: Boolean, default: false },
  /** Groups open at the start: 'first' | 'all' | 'none' */
  open: { type: String, default: 'first' },
  /** 'flush' — groups stacked edge to edge (default) | 'cards' — each group its own card, with gaps */
  variant: { type: String, default: 'flush' },
  /** Turn all on / off per group */
  bulk: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'toggle'])
const uid = useId()
const cards = computed(() => props.variant === 'cards')

const has = (key) => props.modelValue.includes(key)
const onIn = (g) => g.items.filter((i) => has(i.key)).length
const summary = (g) => {
  const on = g.items.filter((i) => has(i.key)).map((i) => i.label)
  return on.length === g.items.length ? 'All' : on.length ? on.join(', ') : 'Nothing'
}

// ── Open / closed groups ──
const keysFor = (mode) => ({ all: props.groups.map((g) => g.key), first: props.groups.slice(0, 1).map((g) => g.key), none: [] }[mode] ?? [])
const opened = ref(new Set(keysFor(props.open)))
const isOpen = (g) => opened.value.has(g.key)
const allOpen = computed(() => props.groups.every((g) => opened.value.has(g.key)))
function toggle(g) {
  const next = new Set(opened.value)
  next.has(g.key) ? next.delete(g.key) : next.add(g.key)
  opened.value = next
}
function toggleAll() { opened.value = new Set(allOpen.value ? [] : keysFor('all')) }

function set(key, on) {
  emit('toggle', key, on)
  emit('update:modelValue', on ? [...new Set([...props.modelValue, key])] : props.modelValue.filter((k) => k !== key))
}
function setGroup(g, on) {
  const keys = g.items.filter((i) => !i.locked && has(i.key) !== on).map((i) => i.key)
  keys.forEach((k) => emit('toggle', k, on))
  emit('update:modelValue', on ? [...new Set([...props.modelValue, ...keys])] : props.modelValue.filter((k) => !keys.includes(k)))
}
</script>
