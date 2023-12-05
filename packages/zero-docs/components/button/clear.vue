<template>
  <ZeroButton
    v-slot="{ loading }"
    v-bind="props"
    :class="['button-x', `theme__${props.theme}`]">
    <div class="inner-content">

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
  theme: { // 'clear', 'pink' or 'green'
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
  &:not([disabled="true"]) {
    &:hover {
      .button-content {
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

.triple-dot-loader,
.button-content {
  width: 100%;
  height: 100%;
}

.triple-dot-loader {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.show {
    opacity: 1;
  }
  :deep(.dot) {
    background-color: var(--theme-color);
  }
}

.button-content {
  &.hide {
    opacity: 0;
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.theme__clear {
  .button-content {
    display: flex;
    align-items: center;
  }
  :deep(.text) {
    @include navigation;
    color: var(--theme-color);
  }
  &:hover {
    :deep(.text) {
      color: var(--link-color);
      transition: color .25s ease;
    }
  }
}
</style>
