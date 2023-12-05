<template>
  <div :class="['field-checkbox', state, { disabled }]">

    <div
      v-for="(option, index) in options"
      :key="index"
      class="checkbox-wrapper">

      <div class="checkbox-container">
        <div v-if="disabled" class="checkbox" />
        <input
          v-else
          :id="`checkbox__${id}__${index}`"
          :checked="value === index"
          :name="`checkbox__${id}`"
          type="checkbox"
          class="checkbox"
          @focus="emit('toggleFocused', true)"
          @blur="emit('toggleFocused', false)"
          @input="updateValue(index)" />
        <slot name="checkbox-extra" />
      </div>

      <slot
        :id="`checkbox__${id}__${index}`"
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
const value = computed(() => props.field.value)
const state = computed(() => props.field.state)

// ===================================================================== Methods
const updateValue = (index) => {
  emit(
    'updateValue',
    value.value === index ? -1 : index
  )
}
</script>
