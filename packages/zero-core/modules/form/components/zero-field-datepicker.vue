<template>
  <div :class="['field-datepicker', state, { disabled, empty }]">

    <VueDatePicker
      :model-value="value"
      :multi-dates="multi"
      :enable-time-picker="time"
      :range="range"
      :disabled="disabled"
      :placeholder="placeholder"
      @update:model-value="handleUpdate" />

  </div>
</template>

<script setup>
// ===================================================================== Imports
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// ======================================================================= Setup
const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['toggleFocused', 'updateValue'])

// ======================================================================== Data
const scaffold = props.field.scaffold
const multi = scaffold.multi === '' ? false : scaffold.multi || false
const time = scaffold.time === '' ? false : scaffold.time || false
const range = scaffold.range === '' ? false : scaffold.range || false
const placeholder = scaffold.placeholder

// ==================================================================== Computed
const state = computed(() => props.field.state)
const empty = computed(() => !value.value || value.value === '')
const value = computed(() => props.field.value)

// ===================================================================== Methods
/**
 * @method handleUpdate
 */
const handleUpdate = value => {
  emit('updateValue', value || '')
  emit('toggleFocused', false)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.dp__main),
:deep(.dp__main > div),
:deep(.dp__input_wrap),
:deep(.dp__input_reg) {
  width: 100%;
  height: 100%;
}
</style>
