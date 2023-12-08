<template>
  <section class="infographic-container">
    
    <div class="section-heading">
      <div class="grid-noGutter-noBottom">
        <div class="col-6">
          <div class="heading">
            {{ block.heading }}
          </div>
        </div>
      </div>
    </div>

    <div class="infographic">

      <div class="section-info-card">
        <div class="card-track">
          <div
            v-if="card"
            ref="cardRef"
            class="info-card"
            :style="{ transform: `translate(${cardX}px, -21px)`, height: cardHeight ? `${cardHeight + 40}px` : 'unset' }">
            <div ref="cardContent" class="card-content">

              <div class="card-number">
                <div class="number highlight-solid">
                  <div class="number-text">
                    {{ activeIndex }}
                  </div>
                </div>
              </div>

              <div class="heading">
                {{ card.heading }}
              </div>

              <div class="description">
                {{ card.description }}
              </div>

              <div class="nav-button">

              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="section-graphics">

        <div class="numbers-track" :style="{ '--track-highlight-width': `${cardX}px` }"></div>

        <div
          v-for="(stage, n) in stages"
          ref="stagesRef"
          :key="stage.name"
          :class="['stage', `stage-${n + 1}`, { active: activeIndex >= n + 1 }]"
          :style="{ 'flex-basis': `${stage.width}%`, 'max-width': `${stage.width}%` }">

          <div class="number-wrapper" :style="{ height: cardHeight ? `${cardHeight + 40}px` : 'unset' }">
            <button
              :class="['number', { hidden: activeIndex === n + 1 }]"
              @click="activeIndex = n + 1"
              :style="{ transform: `translateX(${numberOffsets[n]}px)` }">
              <div class="number-text">
                {{ n + 1 }}
              </div>
            </button>
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

  </section>
</template>

<script setup>
import InfographicArrow from './svgs/infographic-arrow'

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

const cardRef = ref(null)
const cardContent = ref(null)
const stagesRef = ref(null)
const activeIndex = ref(1)
const cardX = ref(0)
const cardHeight = ref(0)
const numberOffsets = ref([0, 0, 0, 0])

// ==================================================================== Computed
const stages = computed(() => props.block.stages)
const card = computed(() => stages.value[activeIndex.value - 1]?.card)

// ==================================================================== Watchers
watch(activeIndex, (val) => {
  moveCardTo(val)
})

watch(card, () => {
  nextTick(() => {
    cardHeight.value = cardContent.value.getBoundingClientRect().height
  })
}, { deep: true })

// ======================================================================= Hooks
// onMounted(() => {
//   setTimeout(() => {
//     nextTick(() => {
//       moveCardTo(1)
//     })
//   }, 1000)
// })

// ===================================================================== Methods
const moveCardTo = (index) => {
  if (stagesRef.value && cardRef.value && cardContent.value) {
    const stageWidths = stagesRef.value.map(stg => stg.getBoundingClientRect().width)
    const currentStage = stagesRef.value[index - 1]
    const width = currentStage.getBoundingClientRect().width
    const cardWidth = cardRef.value.getBoundingClientRect().width
    cardX.value = currentStage.offsetLeft + (width - cardWidth) * 0.5
    const arr = numberOffsets.value.map((_, i) => {
      const current = index - 1
      if (i === current) { return 0 }
      const dif = -1 * (current - i)
      return (2 / dif) * (100 / stageWidths[i]) * 100
    })
    numberOffsets.value = arr
    console.log(arr)
  }
}
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
.section-info-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  // transform: translateY(100%);
  z-index: 10;
}

.card-track {
  height: 0;
}

.number-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  transition: height 300ms ease;
}

.number {
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 2px $cornflowerBlue;
  border-radius: 50%;
  width: toRem(30);
  height: toRem(30);
  background-color: $blackPearl;
  transition: 300ms ease;
  opacity: 1;
  &.hidden {
    opacity: 0;
  }
  &.highlight-solid {
    background-color: $canary;
    border-color: $canary;
    .number-text {
      color: $woodsmoke;
    }
  }
}

.number-text {
  text-align: center;
  font-family: $fontSuisseIntl;
  font-size: toRem(18);
  font-weight: 500;
  line-height: leading(25, 18);
  letter-spacing: 0.36px;
  color: $cornflowerBlue;
}

.info-card {
  padding: toRem(20) toRem(23) toRem(20) toRem(75);
  width: 37%;
  border: solid 1px $cornflowerBlue;
  border-radius: toRem(10);
  background-color: $blackPearl;
  transition: 300ms ease;
  overflow: hidden;
  .heading,
  .description {
    color: $athensGray;
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    line-height: leading(22, 16);
  }
  .heading {
    font-weight: 500;
  }
}

.card-content {
  position: relative;
}

.card-number {
  position: absolute;
  top: 0;
  left: toRem(-55);
}

// //////////////////////////////////////////////////////////////////// Graphics
.section-graphics {
  position: relative;
  display: flex;
  justify-content: space-around;
}

.numbers-track {
  --track-highlight-width: 0;
  position: absolute;
  left: 0;
  top: toRem(14);
  width: 100%;
  height: 2px;
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &:before {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='969' height='3' viewBox='0 0 969 3' fill='none'%3e%3cpath d='M968.594 1.51562H0.875' stroke='%23648BF5' stroke-width='2' stroke-dasharray='4 7'/%3e%3c/svg%3e");
  }
  &:after {
    width: var(--track-highlight-width);
    transition: width 300ms ease;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='969' height='3' viewBox='0 0 969 3' fill='none'%3e%3cpath d='M968.594 1.51562H0.875' stroke='%23E8FF5A' stroke-width='2' stroke-dasharray='4 7'/%3e%3c/svg%3e");
  }
}

.stage {
  &.active {
    .number {
      border-color: $canary;
      .number-text {
        color: $canary;
      }
    }
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

.name {
  display: flex;
  justify-content: center;
  margin-top: toRem(52);
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