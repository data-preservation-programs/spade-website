<template>
  <ZeroFieldTextarea v-bind="{...props, ...$attrs}" />
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

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field-textarea {
  height: 10rem;
  transition: 150ms ease-out;
  &.in-progress {
    :deep(.textarea) {
      border-color: tomato;
    }
  }
  &.error {
    :deep(.textarea) {
      border-color: darkorange;
    }
  }
  &.disabled {
    cursor: no-drop;
    :deep(.textarea) {
      border-bottom-color: rgba(227, 211, 192, 0.25);
      overflow-y: scroll;
    }
  }
}

:deep(.textarea) {
  padding: 1.5rem;
  border: 2px solid blue;
  border-radius: 0.625rem;
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba(black, 0.7);
    font-size: toRem(16);
    font-weight: 400;
    font-style: italic;
    opacity: 1;
  }
  &:focus {
    border-color: teal;
  }
}
</style>
