<template>
  <ZeroFieldInput v-bind="{...props, ...$attrs}">
    <template #step-control-up>
      UP
    </template>
    <template #step-control-down>
      DOWN
    </template>
  </ZeroFieldInput>
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
$height: 3.125rem;

// ///////////////////////////////////////////////////////////////////// General
.field-input {
  height: $height;
  &.in-progress {
    :deep(.input) {
      border-color: darkorange;
    }
  }
  &.error {
    :deep(.input) {
      border-color: red;
    }
  }
  &.disabled {
    cursor: no-drop;
    :deep(.input) {
      border-color: rgba(246, 245, 255, 0.25);
    }
  }
  &.with-controls {
    :deep(.input) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }
}

:deep(.input-container) {
  display: flex;
  flex-direction: row;
}

:deep(.input) {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 toRem(12);
  border: 2px solid black;
  border-radius: toRem(5);
  transition: 150ms ease-in-out;
  @include placeholder {
    color: rgba(black, 0.7);
    font-style: italic;
    opacity: 1;
    transition: 150ms ease-out;
  }
}

:deep(.step-controls) {
  color: white;
  border-radius: 0 toRem(5) toRem(5) 0;
  overflow: hidden;
  .step-control {
    background-color: black;
    width: 100%;
    height: 50%;
    &:hover {
      background-color: gray;
    }
    &:first-child {
      border-bottom: 1px solid gray;
    }
  }
}
</style>
