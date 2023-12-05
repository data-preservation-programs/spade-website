<template>
  <div :class="['field-textarea', state, { empty, disabled, 'no-validate': !validate }]">

    <div v-if="disabled" class="textarea">
      {{ value || placeholder }}
    </div>

    <div v-else class="textarea-container">
      <textarea
        :value="value"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="textarea"
        @focus="emit('toggleFocused', true)"
        @blur="emit('toggleFocused', false)"
        @input="emit('updateValue', $event.target.value)"></textarea>
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

const emit = defineEmits(['updateValue', 'toggleFocused'])

// ======================================================================== Data
const scaffold = props.field.scaffold
const placeholder = scaffold.placeholder || 'Enter a value...'
const autocomplete = scaffold.autocomplete
const pre = scaffold.pre

// ==================================================================== Computed
const value = computed(() => props.field.value)
const state = computed(() => props.field.state)
const empty = computed(() => !value.value || value.value === '')
const validate = computed(() => props.field.validate)

// ======================================================================= Watch
watch(props.field, (field) => {
  const value = field.value
  if (typeof pre !== 'string') { return }
  const regex = new RegExp(pre)
  if (regex.test(value)) { // value contains restricted characters
    const stripped = value.replace(regex, '')
    emit('updateValue', stripped)
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.textarea-container,
.textarea {
  width: 100%;
  height: 100%;
}
</style>
