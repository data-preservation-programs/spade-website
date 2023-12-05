<template>
  <div :class="['field-boolean', state, { disabled, checked: value }]">

    <div class="boolean-container">
      <div v-if="disabled" :class="['boolean', { checked: value }]" />
      <input
        v-else
        :id="id"
        :checked="value"
        :name="id"
        type="checkbox"
        class="boolean"
        @focus="emit('toggleFocused', true)"
        @blur="emit('toggleFocused', false)"
        @input="emit('updateValue', !value)" />
    </div>

  </div>
</template>

<script setup>
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
const id = props.field.id

// ==================================================================== Computed
const state = computed(() => props.field.state)
const value = computed(() => props.field.value)
</script>
