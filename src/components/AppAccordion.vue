<template>
  <div :class="variant === 'card' ? 'card divide-y divide-line overflow-hidden' : 'divide-y divide-line border-y border-line'">
    <div v-for="item in items" :key="item.value">
      <h3 class="m-0">
        <button
          :id="`${uid}-h-${item.value}`"
          type="button"
          :aria-expanded="isOpen(item.value)"
          :aria-controls="`${uid}-p-${item.value}`"
          :disabled="item.disabled"
          :class="[
            'w-full flex items-center gap-3 text-left font-semibold text-fg transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
            'hover:bg-surface-2 focus-visible:bg-surface-2',
            variant === 'card' ? 'px-5 py-4' : 'px-1 py-4',
          ]"
          @click="toggle(item.value)"
        >
          <component :is="item.icon" v-if="item.icon" class="w-5 h-5 text-fg-muted flex-shrink-0" aria-hidden="true" />
          <span class="flex-1 min-w-0">
            {{ item.title }}
            <span v-if="item.subtitle" class="block text-sm font-normal text-fg-muted mt-0.5">{{ item.subtitle }}</span>
          </span>
          <ChevronDownIcon
            :class="['w-5 h-5 text-fg-muted flex-shrink-0 transition-transform duration-200', isOpen(item.value) && 'rotate-180']"
            aria-hidden="true"
          />
        </button>
      </h3>
      <!-- grid-rows 0fr → 1fr animates to the content's real height -->
      <div
        :id="`${uid}-p-${item.value}`"
        role="region"
        :aria-labelledby="`${uid}-h-${item.value}`"
        :inert="!isOpen(item.value) || undefined"
        :class="['grid transition-[grid-template-rows] duration-200 ease-out', isOpen(item.value) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
      >
        <div class="overflow-hidden">
          <div :class="['text-sm text-fg-2', variant === 'card' ? 'px-5 pb-5' : 'px-1 pb-5']">
            <slot :name="item.value" :item="item">
              <slot :item="item">{{ item.content }}</slot>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useId } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

/**
 * Stacked sections that expand and collapse — FAQs, settings groups, long forms.
 * Content comes from item.content, a named slot matching item.value, or the
 * default slot ({ item }). Works with or without v-model.
 */
const props = defineProps({
  /** [{ value, title, subtitle?, content?, icon?, disabled? }] */
  items: { type: Array, required: true },
  /** Open item(s): a value, or an array when `multiple` */
  modelValue: { type: [String, Array], default: undefined },
  /** Allow several items open at once */
  multiple: { type: Boolean, default: false },
  /** 'plain' (rules between items) | 'card' (inside a card) */
  variant: { type: String, default: 'plain' },
})
const emit = defineEmits(['update:modelValue'])

const uid = `ac${useId().replace(/[^a-zA-Z0-9]/g, '')}`
const local = ref(props.multiple ? [] : null)
const open = computed(() => (props.modelValue !== undefined ? props.modelValue : local.value))

const isOpen = (v) => (Array.isArray(open.value) ? open.value.includes(v) : open.value === v)

function toggle(v) {
  let next
  if (props.multiple) {
    const arr = Array.isArray(open.value) ? open.value : []
    next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  } else {
    next = open.value === v ? null : v
  }
  local.value = next
  emit('update:modelValue', next)
}
</script>
