<template>
  <div :class="['field-upload', state, { disabled, checked: value }]">

    <PrimeVueFileUpload
      name="files[]"
      :multiple="true"
      :accept="accept"
      :max-file-size="maxFileSize"
      :disabled="disabled"
      @select="handleFilesSelected"
      @clear="handleClear"
      @remove="handleRemove">

      <!-- ========================================================== Header -->
      <template #header="{ chooseCallback, clearCallback, files }">
        <slot
          name="header"
          :choose-callback="chooseCallback"
          :clear-callback="clearCallback"
          :files="files" />
      </template>

      <!-- =============================================== Empty placeholder -->
      <template #empty>
        <slot name="empty" />
      </template>

    </PrimeVueFileUpload>
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
const scaffold = props.field.scaffold
const maxFileSize = scaffold.maxFileSize || Infinity
const accept = scaffold.accept

// ==================================================================== Computed
const state = computed(() => props.field.state)
const value = computed(() => props.field.value)

// ===================================================================== Methods
/**
 * @method handleFilesSelected
 */
const handleFilesSelected = e => {
  const files = e.files
  if (!props.disabled) {
    console.log(files)
    emit('updateValue', files)
    emit('toggleFocused', false)
  }
}

/**
 * @method handleClear
 */
const handleClear = () => {
  emit('updateValue', [])
  emit('toggleFocused', false)
}

/**
 * @method handleRemove
 */
const handleRemove = e => {
  emit('updateValue', e.files)
  emit('toggleFocused', false)
}
</script>
