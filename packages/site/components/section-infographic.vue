<template>
  <section class="infographic-container">
    
    <div class="section-heading">
      <div class="grid-noGutter-noBottom">
        <div class="col-6_md-8_sm-12">
          <div class="heading">
            {{ block.heading }}
          </div>
        </div>
      </div>
    </div>

    <div class="infographic">

      <div class="section-info-card">

        <div v-if="mobile" class="mobile-numbers">
          <div
            v-for="(stage, n) in stages"
            :key="`mobile-${stage.name}-tab`"
            :class="['number-wrapper', { 'mobile-active': activeIndex >= n + 1 }]">
            <button
              :class="['number', { 'highlight-solid': activeIndex === n + 1 }]"
              @click="activeIndex = n + 1">
              <div class="number-text">
                {{ n + 1 }}
              </div>
            </button>
          </div>
        </div>

        <div ref="track" class="card-track">
          <div
            v-if="card"
            ref="cardRef"
            class="info-card"
            :style="{ transform: `translate(${cardX}px, ${mobile ? 0 : -21}px)`, height: cardHeight ? `${cardHeight + (mobile ? 22 : 40)}px` : 'unset' }">
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

              <div class="nav-buttons">
                <button
                  v-if="activeIndex !== 1"
                  class="button button-before"
                  @click="activeIndex = Math.max(1, activeIndex - 1)">
                  Back
                </button>
                <button
                  class="button button-after"
                  @click="activeIndex = activeIndex === stages.length ? 1 : Math.min(stages.length, activeIndex + 1)">
                  {{ buttonAfterText }}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="section-graphics">

        <div v-if="!mobile" class="numbers-track" :style="{ '--track-highlight-width': `${cardX}px` }"></div>

        <template v-for="(stage, n) in stages">
          <div
            v-if="(!mobile || activeIndex >= n + 1) || (mobile && (activeIndex === 3))"
            ref="stagesRef"
            :key="stage.name"
            :class="['stage', `stage-${n + 1}`, { active: activeIndex >= n + 1 }]"
            :style="mobile ? null : { 'flex-basis': `${stage.width}%`, 'max-width': `${stage.width}%` }">

            <div class="number-wrapper" :style="{ height: cardHeight && !mobile ? `${cardHeight + 40}px` : 'unset' }">
              <button
                :class="['number', { hidden: !mobile && activeIndex === n + 1 }, { 'highlight-solid': mobile && activeIndex === n + 1 }]"
                :style="{ transform: `translateX(${numberOffsets[n]}px)` }"
                @click="activeIndex = n + 1">
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
                <span v-if="mobile">Broker Service</span>
              </div>
              <div class="arrow-wrapper">
                <InfographicArrow class="arrow" />
              </div>
            </div>

            <div
              v-if="n + 1 === 4"
              class="storage-provider">
              <div class="arrow-wrapper secondary top">
                <InfographicArrow class="arrow" />
              </div>
              <div class="arrow-wrapper secondary bottom">
                <InfographicArrow class="arrow" />
              </div>
              <div class="sps">
                <div
                  v-for="i in (mobile ? 8 : 7)"
                  :key="`sp-col-${i}`"
                  :class="['sp-col', `sp-col-${i}`, { offset: i % 2 === (mobile ? 1 : 0) }]">
                  <div
                    v-for="j in (mobile ? 2 : 3)"
                    :key="`sp-${i}-${j}`"
                    :class="['sp', 'blue-border', 'border-sm', { mute: !['1-3', '2-1', '4-1', '6-2'].includes(`${i}-${j}`) }]">
                    <IconServer />
                    <span>
                      SP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </template>
     
      </div>
    
    </div>

  </section>
</template>

<script setup>
// ====================================================================== Import
import InfographicArrow from './svgs/infographic-arrow'

// ======================================================================= Props
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

// ======================================================================== Data
const cardRef = ref(null)
const cardContent = ref(null)
const stagesRef = ref(null)
const track = ref(null)
const activeIndex = ref(1)
const cardX = ref(0)
const cardHeight = ref(0)
const numberOffsets = ref([0, 0, 0, 0])
const resizeEventListener = ref(false)
const mobile = ref(false)

// ==================================================================== Computed
const stages = computed(() => props.block.stages)
const card = computed(() => stages.value[activeIndex.value - 1]?.card)
const buttonAfterText = computed(() => activeIndex.value === stages.value.length ? 'Restart' : 'Next step' )
// ==================================================================== Watchers
watch(activeIndex, (val) => {
  moveCardTo(val)
})

watch(card, () => {
  nextTick(() => { setCardHeight() })
}, { deep: true })

// ======================================================================= Hooks
onMounted(() => {
  resizeInfographic()
  resizeEventListener.value = zeroThrottle(() => { resizeInfographic() }, 50)
  window.addEventListener('resize', resizeEventListener.value)
  setTimeout(() => { resizeInfographic() }, 500)
})

onBeforeUnmount(() => {
  if (resizeEventListener.value) {
    window.removeEventListener('resize', resizeEventListener.value)
  }
})

// ===================================================================== Methods
const moveCardTo = (index) => {
  if (stagesRef.value && cardRef.value && cardContent.value && track.value) {
    if (!mobile.value) {
      const trackWidth = track.value.getBoundingClientRect().width
      const stageWidths = stagesRef.value.map(stg => stg.getBoundingClientRect().width)
      const currentStage = stagesRef.value[index - 1]
      const width = currentStage.getBoundingClientRect().width
      const cardWidth = cardRef.value.getBoundingClientRect().width
      // console.log(trackWidth)
      cardX.value = Math.max(0, Math.min(currentStage.offsetLeft + (width - cardWidth) * 0.5 + 45, trackWidth - cardWidth))
      const arr = numberOffsets.value.map((_, i) => {
        const current = index - 1
        if (i === current) { return 0 }
        const dif = -1 * (current - i)
        return (2 / dif) * (100 / stageWidths[i]) * 100
      })
      numberOffsets.value = arr
    } else {
      cardX.value = 0
      numberOffsets.value = [0, 0, 0, 0]
    }
  }
}

const setCardHeight = () => {
  cardHeight.value = cardContent.value.getBoundingClientRect().height
}

const resizeInfographic = () => {
  if (window.matchMedia('(max-width: 64rem)').matches) {
    if (!mobile.value) {
      mobile.value = true
    }
  } else {
    if (mobile.value) {
      mobile.value = false
    }
  }
  nextTick(() => {
    moveCardTo(activeIndex.value)
    setCardHeight()
  })
}

</script>

<style lang="scss" scoped>
$animationSpeed: 500ms;
// ///////////////////////////////////////////////////////////////////// General
.infographic {
  position: relative;
  padding: 0 toRem(48);
  color: white;
  @include medium {
    padding: 0;
  }
}

.section-heading {
  position: relative;
  margin-bottom: toRem(95);
  @include medium {
    margin-bottom: toRem(18);
  }
  @include tiny {
    padding: 0 toRem(22);
  }
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
    margin: 0 toRem(-41);
    @include large {
      margin: 0;
      padding: toRem(20);
    }
    @include medium {
      padding: 0;
      font-size: toRem(16);
      line-height: leading(22, 16);
    }
  }
}

// //////////////////////////////////////////////////////////////////// Controls
.section-info-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  z-index: 10;
  @include medium {
    position: relative;
    display: flex;
    justify-content: space-between;
    height: unset;
    padding: 0 toRem(22) 0 3rem;
    margin-bottom: toRem(24);
    min-height: 10rem;
  }
}

.card-track {
  height: 0;
  @include medium {
    height: unset;
    width: 100%;
  }
}

.number-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  transition: height $animationSpeed ease;
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
  transition: $animationSpeed ease;
  opacity: 1;
  z-index: 100;
  &.hidden {
    opacity: 0;
  }
  &.highlight-solid {
    background-color: $canary;
    border-color: $canary;
    .number-text {
      color: $woodsmoke !important;
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
  transition: $animationSpeed ease;
  overflow: hidden;
  z-index: 101;
  @include medium {
    width: 100%;
    padding: toRem(10) toRem(15);
  }
  .heading,
  .description,
  .button {
    color: $athensGray;
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    line-height: leading(22, 16);
    @include medium {
      font-size: toRem(14);
      line-height: leading(19, 14);
    }
  }
  .heading {
    margin-bottom: toRem(12);
  }
  .heading,
  .button {
    font-weight: 500;
  }
  .button {
    display: block;
    width: fit-content;
    transition: 200ms ease;
    &:hover {
      transform: scale(1.1);
    }
  }
}

.card-content {
  position: relative;
}

.card-number {
  position: absolute;
  top: 0;
  left: toRem(-55);
  @include medium {
    display: none;
  }
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: toRem(12);
  .button-after {
    color: $canary;
  }
}

// //////////////////////////////////////////////////////////////////// Graphics
.section-graphics {
  position: relative;
  display: flex;
  justify-content: space-around;
  @include medium {
    flex-direction: column;
  }
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
    transition: width $animationSpeed ease;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='969' height='3' viewBox='0 0 969 3' fill='none'%3e%3cpath d='M968.594 1.51562H0.875' stroke='%23E8FF5A' stroke-width='2' stroke-dasharray='4 7'/%3e%3c/svg%3e");
  }
}

.stage {
  @include medium {
    position: relative;
    padding: toRem(13) toRem(48);
    animation: 500ms ease 0s 1 normal forwards running fadein;
    .number-wrapper {
      position: absolute;
      left: 0.625rem;
      top: 0;
    }
  }
  &.active {
    .number {
      border-color: $canary;
      .number-text {
        color: $canary;
      }
    }
    .blue-border {
      &:not(.mute) {
        &:before {
          opacity: 1;
        }
      }
    }
    path {
      stroke: $canary;
    }
    .arrow {
      :deep(path) {
        fill: $canary;
        @include mini {
          filter: drop-shadow(0px 0px 2.149px #0740F9);
          z-index: -1;
        }
      }
    }
    .dashed-line {
      path {
        stroke: $canary;
      }
    }
  }
}

.stage-2 {
  @include medium {
    height: toRem(61);
    padding-bottom: 0;
  }
}

.stage-3 {
  .name {
    justify-content: flex-start;
  }
  @include medium {
    padding-top: 0;
  }
}

.stage-3,
.stage-4 {
  @include medium {
    .name {
      display: none;
    }
  }
}

.name {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-top: toRem(52);
  margin-bottom: toRem(22);
  @include medium {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0;
  }
  .text {
    text-align: center;
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    font-weight: 500;
    line-height: leading(22, 16);
    letter-spacing: 0.32px;
    padding: toRem(6) toRem(20);
    border-radius: toRem(5);
    background-color: $blackPearl;
    @include medium {
      font-size: toRem(13);
      line-height: leading(18, 13);
      padding: toRem(4) toRem(14);
    }
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
  border-radius: toRem(6);
  transition: 200ms ease;
  &.border-lg {
    border-width: 3px;
    &:before {
      border-width: 3px;
      transform: translate(-3px, -3px);
    }
  }
  &.border-md {
    border-width: 2px;
    &:before {
      border-width: 2px;
      transform: translate(-2px, -2px);
    }
  }
  &.border-sm {
    border-width: 1.5px;
    @include medium {
      border-radius: toRem(5);
    }
    &:before {
      border-width: 1.5px;
      transform: translate(-1.5px, -1.5px);
      @include medium {
        border-radius: toRem(5);
      }
    }
  }
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-style: solid;
    border-color: $canary;
    border-radius: toRem(6);
    transition: inherit;
    box-sizing: content-box;
    box-shadow: inset 0px 0px 7.221px 0.722px $scienceBlue, 0px 0px 7.221px 0.722px $scienceBlue;
    opacity: 0;
  }
}

.tenant {
  padding: toRem(13) toRem(34);
  @include medium {
    width: 75%;
    margin: 0 auto;
  }
  @include small {
    width: unset;
  }
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
  @include medium {
    .arrow-wrapper {
      top: 0;
      left: calc(50% - 4px);
      transform: translate(-50%, -6px) rotate(90deg) scale(0.9);
      width: toRem(74);
      .arrow {
        right: 0;
      }
    }
  }
  .dashed-line {
    position: absolute;
    left: calc(50% - 5px);
    top: toRem(-144);
    path {
      stroke: $toreaBay;
    }
    @include medium {
      transform: rotate(90deg);
      top: toRem(-191);
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
  position: relative;
  display: flex;
  justify-content: center;
  padding-right: 0.5rem;
  @include medium {
    flex-direction: column;
  }
  .logo {
    padding: toRem(38);
    max-width: toRem(155);
    transform: translateY(toRem(20));
    :deep(svg) {
      display: block;
      margin-top: toRem(4);
      transform: translate(-3px, -2px);
      @include medium {
        width: toRem(52);
        margin: 0 auto;
      }
    }
    @include medium {
      position: relative;
      z-index: 1;
      padding: toRem(13) toRem(39);
      min-width: toRem(166);
      max-width: unset;
      align-self: center;
      transform: none;
      span {
        display: block;
        white-space: nowrap;
        color: $cornflowerBlue;
        text-align: center;
        font-family: $fontSuisseIntl;
        font-size: toRem(13.5);
        font-weight: 500;
        line-height: leading(19, 13.5);
      }
    }
  }
  .arrow-wrapper {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    @include medium {
      top: 0;
      width: toRem(32);
      align-self: center;
      transform: rotate(90deg) scale(0.9);
    }
    .arrow {
      position: absolute;
      right: toRem(10);
      @include medium {
        right: 0;
      }
    }
  }
}

.storage-provider {
  position: relative;
  .arrow-wrapper {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    .arrow {
      position: absolute;
      right: 0;
    }
    &.secondary {
      position: absolute;
      width: 20%;
      left: calc(-0.5rem - 10px);
      @include medium {
        left: calc(50% - 4px);
        top: toRem(-40);
        width: toRem(32);
      }
      &.top {
        transform: translate(-100%, toRem(-51)) scaleX(-1);
        @include medium {
          transform: rotate(-90deg) translate(0, calc(-50% - toRem(54))) scale(0.9);
        }
      }
      &.bottom {
        transform: translate(-100%, toRem(51)) scaleX(-1);
        @include medium {
          transform: rotate(-90deg) translate(0, calc(-50% + toRem(54))) scale(0.9);
        }
      }
    }
  }
}

.sps {
  display: flex;
  justify-content: center;
}

.sp-col {
  display: flex;
  flex-direction: column;
  padding: 0 toRem(4);
  @include medium {
    padding: 0 toRem(2.5);
  }
  &.offset {
    transform: translateY(toRem(18));
  }
  &.sp-col-7 {
    @include large {
      display: none;
    }
    @include medium {
      display: block;
    }
  }
}

.sp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: toRem(7);
  padding: toRem(5.5) toRem(4.5);
  @include medium {
    padding: toRem(3) toRem(4.5);
    border-color: $cornflowerBlue;
  }
  :deep(svg) {
    width: toRem(22);
    @include medium {
      width: toRem(17);
    }
  }
  span {
    color: #545F7B;
    text-align: center;
    font-family: $fontSuisseIntl;
    font-size: toRem(10.5);
    font-weight: 500;
    line-height: 140%;
    letter-spacing: 0.211px;
    @include medium {
      font-size: toRem(8);
      color: $perano;
    }
  }
}

// ////////////////////////////////////////////////////////////////////// mobile
.mobile-numbers {
  position: absolute;
  left: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: toRem(10);
  .number-wrapper {
    margin-bottom: toRem(15);
    &.mobile-active {
      .number {
        border-color: $canary;
        &:not(.highlight-solid) {
          .number-text {
            color: $canary;
          }
        }
      }
    }
  }
  .number {
    width: toRem(24);
    height: toRem(24);
    .number-text {
      font-size: toRem(14);
      font-weight: 400;
    }
  }
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>