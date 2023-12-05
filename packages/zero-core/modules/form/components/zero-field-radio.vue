<template>
  <div :class="['field-radio', state, { disabled }]">

    <div
      v-for="(option, index) in options"
      :key="index"
      class="radio-wrapper">

      <div class="radio-container">
        <div v-if="disabled" class="radio" />
        <input
          v-else
          :id="`radio__${id}__${index}`"
          :checked="value === index"
          :name="`radio-${id}`"
          type="radio"
          class="radio"
          @focus="emit('toggleFocused', true)"
          @blur="emit('toggleFocused', false)"
          @input="emit('updateValue', index)" />
        <slot name="radio-extra" />
      </div>

      <slot
        :id="`radio__${id}__${index}`"
        name="label"
        :label="option.label" />

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
  forceDisabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['toggleFocused', 'updateValue'])

// ======================================================================== Data
const scaffold = props.field.scaffold
const id = props.field.id
const options = scaffold.options
const disabled = props.forceDisabled || scaffold.disabled

// ==================================================================== Computed
const value = computed(function () {
  const value = props.field.value
  return Array.isArray(value) ? value[0] : value
})
const state = computed(() => props.field.state)
</script>
