<template>
  <ZeroFieldBoolean v-bind="{...props, ...$attrs}" />
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
.field-boolean {
  display: flex;
  position: relative;
  width: toRem(45);
  height: toRem(25);
  border: 2px solid var(--theme-toggle__border-color);
  border-radius: toRem(18);
  background-color: var(--theme-toggle__background-color);
  cursor: pointer;
  transition: 150ms ease-out;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: teal;
    border-radius: 50%;
    pointer-events: none;
    transition: 150ms ease-out;
  }
  &.checked {
    &:after {
      transition: 150ms ease-in;
      transform: translateX(100%);
    }
  }
}

:deep(.boolean-container) {
  width: 100%;
  height: 100%;
}

:deep(input.boolean) {
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
</style>
