<template>
  <div class="navbar">
    <nav class="navigation">

      <div
        v-for="link in links"
        :key="`${link.text}`"
        class="nav-item">
        <ZeroButton
          :tag="link.tag"
          :to="link.to"
          class="nav-link"
          @clicked="scrollToSection(link.to)">
          {{ link.text }}
        </ZeroButton>
      </div>

      <slot></slot>

    </nav>
  </div>
</template>

<script setup>
// ======================================================================= Props
// eslint-disable-next-line
const props = defineProps({
  links: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['nav-link-click'])

// ===================================================================== Methods
const scrollToSection = async (el) => {
  emit('nav-link-click')
  const id = el.replaceAll('#', '')
  const section = document.getElementById(id)
  if (section) {
    await navigateTo({
      path: '/',
      query: {
        section: id
      }
    })
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.navbar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  &.desktop {
    margin: 0 1rem 0 -1rem;
  }
  &.mobile {
    padding: toRem(0) toRem(32);
    .navigation {
      flex-direction: column;
    }
    .nav-item {
      justify-content: flex-start;
      &:not(:last-child) {
        margin-bottom: toRem(16);
      }
    }
  }
}

.navigation {
  display: flex;
  justify-content: space-between;
}

.nav-item {
  display: flex;
  justify-content: flex-end;
}

.nav-link {
  position: relative;
  padding: toRem(0) toRem(16);
  font-family:  $fontSuisseIntl;
  font-size: toRem(14);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: leading(27, 14);
  white-space: nowrap;
  color: $athensGray;
  @include medium {
    font-size: toRem(13);
    padding: toRem(0) toRem(8);
  }
  @include small {
    padding: toRem(12) toRem(16);
    font-size: toRem(20);
    line-height: leading(27, 20);
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: toRem(7);
    background-size: 35px 7px;
    background-repeat: none;
    transition: 200ms ease;
  }
  &:before {
    bottom: 100%;
    right: calc(50% - toRem(17.5));
    background-position: right;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='35' height='8' viewBox='0 0 35 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.931024 5.62065C0.384972 6.21182 0.804275 7.16992 1.60905 7.16992H34.5V5.84594C34.5 4.80309 33.6368 3.96727 32.5945 4.0009L5.34936 4.87988C4.92226 4.89366 4.70744 4.36962 5.02131 4.07964L6.45746 2.75284C6.77451 2.45993 6.88196 2.00384 6.729 1.60021V1.60021C6.45028 0.864724 5.49522 0.679311 4.96155 1.25708L0.931024 5.62065Z' fill='%23E8FF5A'/%3e%3c/svg%3e ");
  }
  &:after {
    top: 100%;
    left: calc(50% - toRem(17.5));
    background-position: left;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='35' height='7' viewBox='0 0 35 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M34.069 1.72115C34.615 1.12997 34.1957 0.171875 33.391 0.171875H0.5V1.49586C0.5 2.5387 1.36322 3.37453 2.40553 3.3409L29.6506 2.46192C30.0777 2.44814 30.2926 2.97218 29.9787 3.26216L28.5425 4.58896C28.2255 4.88187 28.118 5.33795 28.271 5.74159C28.5497 6.47707 29.5048 6.66249 30.0385 6.08472L34.069 1.72115Z' fill='%23E8FF5A'/%3e%3c/svg%3e ");
  }
  &:hover,
  &.selected {
    &:before,
    &:after {
      width: toRem(35);
    }
  }
}
</style>
