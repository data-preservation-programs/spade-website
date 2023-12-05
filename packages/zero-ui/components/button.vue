<template>
  <ZeroButton
    v-slot="{ loading }"
    v-bind="props"
    :class="['button-x', `theme__${props.theme}`]">
    <div class="inner-content">

      <div :class="['loader', { show: loading }]">
        ⚠️ loading
      </div>

      <div :class="['button-content', { hide: loading }]">
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
  loader: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  },
  theme: { // 'clear'
    type: String,
    required: false,
    default: 'clear'
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  white-space: nowrap;
  cursor: pointer;
  &:not([disabled]) {
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
  &[disabled] {
    box-shadow: none;
    opacity: 0.5;
    cursor: no-drop;
  }
}

.loader,
.button-content {
  width: 100%;
  height: 100%;
}

.loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  font-size: toRem(14);
  opacity: 0;
  &.show {
    opacity: 1;
  }
}

.button-content {
  transition: 150ms ease-out;
  font-weight: 700;
  &.hide {
    opacity: 0;
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__basic {
  padding: toRem(4) toRem(14);
  border: 2px solid var(--divider);
  border-radius: toRem(4);
  transition: 150ms ease-out;
  &:not([disabled]):hover {
    transition: 150ms ease-in;
    background-color: var(--divider);
  }
}
</style>
