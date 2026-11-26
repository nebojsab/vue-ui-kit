<template>
  <!-- Native date picker, shown in one format ("14 Oct 2026") whatever the browser's locale.
       While focused the native field shows, so typing and the keyboard still work. -->
  <div class="group relative">
    <AppInput
      :id="id"
      :model-value="modelValue"
      type="date"
      :min="min"
      :max="max"
      :disabled="disabled"
      :error="error"
      :class="modelValue ? '!text-transparent focus:!text-fg' : ''"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #leading><CalendarDaysIcon class="w-[18px] h-[18px]" /></template>
    </AppInput>
    <span
      v-if="modelValue"
      class="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-fg group-focus-within:hidden"
      aria-hidden="true"
    >{{ display }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import AppInput from './AppInput.vue'

const props = defineProps({
  /** ISO date, YYYY-MM-DD */
  modelValue: { type: String, default: '' },
  id:         { type: String, default: undefined },
  min:        { type: String, default: undefined },
  max:        { type: String, default: undefined },
  disabled:   { type: Boolean, default: false },
  error:      { type: Boolean, default: false },
  /** Display locale + options — defaults to "14 Oct 2026" */
  locale:     { type: String, default: 'en-GB' },
  format:     { type: Object, default: () => ({ day: 'numeric', month: 'short', year: 'numeric' }) },
})
defineEmits(['update:modelValue'])

// Parse as a local date — new Date('2026-10-14') would be UTC midnight and can show the day before
const display = computed(() => {
  const [y, m, d] = (props.modelValue ?? '').split('-').map(Number)
  return y ? new Date(y, m - 1, d).toLocaleDateString(props.locale, props.format) : ''
})
</script>
