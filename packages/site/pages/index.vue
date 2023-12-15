<template>
  <div class="page page-index">
    
    <BlockBuilder :sections="sections" />

  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGeneralStore } from '../stores/general.js'
import BlockBuilder from '@/components/blocks/block-builder'

// ======================================================================== Data
const route = useRoute()
const { data } = await useAsyncData('data', async () => {
  return queryContent().find()
})
const generalStore = useGeneralStore()
const { siteContent } = storeToRefs(generalStore)

// ==================================================================== Watchers
watch(data, async (val) => {
  const indexData = val.find(item => item._file === 'data/pages/index.json')
  await generalStore.getBaseData('general')
  await generalStore.getBaseData({ key: 'index', data: indexData })
}, { immediate: true })

// ==================================================================== Computed
const sections = computed(() => {
  return siteContent.value?.index?.page_content
})

// ==================================================================== On Mount
onMounted(() => {
  setTimeout(async () => {
    if (route.query.section) {
      const section = document.getElementById(route.query.section)
      if (section) {
        await nextTick()
        section.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, 1)
})

onBeforeUnmount(() => {
  generalStore.clearStore()
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-index {
  @include small {
    padding-top: $siteHeaderHeightMobile;
  }
}

:deep(.section-background) {
  path {
    @include mini {
      stroke: transparent;
    }
  }
}

:deep(#hero-header) {
  padding-top: 0;
  padding-bottom: toRem(79);
  @include small {
    padding-bottom: toRem(70);
  }
}

:deep(#section-intro-1),
:deep(#section-banner-1),
:deep(#section-onboarding),
:deep(#section-policy),
:deep(#section-card-list),
:deep(#section-banner-2),
:deep(#section-how-it-works),
:deep(#section-operating-principles)  {
  [class~=grid], [class*=grid-], [class*=grid_] {
    &.full {
      padding: 0 toRem(50);
      @include medium {
        padding: 0 toRem(8)
      }
    }
  }
}

:deep(#section-intro-1) {
  padding-top: toRem(13);
  padding-bottom: toRem(44);
  @include small {
    padding-top: 0;
    padding-bottom: toRem(18);
  }
  .text-block,
  .image-block {
    padding: 0 8%;
  }
  .text-block {
    @include small {
      padding: 0;
    }
  }
  .image-block {
    @include small {
      margin-bottom: toRem(21);
    }
    @include tiny {
      padding: 0;
    }
  }
}

:deep(#section-banner-1) {
  position: relative;
  padding-top: 0;
  padding-bottom: toRem(50);
  @include mini {
    padding-bottom: toRem(24);
  }
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: calc(50% + 2.5rem);
    width: 100%;
    background-color: $whiteLilac;
  }
}

:deep(#section-onboarding) {
  position: relative;
  padding-top: 0;
  padding-bottom: 4.4375rem;
  background-color: $whiteLilac;
  z-index: 10;
  @include mini {
    padding-bottom: toRem(4);
  }
  .section-background {
    position: absolute;
    top: calc(100% - 1px);
    left: -2px;
    width: calc(100% + 0.25rem);
  }
  div[data-block-id="col_1-small"] {
    display: none;
    @include small {
      display: block;
    }
  }
  div[data-block-id="col_2"] {
    .column-content {
      position: relative;
    }
  }
  .text-block {
    padding: 0 6.4%;
    @include small {
      margin-top: toRem(41);
    }
    @include tiny {
      padding: 0;
    }
  }
  .image-block {
    padding-left: 6.4%;
    margin-top: toRem(43);
    @include large {
      padding-left: 4rem;
    }
    @include small {
      padding: 0 6.4%;
    }
    @include mini {
      position: relative;
      padding-right: 0;
      padding-left: toRem(24);
      height: toRem(281);
      img {
        display: none;
      }
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: toRem(24);
        width: calc(100% - toRem(24));
        height: 100%;
        border-radius: toRem(10);
        background-image: url('/images/man-standing-in-server-room.jpg');
        background-repeat: no-repeat;
        background-size: 440px 376.5px;
        background-position: -7px -68px;
      }
    }
  }
  .graph-card {
    position: absolute;
    top: toRem(-43);
    left: 0;
    @include medium {
      transform: scale(0.8) translate(-1rem, -2rem);
    }
    @include mini {
      transform: none;
    }
  }
  .card-list-block {
    margin: toRem(70) -0.5rem 0 -0.5rem;
    @include mini {
      margin: toRem(44) -0.5rem 0 -0.5rem;
    }
  }
}

:deep(#section-infographic) {
  position: relative;
  padding-top: toRem(108);
  padding-bottom: toRem(256);
  background-color: $blackPearl;
  z-index: 9;
  @include medium {
    padding-top: toRem(148);
    padding-bottom: toRem(200);
  }
  @include small {
    padding-top: toRem(100);
    padding-bottom: toRem(168);
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    @include radialGradientDarkBlue(100% 100% at 33% 33%);
  }
}

:deep(#section-policy) {
  position: relative;
  background-color: white;
  z-index: 10;
  @include small {
    padding-top: 0;
    padding-bottom: toRem(18);
  }
  .section-background {
    position: absolute;
    bottom: calc(100% - toRem(24));
    left: toRem(-6);
    width: calc(100% + toRem(10));
    @include small {
      bottom: calc(100% - toRem(72));
      left: toRem(-6);
      width: calc(100% + toRem(12));
    }
  }
  .image-block {
    padding: 0 6.4% 0 10%;
  }
  .text-block {
    padding: 0 10% 0 6.4%;
  }
  @include medium {
    .image-block {
      padding-left: 0;
    }
    .text-block {
      padding-right: 0;
    }
  }
  @include small {
    .image-block,
    .text-block {
      padding: 0;
    }
    .image-block {
      margin-bottom: toRem(42);
    }
  }
}

:deep(#section-card-list) {
  padding-top: toRem(104);
  background-color: $whiteLilac;
  @include mini {
    padding-top: toRem(31);
    padding-bottom: toRem(28);
  }
  .card-list-block {
    @include small {
      padding: 0 toRem(24);
    }
    @include mini {
      padding: 0 toRem(24);
    }
    @include tiny {
      padding: 0;
    }
    .card-wrapper {
      @include mini {
        padding-bottom: toRem(8) !important;
      }
    }
    .graph-card {
      border-radius: toRem(20);
      .caption.before {
        margin-bottom: toRem(30);
      }
      .graph {
        padding: 0 toRem(2);
        height: unset !important;
        // width: 100%;
        svg {
          width: 100%;
        }
      }
      .curve {
        @include mini {
          max-height: unset !important;
          max-width: unset !important;
        }
      }
      @include mini {
        margin: 0 -0.25rem;
        min-height: toRem(212);
        border-radius: toRem(10);
      }
    }
  }
}

:deep(#section-banner-2) {
  position: relative;
  padding-top: toRem(14);
  @include small {
    padding-bottom: toRem(24);
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(50% - 1.5rem);
    background-color: $whiteLilac;
  }
  .image-block {
    transform: scaleX(-1);
  }
}

:deep(#section-how-it-works) {
  position: relative;
  z-index: 10;
  padding-top: 2.25rem;
  padding-bottom: toRem(52);
  background-color: white;
  @include small {
    padding-top: 0;
    padding-bottom: toRem(16);
  }
  .section-background {
    position: absolute;
    top: calc(100% - 1px);
    left: -2px;
    width: calc(100% + 0.25rem);
  }
  .text-block {
    padding: 0 8% 0 6.4%;
    @include medium {
      padding: 0;
      margin-bottom: toRem(30);
    }
  }
  .card-list-block {
    @include medium {
      margin: 0 -0.5rem;
    }
    .card-wrapper {
      min-height: toRem(276);
      &:last-child {
        transform: translateY(-1.5rem);
      }
    }
    .card.theme__light-blue {
      height: 100%;
    }
  }
}

:deep(#section-roadmap) {
  position: relative;
  z-index: 9;
  background-color: #010101;
  padding-top: toRem(254);
  padding-bottom: toRem(300);
  @include small {
    padding-top: toRem(220);
    padding-bottom: toRem(140);
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    background-repeat: repeat-x;
    background-size: cover;
    z-index: 1;
    transform: scale(1.055);
  }
  &:before {
    top: -3.25rem;
    height: toRem(924);
    background: url('/images/roadmap-background-top.svg');
    background-position: center 99%;
    @include small {
      width: 365%;
      left: -129%;
      transform: scale(0.30);
      top: -19.75rem;
    }
  }
  &:after {
    bottom: -0.5rem;
    height: toRem(836);
    background: url('/images/roadmap-background-bottom.svg');
    background-position: center top;
    @include small {
      transform: scale(0.3);
      width: 360%;
      left: -129%;
      bottom: -16rem;
    }
  }
  .roadmap {
    position: relative;
    z-index: 10;
    @include medium {
      padding: 2.5%;
    }
  }
}

:deep(#section-operating-principles) {
  position: relative;
  z-index: 10;
  background-color: $whiteLilac;
  padding: 0;
  @include small {
    padding-top: toRem(16);
    padding-bottom: toRem(10);
  }
  .section-background {
    position: absolute;
    bottom: calc(100% - toRem(48));
    left: -6px;
    width: calc(100% + toRem(12));
    @include small {
      bottom: calc(100% - toRem(72));
      left: -4px;
      width: calc(100% + 0.5rem);
    }
  }
  .text-block {
    margin-bottom: toRem(45);
    @include small {
      margin-bottom: toRem(13);
    }
    .heading {
      font-family: $fontSuisseIntl;
      font-size: toRem(42);
      font-weight: 500;
      line-height: leading(59, 42);
      margin-bottom: 0;
      @include small {
        font-size: toRem(24);
        line-height: leading(34, 24);
      }
    }
    .text-wrapper {
      display: none;
    }
    .button-row {
      margin-top: toRem(2);
    }
  }
}
</style>
