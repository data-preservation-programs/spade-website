<template>
  <ZeroButton
    v-bind="props"
    :class="['button-x', `theme__${props.theme}`]">
    <div class="inner-content">

      <div class="button-content">
        <slot />
      </div>

    </div>
  </ZeroButton>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  tag: { // button, 'a' or nuxt-link
    type: String,
    required: false,
    default: 'button'
  },
  to: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  target: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  theme: { // 'clear', 'pink' or 'green'
    type: String,
    required: false,
    default: 'clear'
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button-x {
  white-space: nowrap;
  cursor: pointer;
  &:not([disabled="true"]) {
    &:hover {
      .button-content {
        transition: 150ms ease-in;
        text-decoration: none;
      }
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  &[disabled="true"] {
    box-shadow: none;
    opacity: 0.5;
    cursor: no-drop;
  }
}

.button-content {
  @include p1Link;
  transition: 150ms ease-out;
  &.hide {
    opacity: 0;
  }
}

</style>
