<template>
  <header
    id="site-header"
    :class="['site-header', { 'nav-panel-open': navigationOpen }]">

    <!-- ============================================================ Mobile -->
    <div :class="['mobile-background-panel', {'open': navigationOpen }]">

      <div class="grid">
        <div class="col-12">
          <div class="mobile-nav">
            <Navbar
              :links="navigation"
              class="mobile"
              @nav-link-click="handleNavClick">
              <div class="nav-item">
                <ButtonCta
                  tag="nuxt-link"
                  to="/"
                  theme="primary"
                  variant="large"
                  class="modal-sign-up-cta">
                  Sign up
                </ButtonCta>
              </div>
            </Navbar>
          </div>
        </div>
      </div>

    </div>

    <!-- =========================================================== Desktop -->
    <div class="grid-noBottom-noGutter">
      <div class="col-12">
        <div class="navigation-wrapper">
          <div class="grid-middle-noGutter-noBottom main-content">

            <div class="col-4">
              <NuxtLink to="/" class="logo">
                <SiteLogo />
              </NuxtLink>
            </div>

            <div class="col-4_sm-hidden" data-push-left="off-0">
              <Navbar :links="navigation" class="desktop" />
            </div>

            <div class="col-4" data-push-left="off-0">
              <div class="nav-ctas">

                <div class="nav-toggle-wrapper before">
                  <ZeroButton
                    tag="button"
                    @click="toggleNav">
                    <div :class="['hamburger', { open: navigationOpen }]">
                      <div class="bottom">
                      </div>
                    </div>
                  </ZeroButton>
                </div>

                <ButtonCta
                  v-for="cta in ctas"
                  :key="cta.component || cta.text"
                  :tag="cta.tag"
                  :target="cta.target"
                  :theme="cta.theme"
                  :to="cta.to">
                  <component
                    :is="getCtaComponent(cta.icon)"
                    v-if="cta.icon"
                    class="icon" />
                  <span v-if="cta.text">
                    {{ cta.text }}
                  </span>
                </ButtonCta>

                <div class="nav-toggle-wrapper after">
                  <ZeroButton
                    tag="button"
                    @click="toggleNav">
                    <div :class="['hamburger', { open: navigationOpen }]">
                      <div class="bottom">
                      </div>
                    </div>
                  </ZeroButton>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'
import { useGeneralStore } from '../stores/general.js'
const GithubIcon = resolveComponent('./icon/github')
const SlackIcon = resolveComponent('./icon/slack')
const MediumIcon = resolveComponent('./icon/medium')

// ======================================================================== Data
const breakpointSmall = ref(false)
const headerResizeEventListener = ref(null)
const generalStore = useGeneralStore()
const {
  siteContent,
  navigationOpen
} = storeToRefs(generalStore)

// ==================================================================== Computed
const navigation = computed(() => {
  return siteContent.value?.general?.navigation.nav_items || []
})

const ctas = computed(() => {
  return siteContent.value?.general?.navigation.toolbar || []
})

// ==================================================================== Watchers
watch(navigationOpen, (val) => {
  if (val) {
    document.body.classList.add('no-scroll')
    window.scrollTo(0, 0)
  } else {
    document.body.classList.remove('no-scroll')
  }
})

watch(breakpointSmall, () => {
  if (navigationOpen.value) { toggleNav() }
})

// ======================================================================= Hooks
onMounted(() => {
  headerResizeEventListener.value = zeroThrottle(() => {
    if (window.matchMedia('(max-width: 53.125rem)').matches) {
      if (!breakpointSmall.value) {
        breakpointSmall.value = true
      }
    } else {
      if (breakpointSmall.value) {
        breakpointSmall.value = false
      }
    }
  })
  headerResizeEventListener.value()
  window.addEventListener('resize', headerResizeEventListener.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', headerResizeEventListener.value)
})

// ===================================================================== Methods
/**
 * @method toggleNav
 */
const toggleNav = () => {
  generalStore.setNavigationOpen()
}
/**
 * @method getCtaComponent
 */
const getCtaComponent = (icon) => {
  switch (icon) {
    case 'github' : return GithubIcon;
    case 'slack' : return SlackIcon;
    case 'medium' : return MediumIcon;
    default : return 'span'
  }
}

const handleNavClick = () => {
  if (navigationOpen.value) { toggleNav() }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.site-header {
  padding: toRem(8) 0;
  height: $siteHeaderHeight;

  @include small {
    position: absolute;
    width: 100%;
    height: $siteHeaderHeight;
    z-index: 2;
  }
  @include mini {
    padding: 1.25rem 0;
  }
  &.nav-panel-open {
    position: fixed;
    width: 100%;
    z-index: 1000;
    .main-content,
    .mobile-background-panel {
      z-index: 1001;
    }
    .nav-ctas {
      @include mini {
        :deep(.theme__icon) {
          opacity: 0;
          pointer-events: none;
        }
      }
    }
  }
}

[class~="grid"], [class*="grid-"], [class*="grid_"] {
  height: 100%;
}

.navigation-wrapper {
  background-color: $blackPearl;
  height: 100%;
  border-radius: toRem(8);
}

.main-content {
  position: relative;
  padding: toRem(0) toRem(37);
}

.logo {
  display: flex;
  width: fit-content;
  transition: 250ms ease;
  &:hover,
  &:focus-visible {
    transform: scale(1.08);
  }
  @include medium {
    transform: translateX(-1rem);
    &:hover,
    &:focus-visible {
      transform: translateX(-1rem) scale(1.08);
    }
  }
  @include small {
    transform: none;
    &:hover,
    &:focus-visible {
      transform: scale(1.08);
    }
  }
  :deep(svg) {
    path {
      transition: 250ms ease;
    }
    @include mini {
      max-width: toRem(205);
    }
    @include tiny {
      max-width: toRem(150);
    }
  }
}

.nav-items {
  display: flex;
  justify-content: space-between;
}

.nav-ctas {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  padding-left: toRem(34);
  @include gridMaxMQ {
    padding: 0;
    justify-content: flex-end;
    :deep(.button) {
      margin-left: 0.75rem;
    }
  }
  @include medium {
    transform: translateX(1rem);
  }
  @include small {
    transform: unset;
  }
  @include mini {
    :deep(.theme__primary) {
      display: none;
    }
    :deep(.button) {
      margin-left: 0.5rem;
    }
  }
  :deep(.button) {
    margin-right: toRem(10);
    &:nth-child(4) {
      margin-right: auto !important;
    }
  }
}

.desktop,
.nav-ctas {
  flex-grow: 1;
}

// /////////////////////////////////////////////////////////////////// Hamburger
.nav-toggle-wrapper {
  display: none;
  position: relative;
  @include small {
    &.before {
      display: flex;
      justify-content: flex-end;
    }
  }
  @include mini {
    margin-left: toRem(10);
    &.before {
      display: none;
    }
    &.after {
      display: flex;
      justify-content: flex-end;
    }
  }
  :deep(.button) {
    padding: toRem(5);
  }
}

.hamburger {
  position: relative;
  width: toRem(22);
  height: toRem(12);
  &:before,
  &:after,
  .bottom {
    position: absolute;
    width: 100%;
    left: 0;
    transition: 250ms ease;
    border-top-right-radius: toRem(1.5);
    border-bottom-right-radius: toRem(1.5);
    border-top-left-radius: toRem(0);
    border-bottom-left-radius: toRem(0);
  }
  &:before,
  &:after {
    content: '';
  }
  &:before {
    top: 0;
    width: toRem(16.5);
    left: toRem(5.5);
    // border-bottom: solid toRem(3) $sageGreen;
  }
  &:after {
    top: 50%;
    // border-bottom: solid toRem(3) rgba($sageGreen, 0.5);
  }
  .bottom {
    top: 100%;
    // border-bottom: solid toRem(3) rgba($sageGreen, 0.5);
  }
  &.open {
    &:before,
    &:after,
    .bottom {
      border-top-left-radius: toRem(1.5);
      border-bottom-left-radius: toRem(1.5);
    }
    &:before {
      width: toRem(20);
      // border-bottom: solid toRem(3) $sageGreen;
      transform: translate(-4px, 4.5px) rotate(45deg);
    }
    &:after {
      width: toRem(20);
      // border-bottom: solid toRem(3) $sageGreen;
      transform: translate(1px, -1.5px) rotate(-45deg)
    }
    .bottom {
      width: 0;
      // border-bottom: solid toRem(3) $sageGreen;
      transform: translateX(11px);
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Mobile
.mobile-nav {
  padding-top: toRem(96);
}

.mobile-background-panel {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  // background-color: $codGray;
  transition: opacity 250ms ease, transform 250ms ease, visibility 250ms ease, z-index 250ms ease;
  visibility: hidden;
  transform: scale(1.1);
  opacity: 0;
  @include small {
    display: block;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: toRem(735);
    background-position: center toRem(300);
    background-repeat: no-repeat;
  }
  &.open {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    z-index: 1000;
  }
  .nav-item {
    display: flex;
    justify-content: center;
  }
}

.modal-sign-up-cta {
  height: toRem(55);
  :deep(.inner-content) {
    height: 100%;
    padding: toRem(9) toRem(46) toRem(9) toRem(23);
  }
  :deep(.button-content) {
    // @include hamburgerCTA;
  }
}
</style>
