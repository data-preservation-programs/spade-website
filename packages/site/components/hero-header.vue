<template>
  <div :class="['hero-header', { 'error-page': errorPage }]">

    <div class="main-panels">
      <div class="panel-before">
        <ResponsiveClipper
          :key="`clip-before-small-${small}`"
          :display-guides="false"
          :breakpoints-x="small ? [30, 100, 280, 330] : [30, 750]"
          :breakpoints-y="small ? [50, 400] : [30, 150, 420, 500]">
          <template #svg-path>
            <HeroMainClipLeft v-if="!small" />
            <HeroMainClipLeftMobile v-else />
          </template>
          <template #clipped-content>
            <div class="main-bg-panel-before"></div>
          </template>
          <template #overlay-content>
            <TextBlock :block="textblock" class="hero-text-block" />
          </template>
        </ResponsiveClipper>
      </div>

      <div class="panel-after">
        <div class="stretch-wrapper">
          <ResponsiveClipper
            :key="`clip-after-small-${small}`"
            :display-guides="false"
            :breakpoints-x="small ? [30, 100, 280, 330] : [120, 470]"
            :breakpoints-y="small ? [70, 130] : [30, 150, 420, 500]">
            <template #svg-path>
              <HeroMainClipRight v-if="!small" />
              <HeroMainClipRightMobile v-else />
            </template>
            <template #clipped-content>
              <div class="main-bg-panel-after"></div>
            </template>
            <template #overlay-content>
              <div v-if="small && !errorPage" class="graph-block">
                <DataOnboardingTrendMobile class="graph" />
                <div class="caption">
                  {{ imageblock.caption }}
                </div>
              </div>
              <TextBlock v-if="errorPage" :block="errorblock" />
            </template>
          </ResponsiveClipper>
        </div>
      </div>
    </div>

    <div v-if="cardsblock" class="grid-noGutter-noBottom-equalHeight">

      <div v-if="!small" class="col-3">
        <div class="graph-block">
          <ImageBlock :block="imageblock" />
          <DataOnboardingTrendLine class="graph" />
          <div class="caption">
            {{ imageblock.caption }}
          </div>
        </div>
      </div>

      <div class="col-9_sm-12">
        <div class="card-block-wrapper">
          
          <ResponsiveClipper
            :key="`card-list-clip-small-${small}`"
            :display-guides="false"
            :breakpoints-x="small ? [30, 100, 260, 330] : [30, 700]"
            :breakpoints-y="[30, 120]">
            <template #svg-path>
              <HeroCardListClip v-if="!small" />
              <HeroCardListClipMobile v-else />
            </template>
            <template #clipped-content>
              <div class="card-block-background"></div>
            </template>
          </ResponsiveClipper>

          <CardListBlock :block="cardsblock" />

        </div>
      </div>
    
    </div>
  </div>
</template>

<script setup>
// ===================================================================== Imports
import HeroMainClipLeft from './svgs/hero-main-clip-left'
import HeroMainClipRight from './svgs/hero-main-clip-right'
import HeroMainClipLeftMobile from './svgs/hero-main-clip-left-mobile'
import HeroMainClipRightMobile from './svgs/hero-main-clip-right-mobile'
import TextBlock from './blocks/text-block'
import ImageBlock from './blocks/image-block'
import CardListBlock from './blocks/card-list-block'
import DataOnboardingTrendLine from './svgs/data-onboarding-trend-line'
import DataOnboardingTrendMobile from './svgs/data-onboarding-trend-mobile'
import HeroCardListClip from './svgs/hero-card-list-clip'
import HeroCardListClipMobile from './svgs/hero-card-list-clip-mobile'

// ======================================================================== Data
const resizeEventListener = ref(false)
const small = ref(false)

// ======================================================================= Props
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  errorPage: {
    type: Boolean,
    required: false,
    default: false
  }
})

// ==================================================================== Computed
const textblock = computed(() => props.block.textblock)
const imageblock = computed(() => props.block.imageblock)
const cardsblock = computed(() => props.block.cardsblock)
const errorblock = computed(() => props.block.errorblock)

// ======================================================================= Hooks
onMounted(() => {
  resizeHandler()
  resizeEventListener.value = zeroThrottle(() => { resizeHandler() }, 50)
  window.addEventListener('resize', resizeEventListener.value)
})

onBeforeUnmount(() => {
  if (resizeEventListener.value) {
    window.removeEventListener('resize', resizeEventListener.value)
  }
})

// ===================================================================== Methods
/**
 * @method resizeHandler
 */
 const resizeHandler = () => {
  if (window.matchMedia('(max-width: 53.125rem)').matches) {
    if (!small.value) {
      small.value = true
    }
  } else {
    if (small.value) {
      small.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hero-header {
  [class~=grid], [class*=grid-], [class*=grid_] {
    width: 100%;
    padding: 0 !important;
  }
  &.error-page {
    .panel-before {
      width: 35%;
      @include gridMaxMQ {
        width: 40%;
      }
      .hero-text-block {
        padding: toRem(313) toRem(114);
        @include large {
          padding: toRem(313) toRem(80);
        }
        @include small {
          padding: toRem(89) toRem(25) toRem(114) toRem(25);
        }
        :deep(.heading) {
          margin-bottom: 0;
          @include small {
            display: flex;
            justify-content: center;
          }
        }
        :deep(.h1) {
          width: fit-content;
          font-size: toRem(100);
          @include medium {
            font-size: toRem(54);
            line-height: leading(70, 54);
            letter-spacing: 0.54px;
          }
        }
      }
    }
    .panel-after {
      width: 65%;
      @include gridMaxMQ {
        width: 60%;
      }
      :deep(.main-bg-panel-after) {
        &:before {
          transform: translate(calc(-50% - toRem(50)), calc(-50% - toRem(50))) scale(1.7);
          @include small {
            transform: translate(-50%, calc(-50% - toRem(50))) scale(1.7, -1.7);
          }
        }
      }
      :deep(.overlay-content) {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      :deep(.text-block) {
        padding-left: 22%;
        @include small {
          padding: toRem(149) toRem(25) toRem(264) toRem(25);
        }
        .heading {
          color: $perano;
          @include small {
            display: flex;
            justify-content: center;
          }
          .h2 {
            @include large {
              font-size: toRem(32);
            }
            @include medium {
              font-size: toRem(24);
              white-space: nowrap;
            }
          }
        }
        .text-wrapper {
          display: none;
        }
        .button-row {
          @include small {
            display: flex;
            justify-content: center;
          }
        }
      }
    }
  }
}

.main-panels {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: toRem(8);
  @include small {
    flex-direction: column;
  }
}

.panel-before {
  width: 67.5%;
  @include small {
    width: 100% !important;
    margin-bottom: -2.375rem !important;
  }
}

.panel-after {
  width: 32.5%;
  @include small {
    width: 100% !important;
  }
  .stretch-wrapper {
    height: 100%;
    margin-left: toRem(-84);
    @include small {
      margin: 0;
    }
  }
}

.main-bg-panel-before {
  position: relative;
  background-color: $blackPearl;
  height: 100%;
  @include small {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      @include radialGradientDarkBlue(90% 90% at 37% 33%);
    }
  }
}

.main-bg-panel-after {
  position: relative;
  background-color: $blackPearl;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: toRem(1087);
    height: toRem(1256);
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    background-image: url('/images/blue-gradient-squiggle.jpg');
    @include small {
      width: toRem(800);
      height: toRem(950);
      left: calc(50% - 2rem);
      top: calc(50% + 2rem);
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
}

.hero-text-block {
  padding: toRem(62) toRem(157) toRem(55) toRem(64);
  @include mini {
    padding: toRem(40) toRem(80) toRem(40) toRem(27);
  }
  @include tiny {
    padding: toRem(27) toRem(17);
  }
}

.graph-block,
.graph,
.caption {
  position: relative;
}

.graph {
  width: 100%;
  max-width: toRem(304);
  @include small {
    display: block;
    margin: 0 auto;
  }
}

.graph-block {
  padding: toRem(24) toRem(35);
  @include medium {
    padding: toRem(14) toRem(25);
  }
  @include small {
    padding: toRem(62) toRem(27) toRem(16) toRem(27);
  }
}

.caption {
  margin-top: toRem(18);
  font-family: $fontSuisseIntl;
  font-size: toRem(16);
  line-height: leading(24, 16);
  letter-spacing: 0.48px;
  color: white;
  @include medium {
    font-size: toRem(14);
    margin-top: toRem(6);
  }
  @include small {
    max-width: toRem(304);
    margin: toRem(18) auto 0 auto;
  }
}

:deep(.image-block) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: toRem(8);
  overflow: hidden;
  .background-image {
    position: absolute;
    left: 50%;
    top: 50%;
    width: toRem(1087);
    height: toRem(1256);
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    background-image: url('/images/blue-gradient-squiggle.jpg');
  }
  caption {
    display: none;
  }
}

.card-block-wrapper {
  position: relative;
  margin-left: toRem(11);
  @include small {
    margin: 0;
  }
  :deep(.responsive-clip-path) {
    position: absolute;
    height: calc(100% + toRem(37));
  }
}

.card-block-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $blackPearl;
  border-radius: toRem(8);
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    right: toRem(-150);
    top: calc(50% - toRem(375));
    width: toRem(750);
    height: toRem(750);
    @include radialGradientDarkBlue(50% 50% at 50% 50%);
  }
}

:deep(.card-list-block) {
  position: relative;
  padding: toRem(30) toRem(42);
  @include medium {
    padding: toRem(20) toRem(20);
  }
  @include mini {
    padding: toRem(20) toRem(10);
  }
  @include tiny {
    padding: 0 toRem(4);
  }
  .card-wrapper {
    position: relative;
    &:not(:last-child) {
      .card {
        margin-right: toRem(32);
        @include large {
          margin-right: toRem(8);
        }
        @include medium {
          margin-right: 0;
        }
      }
    }
    &:last-child {
      @include mini {
        flex-basis: 100% !important;
        max-width: 100% !important;
        .card {
          padding: 0 toRem(16);
          .description,
          .cta {
            text-align: center;
          }
        }
      }
    }
  }
  .card {
    &:not(.theme__big-number) {
      margin-top: toRem(26);
      @include mini {
        margin-top: toRem(2);
      }
      .cta {
        .button-content {
          display: block;
          width: fit-content;
          transition: 200ms ease;
          font-family: $fontSuisseIntl;
          font-size: toRem(16);
          font-weight: 500;
          line-height: leading(27, 16);
          letter-spacing: 0.48px;
          color: $electricLime;
          @include medium {
            font-size: toRem(14);
          }
          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>