<template>
  <ZeroFieldDatepicker v-bind="{...props, ...$attrs}" />
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
</script>
