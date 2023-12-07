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
}
</style>
