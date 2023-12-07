<template>
  <footer id="site-footer">
    <div class="grid-noBottom-noGutter full">
      <div class="col-12">

        <ResponsiveClipper
          :key="`outer-tiny-${tiny}`"
          :display-guides="false"
          :breakpoints-x="tiny ? [40, 130, 240, 320] : [330, 1280]"
          :breakpoints-y="[150, 600]">

          <template #svg-path>
            <FooterClipPath v-if="!tiny" />
            <FooterClipPathMobile v-else />
          </template>

          <template #clipped-content>
            <div class="footer-clipped-background"></div>
          </template>

          <template #overlay-content>

            <div class="footer-content">

              <div class="card-wrapper">
                <ResponsiveClipper
                  :key="`inner-tiny-${tiny}`"
                  :display-guides="false"
                  :breakpoints-x="tiny ? [20, 110, 220, 300] : [300, 400]"
                  :breakpoints-y="[100, 400]">
                  <template #svg-path>
                    <FooterCardClipPath v-if="!tiny" />
                    <FooterCardClipPathMobile v-else />
                  </template>
                  <template #clipped-content>
                    <div class="footer-card-background"></div>
                  </template>
                  <template #overlay-content>
                    <div class="footer-card">

                      <div class="site-logo">
                        <SiteLogo />
                      </div>

                      <div v-if="card" class="image">
                        <img :src="card.image" :alt="zeroUnslugify(card.image)" />
                      </div>

                      <div v-if="card" class="links">
                        <ZeroButton
                          v-for="link in card.links"
                          :key="link.text"
                          class="footer-link">
                          {{ link.text }}
                        </ZeroButton>
                      </div>

                    </div>
                  </template>
                </ResponsiveClipper>
              </div>

              <div class="banner-bottom">
                <div class="grid-middle-noGutter-noBottom">

                  <div class="col-3" data-push-right="off-3">
                    <DataProgramsLogo class="dp-logo" />
                  </div>

                  <div class="col-3" data-push-left="off-3">
                    <div class="icon-links">
                      <ButtonCta
                        v-for="cta in iconLinks"
                        :key="`${cta.icon}-mobile`"
                        :tag="cta.tag"
                        :target="cta.target"
                        :theme="cta.theme"
                        :to="cta.to"
                        :class="zeroSlugify(cta.icon)">
                        <component :is="getCtaComponent(cta.icon)" class="icon" />
                      </ButtonCta>
                    </div>
                  </div>

                  <div
                    class="col-6_md-12 banner-col"
                    data-push-left="off-3_md-0">
                    <div
                      v-if="banner"
                      class="banner-text text"
                      v-html="banner.text">
                    </div>
                  </div>

                </div>
                
              </div>

            </div>

          </template>

        </ResponsiveClipper>
        
      </div>
    </div>
  </footer>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia'
import { useGeneralStore } from '../stores/general'
import FooterClipPath from './svgs/footer-clip-path'
import FooterClipPathMobile from './svgs/footer-clip-path-mobile'
import FooterCardClipPath from './svgs/footer-card-clip-path'
import FooterCardClipPathMobile from './svgs/footer-card-clip-path-mobile'
import DataProgramsLogo from './svgs/data-programs-logo'

const GithubIcon = resolveComponent('./icon/github')
const SlackIcon = resolveComponent('./icon/slack')
const MediumIcon = resolveComponent('./icon/medium')

// ======================================================================== Data
const resizeEventListener = ref(false)
const tiny = ref(false)
const generalStore = useGeneralStore()
const {
  siteContent
} = storeToRefs(generalStore)

// ==================================================================== Computed
const card = computed(() => {
  return siteContent.value?.general?.footer.card
})

const banner = computed(() => {
  return siteContent.value?.general?.footer.banner
})

const iconLinks = computed(() => {
  return siteContent.value?.general?.navigation.toolbar.filter(item => item.icon)
})

// ======================================================================= Hooks
onMounted(() => {
  resizeHandler()
  resizeEventListener.value = zeroThrottle(() => { resizeHandler() }, 50)
  window.addEventListener('resize', resizeEventListener.value)
})

// ===================================================================== Methods
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

/**
 * @method resizeHandler
 */
const resizeHandler = () => {
  if (window.matchMedia('(max-width: 25.9375rem)').matches) {
    if (!tiny.value) {
      tiny.value = true
    }
  } else {
    if (tiny.value) {
      tiny.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.footer-clipped-background {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $blackPearl;
  &:before {
    content: '';
    position: absolute;
    top: calc(50% + 6rem);
    left: 50%;
    width: toRem(1200);
    height: toRem(1386);
    background-image: url('/images/blue-gradient-squiggle.jpg');
    background-size: 100%;
    background-position: center;
    transform: translate(-50%, -50%) rotate(74.28deg);
    @include tiny {
      width: toRem(668);
      height: toRem(772);
      left: calc(50% + 1rem);
      transform: translate(-50%, -50%) rotate(43deg);
    }
  }
}

.footer-content {
  padding: toRem(23) toRem(23);
  width: 100%;
  [class~=grid], [class*=grid-], [class*=grid_] {
    width: 100%;
    padding: 0 !important;
  }
}

.card-wrapper {
  width: toRem(437);
  @include mini {
    width: toRem(354);
  }
  @include tiny {
    width: 100%;
  }
}

.footer-card-background {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
}

.footer-card {
  padding: toRem(25) toRem(14);
  width: 100%;
  @include tiny {
    padding: toRem(12) toRem(14);
  }
}

.site-logo {
  display: flex;
  width: fit-content;
  margin-bottom: toRem(29);
  @include tiny {
    margin-bottom: toRem(19);
  }
  :deep(svg) {
    path {
      fill: $woodsmoke;
    }
  }
}

.image {
  border-radius: toRem(10);
  overflow: hidden;
  margin-bottom: toRem(32);
  img {
    width: 100%;
    height: 100%;
  }
}

.links {
  padding: toRem(0) toRem(30);
  @include tiny {
    padding: toRem(0) toRem(18);
  }
}

.footer-link {
  position: relative;
  font-family: $fontSuisseIntl;
  font-size: toRem(16);
  font-weight: 500;
  line-height: leading(21, 16);
  padding: toRem(16) 0;
  padding-right: toRem(32);
  width: 100%;
  text-align: left;
  @include mini {
    font-size: toRem(14);
  }
  &:not(:last-child) {
    border-bottom: solid 1px #DFDFDF;
  }
  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    transition: 200ms ease;
    width: toRem(15);
    height: toRem(18);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='15' height='18' viewBox='0 0 15 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M-6.99382e-07 9L13 9M13 9L5.39023 17M13 9L5.39023 1' stroke='%230036DE' stroke-width='2.5'/%3e%3c/svg%3e ");
  }
  &:hover {
    &:after {
      transform: translate(1rem, -50%);
    }
  }
}

.banner-bottom {
  padding: toRem(18) toRem(44);
  margin-top: toRem(19);
  background-color: white;
  border-radius: toRem(10);
  @include tiny {
    padding: toRem(12) toRem(17);
    margin-top: toRem(313);
  }
  .text,
  :deep(a) {
    font-size: toRem(14);
    font-family: $fontSuisseIntl;
    font-weight: 500;
    line-height: 135%;
    @include mini {
      font-size: toRem(11);
    }
  }
}

.dp-logo {
  @include mini {
    width: toRem(107);
  }
}

.banner-col {
  position: relative;
}

.banner-text {
  width: 100%;
  position: absolute;
  transform: translateY(calc(-1.25rem - 50%));
  @include medium {
    transform: none;
    position: relative;
    text-align: center;
    padding-top: toRem(22);
    text-align: left;
  }
  @include mini {
    padding-top: toRem(14);
  }
}

.icon-links {
  display: flex;
  justify-content: flex-end;
  :deep(.theme__icon) {
    margin-right: toRem(12);
    &:last-child {
      margin-right: 0;
    }
    @include mini {
      margin-right: 0;
    }
    .icon {
      width: toRem(28);
      height: toRem(28);
      @include mini {
        width: toRem(21);
        height: toRem(21);
      }
    }
    svg {
      path {
        fill: $woodsmoke;
      }
    }
  }
}
</style>
