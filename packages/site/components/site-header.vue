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
    <div class="grid-noBottom-noGutter full">
      <div class="col-12">
        <div class="navigation-wrapper">
          <div class="grid-middle-noGutter-noBottom main-content">

            <div class="col-4_lg-2_sm-6">
              <NuxtLink to="/" class="logo">
                <SiteLogo />
              </NuxtLink>
            </div>

            <div class="col-4_lg-5_sm-hidden" data-push-left="off-0">
              <Navbar :links="navigation" class="desktop" />
            </div>

            <div class="col-4_lg-5_sm-6" data-push-left="off-0">
              <div class="nav-ctas">

                <ButtonCta
                  v-for="cta in ctas"
                  :key="cta.component || cta.text"
                  :tag="cta.tag"
                  :target="cta.target"
                  :theme="cta.theme"
                  :to="cta.to"
                  :class="zeroSlugify(cta.icon || cta.text)">
                  <component
                    :is="getCtaComponent(cta.icon)"
                    v-if="cta.icon"
                    class="icon" />
                  <span v-if="cta.text">
                    {{ cta.text }}
                  </span>
                </ButtonCta>

                <div class="nav-toggle-wrapper">
                  <ZeroButton
                    tag="button"
                    @click="toggleNav">
                    <div :class="['hamburger', { open: navigationOpen }]">
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
    padding: toRem(5) 0;
    width: 100%;
    height: $siteHeaderHeightMobile;
    z-index: 2;
  }
  &.nav-panel-open {
    position: fixed;
    width: 100%;
    z-index: 1000;
    .main-content,
    .mobile-background-panel {
      z-index: 1001;
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
  width: 100%;
  @include small {
    padding: toRem(0) toRem(19);
  }
}

.logo {
  display: flex;
  width: fit-content;
  transition: 250ms ease;
  &:hover,
  &:focus-visible {
    transform: scale(1.08);
  }
  @include small {
    width: toRem(64);
  }
  :deep(svg) {
    path {
      transition: 250ms ease;
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
    margin-left: -1rem;
  }
  @include medium {
    padding-left: toRem(18);
  }
  @include small {
    justify-content: flex-end;
  }
  :deep(.button) {
    margin-right: toRem(10);
    &:nth-child(3) {
      margin-right: auto;
    }
    &:nth-last-child(2) {
      margin-right: 0;
    }
    @include medium {
      &:not(:nth-last-child(2)) {
        margin-right: toRem(8);
      }
      &:not(.theme__icon) {
        &:nth-child(3) {
          margin-right: toRem(10);
        }
        .inner-content {
          padding: toRem(6) toRem(16);
        }
        .button-content {
          font-size: toRem(14);
        }
      }
    }
    @include small {
      &.button-x {
        &:not(.login) {
          display: none;
        }
      }
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
  margin-left: 0.5rem;
  @include small {
    display: flex;
    justify-content: flex-end;
  }
  :deep(.button) {
    padding: toRem(5);
    margin: 0 !important;
  }
}

.hamburger {
  position: relative;
  width: toRem(22);
  height: toRem(9);
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    transition: 250ms ease;
    border: solid 1px $electricLime;
    border-radius: 1px;
  }
  &:before {
    bottom: calc(100% - 1px);
  }
  &:after {
    top: calc(100% - 1px);
  }
  &.open {
    &:before {
      transform: translate(0, 4.5px) rotate(45deg);
    }
    &:after {
      transform: translate(0, -4.5px) rotate(-45deg)
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
  top: $siteHeaderHeightMobile;
  left: 0.5rem;
  width: calc(100vw - 1rem);
  height: calc(100vh - $siteHeaderHeightMobile - 0.5rem);
  background-color: $blackPearl;
  border-radius: toRem(8);
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
