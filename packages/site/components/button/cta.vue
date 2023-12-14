<template>
  <ZeroButton
    v-slot="{ loading }"
    v-bind="props"
    :class="['button-x', `theme__${props.theme}`, variant]">
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
  theme: { // primary or secondary
    type: String,
    required: false,
    default: 'primary'
  },
  variant: { // 'large', 'small' or none
    type: String,
    required: false,
    default: ''
  }
})

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.button) {
  white-space: nowrap;
  cursor: pointer;
  &:not(.disabled) {
    &:hover {
      .button-content {
        text-decoration: none;
      }
    }
    &:focus-visible {
      @include focusBoxShadow;
    }
  }
  .disabled {
    box-shadow: none;
    opacity: 0.5;
    cursor: default;
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
    background-color: var(--secondary-text-color);
  }
}

.button-content {
  white-space: nowrap;
  &.hide {
    opacity: 0;
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
[class*="theme__solid"],
[class*="theme__gradient"] {
  position: relative;
  border-radius: toRem(10);
  overflow: hidden;
  .inner-content {
    padding: toRem(8) toRem(20);
    transition: 200ms ease;
  }
  .button-content {
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    line-height: leading(27, 16);
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: 200ms ease;
  }
}

[class*="theme__solid"] {
  border: solid 1px $electricLime;
  &:hover {
    .inner-content {
      background-color: $electricLime;
    }
    .button-content {
      color: $woodsmoke;
    }
  }
}

[class*="theme__gradient"] {
  padding: toRem(2);
  @include gradientYellowBlue(100deg);
  .inner-content {
    position: relative;
    border-radius: toRem(8);
  }
}

.theme__solid,
.theme__gradient {
  &-dark {
    .inner-content {
      background-color: $blackPearl;
    }
    .button-content {
      color: white;
    }
  }
  &-light {
    .inner-content {
      background-color: white;
      .button-content {
        color: $woodsmoke;
      }
    }
  }
}

.theme__gradient-light {
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include gradientBlueBlue(100deg);
    opacity: 0;
    transition: 200ms ease;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
    .inner-content {
      background-color: transparent;
    }
    .button-content {
      color: white;
    }
  }
}

.theme__gradient-dark {
  transition: 300ms ease;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include gradientYellowBlue(280deg);
    opacity: 0;
    transition: 300ms ease;
  }
  .inner-content {
    transition: 300ms ease;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
    .inner-content {
      background-color: #162349;
    }
  }
  
}

.theme__icon {
  border-radius: 50%;
  padding: toRem(6);
  margin-right: toRem(24);
  transition: 200ms ease;
  .button-content {
    display: flex;
  }
  :deep(.icon) {
    width: toRem(28);
    height: toRem(28);
    @include mini {
      width: toRem(14);
      height: toRem(14);
    }
    path {
      fill: white;
    }
  }
  &:hover {
    transform: scale(1.1);
  }
}

.theme__arrow {
  display: block;
  padding: toRem(10);
  width: fit-content;
  .inner-content {
    position: relative;
    padding-right: toRem(26);
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: calc(100% - toRem(13));
      width: toRem(13);
      height: toRem(13);
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 13 13' fill='none'%3e%3cpath d='M1.24264 11.7348L11.1421 1.83533M11.1421 1.83533V10.3206M11.1421 1.83533H2.65685' stroke='%233F55E0' stroke-width='2.5'/%3e%3c/svg%3e");
      transform: translate(0, -50%) rotate(0deg);
      transition: 200ms ease;
    }
  }
  .button-content {
    display: flex;
    font-family: $fontSora;
    font-size: toRem(16);
    font-weight: 700;
    line-height: leading(22, 16);
    text-transform: uppercase;
    color: $royalBlue;
  }
  &:hover {
    .inner-content {
      &:after {
        transform: translate(0.5rem, -50%) rotate(45deg);
      }
    }
  }
}

</style>
