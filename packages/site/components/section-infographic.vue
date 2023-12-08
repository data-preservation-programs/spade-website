<template>
  <div class="infographic">

    <div class="section-heading">
      <div class="grid-noGutter-noBottom">
        <div class="col-6">
          <div class="heading">
            {{ block.heading }}
          </div>
        </div>
      </div>
    </div>

    <div class="section-info">

    </div>

    <div class="section-graphics">

      <div
        v-for="(stage, n) in stages"
        :key="stage.name"
        :class="['stage', `stage-${n + 1}`, { active: activeIndex >= n + 1 }]"
        :style="{ 'flex-basis': `${stage.width}%`, 'max-width': `${stage.width}%` }">

        <div class="number-wrapper">
          <div class="number">
            {{ n + 1 }}
          </div>
        </div>

        <div class="name">
          <div class="text blue-border border-md">
            {{ stage.name }}
          </div>
        </div>

        <div
          v-if="n + 1 === 1"
          class="tenant blue-border border-lg">
          <div class="tenants">
            <div v-for="i in 8" :key="`folder-${i}`" class="folder">
              <IconFolder class="icon" />
            </div>
          </div>
          <div class="collections">
            Collections
          </div>
        </div>

        <div
          v-if="n + 1 === 2"
          class="policy">
          <svg
            class="dashed-line"
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="381"
            viewBox="0 0 11 381"
            fill="none">
            <path
              d="M5.91406 0.109375L5.91408 380.828"
              stroke="#E8FF5A"
              stroke-width="10"
              stroke-dasharray="4 7" />
          </svg>
          <div class="arrow-wrapper">
            <InfographicArrow class="arrow" />
          </div>
        </div>

        <div
          v-if="n + 1 === 3"
          class="broker-service">
          <div class="logo blue-border border-lg">
            <SiteLogo />
          </div>
          <div class="arrow-wrapper">
            <InfographicArrow class="arrow" />
          </div>
        </div>

        <div
          v-if="n + 1 === 4"
          class="storage-provider">
          <div class="sps">
            <div
              v-for="i in 7"
              :key="`sp-col-${i}`"
              :class="['sp-col', { offset: i % 2 === 0 }]">
              <div
                v-for="j in 3"
                :key="`sp-${i}-${j}`"
                class="sp blue-border border-sm">
                <IconServer />
                <span>
                  SP
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>

  </div>
</template>

<script setup>
import InfographicArrow from './svgs/infographic-arrow'

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

const activeIndex = ref(1)

const stages = computed(() => props.block.stages)
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.infographic {
  position: relative;
  padding: 0 toRem(48);
  color: white;
}

.section-heading {
  position: relative;
  margin-bottom: toRem(75);
  [class~=grid], [class*=grid-], [class*=grid_] {
    width: 100%;
    padding: 0 !important;
  }
  .heading {
    color: #EAEAED;
    font-family: $fontSuisseIntl;
    font-size: toRem(24);
    font-weight: 600;
    line-height: leading(36, 24);
    letter-spacing: 0.48px;
  }
}

// //////////////////////////////////////////////////////////////////// Controls
.number-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 2px $cornflowerBlue;
  border-radius: 50%;
  width: toRem(30);
  height: toRem(30);
  background-color: $blackPearl;
}

.number {
  text-align: center;
  font-family: $fontSuisseIntl;
  font-size: toRem(18);
  font-weight: 500;
  line-height: leading(25, 18);
  letter-spacing: 0.36px;
  color: $cornflowerBlue;
}
// //////////////////////////////////////////////////////////////////// Graphics
.section-graphics {
  position: relative;
  display: flex;
  justify-content: space-around;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: toRem(14);
    width: 100%;
    height: 2px;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='969' height='3' viewBox='0 0 969 3' fill='none'%3e%3cpath d='M968.594 1.51562H0.875' stroke='%23648BF5' stroke-width='2' stroke-dasharray='4 7'/%3e%3c/svg%3e");
  }
}

.stage {
  &.active {
    .blue-border {
      &:before {
        opacity: 1;
      }
    }
    path {
      stroke: $canary;
    }
    .arrow {
      :deep(path) {
        fill: $canary;
      }
    }
  }
}

// .stage-2 {
//   .text {
//     background-color: $blackPearl;
//   }
// }

.name {
  display: flex;
  justify-content: center;
  margin-bottom: toRem(22);
  .text {
    text-align: center;
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    font-weight: 500;
    line-height: leading(22, 16);
    letter-spacing: 0.32px;
    padding: toRem(6) toRem(20);
    border-radius: toRem(5);
    &:before {
      border-radius: toRem(5);
      box-shadow: none !important;
    }
  }
}

.blue-border {
  position: relative;
  border-style: solid;
  border-color: $toreaBay;
  border-radius: toRem(10);
  transition: 200ms ease;
  &.border-lg {
    border-width: 3px;
    &:before {
      transform: translate(-3px, -3px);
    }
  }
  &.border-md {
    border-width: 2px;
    &:before {
      transform: translate(-2px, -2px);
    }
  }
  &.border-sm {
    border-width: 1.5px;
    &:before {
      transform: translate(-1.5px, -1.5px);
    }
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-width: inherit;
    border-style: solid;
    border-color: $canary;
    border-radius: toRem(10);
    transition: inherit;
    box-sizing: content-box;
    box-shadow: inset 0px 0px 7.221px 0.722px $scienceBlue, 0px 0px 7.221px 0.722px $scienceBlue;
    opacity: 0;
  }
}

.tenant {
  padding: toRem(13) toRem(34);
  .collections {
    color: $cornflowerBlue;
    text-align: center;
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    font-weight: 500;
    line-height: leading(22, 16);
    margin-top: toRem(11);
  }
}

.tenants {
  display: flex;
  flex-wrap: wrap;
}

.folder {
  flex-basis: 25%;
  .icon {
    display: block;
    margin: toRem(11) auto;
  }
}

.policy {
  position: relative;
  .dashed-line {
    position: absolute;
    left: calc(50% - 5px);
    top: toRem(-18);
    path {
      stroke: $toreaBay;
    }
  }
}

.arrow-wrapper {
  position: absolute;
  left: 0;
  top: toRem(70);
  width: 100%;
  height: toRem(26);
  overflow: hidden;
  .arrow {
    position: absolute;
    right: toRem(25);
    :deep(path) {
      fill: $toreaBay;
    }
  }
}

.broker-service {
  display: flex;
  justify-content: center;
  .logo {
    padding: toRem(38);
    max-width: toRem(155);
    transform: translateY(toRem(20));
    :deep(svg) {
      margin-top: toRem(4);
    }
  }
  .arrow-wrapper {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    .arrow {
      position: absolute;
      right: 0;
    }
  }
}

.storage-provider {

}

.sps {
  display: flex;
  justify-content: center;
}

.sp-col {
  display: flex;
  flex-direction: column;
  padding: 0 toRem(4);
  &.offset {
    transform: translateY(toRem(18));
  }
}

.sp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: toRem(7);
  padding: toRem(6) toRem(5);
  span {
    color: #545F7B;
    text-align: center;
    font-family: $fontSuisseIntl;
    font-size: toRem(10.5);
    font-weight: 500;
    line-height: 140%;
    letter-spacing: 0.211px;
  }
}
</style>