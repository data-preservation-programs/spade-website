<template>
  <div :class="['field-input', inputType, state, { empty, disabled, 'no-validate': !validate, 'with-controls': showControls }]">

    <div v-if="disabled" class="input-container">
      <div class="input">
        {{ value || placeholder }}
      </div>
      <div v-if="inputType === 'number' && showControls" class="step-controls">
        <button class="step-control up">
          <slot name="step-control-up" />
        </button>
        <button class="step-control down">
          <slot name="step-control-down" />
        </button>
      </div>
    </div>

    <div v-else class="input-container">
      <input
        :id="modelKey"
        :type="inputType"
        :name="modelKey"
        :placeholder="placeholder"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        class="input"
        @focus="toggleFocused(true)"
        @blur="toggleFocused(false)"
        @input="processValue" />
      <div v-if="inputType === 'number' && showControls" class="step-controls">
        <button
          class="step-control up"
          @click="increment('up')">
          <slot name="step-control-up" />
        </button>
        <button
          class="step-control down"
          @click="increment('down')">
          <slot name="step-control-down" />
        </button>
      </div>
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

const emit = defineEmits(['updateValue', 'toggleFocused', 'toggleState'])

// ======================================================================== Data
const scaffold = props.field.scaffold
const modelKey = props.field.modelKey
const inputType = scaffold.inputType || 'text'
const placeholder = scaffold.placeholder || 'Enter a value...'
const autocomplete = scaffold.autocomplete
const step = scaffold.step
const showControls = scaffold.showControls
const pre = scaffold.pre
const min = scaffold.min
const max = scaffold.max

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

// ===================================================================== Methods
const toggleFocused = (state) => {
  if (!state && inputType === 'number') { // blur
    let val = value.value
    if (val !== '') {
      val = step % 1 !== 0 ? `${parseFloat(val).toFixed(2)}` : `${parseInt(val)}`
      emit('updateValue', val)
    }
  }
  emit('toggleFocused', state)
}

const processValue = (e) => {
  emit('updateValue', e.target.value)
}

const increment = (direction) => {
  const stepIsFloat = step % 1 !== 0
  const currentValue = value.value === '' ? 0 : parseFloat(value.value)
  const currentValueIsFloat = currentValue % 1 !== 0
  let incremented = direction === 'up' ? currentValue + step : currentValue - step
  if (stepIsFloat || currentValueIsFloat) {
    incremented = incremented.toFixed(2)
  }
  emit('updateValue', incremented)
  emit('toggleState', false)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.input-container,
.input {
  width: 100%;
  height: 100%;
}

.input {
  appearance: none;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
    appearance: none;
  }
}
</style>
