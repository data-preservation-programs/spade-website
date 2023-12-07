<template>
  <header
    id="site-header"
    :class="['site-header', { 'nav-panel-open': navigationOpen }]">

    <!-- ============================================================ Mobile -->
    <div :class="['mobile-background-panel', {'open': navigationOpen }]">
      <div class="mobile-nav">

        <Navbar
          :links="navigation"
          class="mobile"
          @nav-link-click="handleNavClick">
          <div class="nav-item">
            <ButtonCta
              tag="nuxt-link"
              to="/"
              theme="gradient-light"
              class="modal-sign-up-cta">
              Sign up
            </ButtonCta>
          </div>
        </Navbar>
        
        <div class="icon-links">
          <template v-for="cta in ctas">
            <ButtonCta
              v-if="cta.icon"
              :key="`${cta.icon}-mobile`"
              :tag="cta.tag"
              :target="cta.target"
              :theme="cta.theme"
              :to="cta.to"
              :class="zeroSlugify(cta.icon)">
              <component :is="getCtaComponent(cta.icon)" class="icon" />
            </ButtonCta>
          </template>
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
  position: relative;
  background-color: $blackPearl;
  height: calc($siteHeaderHeight - 1rem);
  border-radius: toRem(8);
  @include small {
    height: calc($siteHeaderHeightMobile - toRem(10));
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      @include radialGradientDarkBlue(100% 200% at 0 50%);
    }
  }
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
  overflow: hidden;
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
    @include radialGradientDarkBlue(100% 150% at 0px 0px);
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: toRem(423);
    background-size: cover;
    background-position: center 110px;
    background-repeat: no-repeat;
    background-image: url('/images/blue-gradient-rectangles.svg');
  }
  &.open {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    z-index: 1000;
  }
  .nav-item {
    display: flex;
    justify-content: flex-start;
  }
}

.mobile-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: toRem(72);
  padding-bottom: toRem(50);
  height: 100%;
  z-index: 10;
}

.modal-sign-up-cta {
  margin-top: toRem(29);
  margin-left: toRem(16);
}

.icon-links {
  display: flex;
  padding: 0 toRem(32);
  :deep(.theme__icon) {
    @include small {
      padding: toRem(16);
      width: toRem(64);
      height: toRem(64);
      &:not(:last-child) {
        margin-right: toRem(12);
      }
      .icon {
        width: toRem(32);
        height: toRem(32);
      }
    }
  }
}
</style>
