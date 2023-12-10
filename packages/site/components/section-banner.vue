<template>
  <div class="banner">
    <ResponsiveClipper
      :key="`banner-mobile-${mobile}-${key}`"
      :display-guides="false"
      :breakpoints-x="breakpointsX"
      :breakpoints-y="breakpointsY">
      <template #svg-path>
        <BannerClipPath v-if="!mobile" />
        <BannerClipPathMobile v-else />
      </template>
      <template #clipped-content>
        <ImageBlock :block="{ src: '/images/blue-gradient-squiggle.jpg', background: true }" />
      </template>
      <template #overlay-content>
        <div class="banner-content">
          <h4 class="text h4">
            {{ bannerText }}
          </h4>
        </div>
      </template>
    </ResponsiveClipper>
  </div>
</template>

<script setup>
// ====================================================================== Import
import BannerClipPath from '@/components/svgs/banner-clip-path'
import BannerClipPathMobile from '@/components/svgs/banner-clip-path-mobile'
import ImageBlock from '@/components/blocks/image-block'

// ======================================================================= Props
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

// ======================================================================== Data
const resizeEventListener = ref(false)
const mobile = ref(false)
const key = ref(0)

// ==================================================================== Computed
const bannerText = computed (() => props.block.text)
const breakpointsX = computed(() => mobile.value ? props.block.breakpointsMobileX : props.block.breakpointsX)
const breakpointsY = computed(() => mobile.value ? props.block.breakpointsMobileY : props.block.breakpointsY)

// ==================================================================== Watchers
watch([breakpointsX, breakpointsY], () => {
  key.value++
}, { deep: true })

// ======================================================================= Hooks
onMounted(() => {
  checkBreakpoint()
  resizeEventListener.value = zeroThrottle(() => { checkBreakpoint() }, 50)
  window.addEventListener('resize', resizeEventListener.value)
})

onBeforeUnmount(() => {
  if (resizeEventListener.value) {
    window.removeEventListener('resize', resizeEventListener.value)
  }
})

// ===================================================================== Methods
const checkBreakpoint = () => {
  if (window.matchMedia('(max-width: 53.125rem)').matches) {
    if (!mobile.value) {
      mobile.value = true
    }
  } else {
    if (mobile.value) {
      mobile.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.image-block) {
  height: 100%;
  background-color: $blackPearl;
  .background-image {
    position: absolute;
    width: toRem(1327);
    height: toRem(1632);
    top: calc(50% + 3rem);
    left: 50%;
    transform: translate(-50%, -50%) rotate(-27deg) skew(0deg, 10deg) scale(1.2);
    @include small {
      width: toRem(1000);
      height: toRem(1224);
      left: calc(50% - 10rem);
      top: calc(50% - 9rem);
      transform: translate(-50%, -50%) rotate(-27deg) skew(0deg, 10deg) scale(1);
      background-position: center;
    }
  }
}

.banner-content {
  padding: toRem(153) 14% toRem(130) 14%;
  @include small {
    padding: toRem(83) 10% toRem(70) 10%;
  }
  @include mini {
    padding: toRem(63) 6% toRem(53) 6%;
  }
}

.text {
  color: white;
  text-align: center;
}
</style>