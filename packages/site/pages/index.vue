<template>
  <div class="page page-index">
    
    <!-- <BlockBuilder :sections="sections" /> -->

  </div>
</template>

<script setup>
import { useGeneralStore } from '../stores/general.js'
import BlockBuilder from '@/components/blocks/block-builder'

// ======================================================================== Data
const generalStore = useGeneralStore()
const route = useRoute()
// const { $GetSeo, $CompileSeo } = useNuxtApp()
const { data } = await useAsyncData('core', async () => {
  return queryContent('core').find()
})

// ==================================================================== Watchers
watch(data, async (val) => {
  await generalStore.getBaseData('general')
  await generalStore.getBaseData({ key: 'index', data: val.find((item) => item._file === 'core/index.json') })
  // useHead($CompileSeo($GetSeo('general', 'index')))
}, { immediate: true })

// ==================================================================== Computed
const sections = computed(() => {
  return generalStore.siteContent?.index?.page_content
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
</style>
