<template>
  <div class="layout default">

    <!-- must be placed behind a v-if="algoliaEnabled" -->
    <AlgoliaModal v-if="algoliaEnabled" />

    <SiteHeader />

    <Sidebar />

    <slot />

    <SiteFooter />

  </div>
</template>

<script setup>
// ======================================================================= Setup
if (process.client && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  useHead({
    meta: [
      { name: 'msapplication-config', content: '/public/favicon/light/browserconfig.xml' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/public/favicon/light/favicon-96x96.png' },
      { rel: 'manifest', href: '/public/favicon/light/manifest.json' }
    ]
  })
}
// ======================================================================== Data
const docsStore = useZeroDocsStore()
const { theme } = storeToRefs(docsStore)
const { language } = storeToRefs(docsStore)

const zeroStore = useZeroStore()

const { data: Settings } = await useAsyncData('settings', () => {
  return queryContent({
    where: {
      _file: { $contains: 'data/settings.json' }
    }
  }).find()
})

docsStore.setSettings(Settings.value)

const { data: Seo } = await useAsyncData('seo', async () => {
  const content = await queryContent({
    where: {
      _file: { $contains: `data/${language.value}/seo.json` }
    }
  }).find()
  return content[0]
})

zeroStore.setSeo(Seo)

const config = useRuntimeConfig()
const algoliaEnabled = config.public?.zeroAlgolia?.enable

// ======================================================================= Hooks
onMounted(() => {
  const initialTheme = localStorage.getItem('theme')
  if (initialTheme) {
    docsStore.setTheme(initialTheme)
  }
  const initialLanguage = localStorage.getItem('language')
  if (initialLanguage) {
    docsStore.setLanguage(initialLanguage)
  }
})
</script>
