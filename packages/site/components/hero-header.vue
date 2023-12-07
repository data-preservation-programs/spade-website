<template>
  <div class="hero-header">

    <div class="main-panels">
      <div class="panel-left">
        <ResponsiveClipper
          :display-guides="false"
          :breakpoints-x="[30, 750]"
          :breakpoints-y="[30, 150, 420, 500]">
          <template #svg-path>
            <HeroMainClipLeft />
          </template>
          <template #clipped-content>
            <div class="main-bg-panel-left"></div>
          </template>
          <template #overlay-content>
            <TextBlock :block="textblock" class="hero-text-block" />
          </template>
        </ResponsiveClipper>
      </div>

      <div class="panel-right">
        <div class="stretch-wrapper">
          <ResponsiveClipper
            :display-guides="false"
            :breakpoints-x="[120, 470]"
            :breakpoints-y="[30, 150, 420, 500]">
            <template #svg-path>
              <HeroMainClipRight />
            </template>
            <template #clipped-content>
              <div class="main-bg-panel-right"></div>
            </template>
          </ResponsiveClipper>
        </div>
      </div>
    </div>

    <div class="grid-noGutter-noBottom-equalHeight">

      <div class="col-3">
        <div class="graph-block">
          <ImageBlock :block="imageblock" />
          <DataOnboardingTrendLine class="graph" />
          <div class="caption">
            {{ imageblock.caption }}
          </div>
        </div>
      </div>

      <div class="col-9">
        <div class="card-block-wrapper">
          
          <ResponsiveClipper
            :display-guides="false"
            :breakpoints-x="[30, 700]"
            :breakpoints-y="[30, 120]">
            <template #svg-path>
              <HeroCardListClip />
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
import HeroMainClipLeft from './svgs/hero-main-clip-left'
import HeroMainClipRight from './svgs/hero-main-clip-right'
import TextBlock from './blocks/text-block'
import ImageBlock from './blocks/image-block'
import CardListBlock from './blocks/card-list-block'
import DataOnboardingTrendLine from './svgs/data-onboarding-trend-line'
import HeroCardListClip from './svgs/hero-card-list-clip'

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

const textblock = computed(() => props.block.textblock)
const imageblock = computed(() => props.block.imageblock)
const cardsblock = computed(() => props.block.cardsblock)
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hero-header {
  [class~=grid], [class*=grid-], [class*=grid_] {
    width: 100%;
    padding: 0 !important;
  }
}

.main-panels {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: toRem(8);
}

.panel-left {
  width: 67.5%
}

.panel-right {
  width: 32.5%;
  .stretch-wrapper {
    height: 100%;
    margin-left: toRem(-84);
  }
}

.main-bg-panel-left {
  background-color: $blackPearl;
  height: 100%;
}

.main-bg-panel-right {
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
  }
}

.hero-text-block {
  padding: toRem(62) toRem(157) toRem(55) toRem(64);
}

.graph-block,
.graph,
.caption {
  position: relative;
}

.graph {
  width: 100%;
}

.graph-block {
  padding: toRem(24) toRem(35);
  @include medium {
    padding: toRem(14) toRem(25);
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
  }
  .card {
    &:not(.theme__big-number) {
      margin-top: toRem(26);
      .cta {
        .button-content {
          font-family: $fontSuisseIntl;
          font-size: toRem(16);
          font-weight: 500;
          line-height: leading(27, 16);
          letter-spacing: 0.48px;
          color: $electricLime;
          @include medium {
            font-size: toRem(14);
          }
        }
      }
    }
  }
}
</style>