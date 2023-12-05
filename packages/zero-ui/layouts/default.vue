<template>
  <div class="layout zero">

    <div class="grid-noGutter">

      <!-- ========================================================= Sidebar -->
      <div class="col-3">
        <Sidebar />
      </div>

      <!-- ========================================================= Content -->
      <div class="col-7">
        <slot />
      </div>

    </div>

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
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
// @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600;700&display=swap');

// div.layout {
//   font-family: 'Inconsolata', monospace;
// }

:deep(main.page) {
  padding: 20rem 0 20rem 2rem;
  // h1 {
  //   margin-bottom: 3rem;
  // }
}

// :deep(h1), :deep(.h1),
// :deep(h2), :deep(.h2),
// :deep(h3), :deep(.h3),
// :deep(h4), :deep(.h4),
// :deep(h5), :deep(.h5),
// :deep(h6), :deep(.h6) {
//   line-height: 1;
//   margin-bottom: 1rem;
//   font-weight: 600;
// }

// :deep(h1), :deep(.h1) {
//   font-size: toRem(46);
// }

// :deep(h2), :deep(.h2) {
//   font-size: toRem(36);
// }

// :deep(h3), :deep(.h3) {
//   font-size: toRem(28);
// }

// :deep(h4), :deep(.h4) {
//   font-size: toRem(22);
// }

// :deep(h5), :deep(.h5) {
//   font-size: toRem(18);
// }

// :deep(h6), :deep(.h6) {
//   font-size: toRem(16);
// }
</style>
