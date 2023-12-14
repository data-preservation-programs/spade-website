<template>
  <div :class="['layout', 'default', { error }]">

    <SiteHeader />

    <slot />

    <SiteFooter />

  </div>
</template>

<script setup>
// ======================================================================= Setup
if (process.client && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  useHead({
    meta: [
      { name: 'msapplication-config', content: '/favicon/dark/browserconfig.xml' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/dark/favicon-96x96.png' },
      { rel: 'manifest', href: '/favicon/dark/manifest.json' }
    ]
  })
}

// ======================================================================== Data
const route = useRoute()
const zeroStore = useZeroStore()

const { data: Seo } = await useAsyncData('seo', async () => {
  const content = await queryContent({
    where: {
      _file: { $contains: 'data/seo.json' }
    }
  }).find()
  return content[0]
})

zeroStore.setSeo(Seo)

const error = computed(() => route.path === '/error')
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  &.error {
    :deep(#site-footer) {
      background-color: white;
    }
  }
}
</style>
