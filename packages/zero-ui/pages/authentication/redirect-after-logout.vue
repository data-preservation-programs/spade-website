<template>
  <main class="page">

    <ZeroMarkdownParser :markdown="markdown[0].raw" />

  </main>
</template>

<script setup>
// ======================================================================== Data
const { data: markdown } = await useAsyncData('content', () => {
  return queryContent({
    where: {
      _path: { $contains: '/zero-ui/redirect-after-logout' }
    }
  }).find()
})
</script>
