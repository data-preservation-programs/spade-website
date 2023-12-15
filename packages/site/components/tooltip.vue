<template>
  <div :class="['tooltip', `animate-from__${animateFrom}`]">

    <div class="floating">
      <slot name="tooltip" />
    </div>

    <slot />

  </div>
</template>

<script setup>
// ======================================================================= Setup
defineProps({
  animateFrom: {
    type: String,
    required: false,
    default: 'bottom',
    validator (prop) {
      const allowList = ['top', 'right', 'bottom', 'left']
      return allowList.includes(prop)
    }
  }
})
</script>

<style lang="scss" scoped>
$offset: 1rem;
$offsetOnHover: 0.5rem;

// ///////////////////////////////////////////////////////////////////// General
.tooltip {
  position: relative;
  &:hover {
    .floating {
      transition: 150ms ease-in;
      opacity: 1;
    }
  }
  &.animate-from__top,
  &.animate-from__bottom {
    .floating {
      left: 50%;
    }
    &:hover {
      .floating {
        transform: translate(-50%, $offsetOnHover);
      }
    }
  }
  &.animate-from__left,
  &.animate-from__right {
    .floating {
      top: 50%;
    }
    &:hover {
      .floating {
        transform: translate(-$offsetOnHover, -50%);
      }
    }
  }
  &.animate-from__top {
    .floating {
      bottom: 100%;
      transform: translate(-50%, -$offset);
    }
  }
  &.animate-from__bottom {
    .floating {
      top: 100%;
      transform: translate(-50%, $offset);
    }
  }
  &.animate-from__left {
    .floating {
      right: 100%;
      transform: translate(-$offset, -50%);
    }
  }
  &.animate-from__right {
    .floating {
      left: 100%;
      transform: translate($offset, -50%);
    }
  }
}

.floating {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  transition: 150ms ease-out;
}

:deep(.tip) {
  padding: toRem(4) toRem(8);
  padding-top: toRem(5);
  white-space: nowrap;
}
</style>
