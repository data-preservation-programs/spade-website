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
// const { $GetSeo, $CompileSeo } = useNuxtApp()
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
  // useHead($CompileSeo($GetSeo('general', 'index')))
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
.page-index {
  @include small {
    padding-top: $siteHeaderHeightMobile;
  }
}

:deep(#hero-header) {
  padding-top: 0;
  padding-bottom: toRem(79);
  @include small {
    padding-bottom: toRem(70);
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
}

:deep(#section-onboarding) {
  position: relative;
  background-color: $whiteLilac;
  z-index: 10;
  .section-background {
    position: absolute;
    top: 100%;
    left: -2px;
    width: calc(100% + 0.25rem);
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
  .section-background {
    position: absolute;
    bottom: calc(100% - toRem(24));
    left: -2px;
    width: calc(100% + 0.25rem);
    @include small {
      bottom: calc(100% - toRem(72));
      left: -4px;
      width: calc(100% + 0.5rem);
    }
  }
}

:deep(#section-banner-2) {
  position: relative;
  .image-block {
    transform: scaleX(-1);
  }
}
</style>
