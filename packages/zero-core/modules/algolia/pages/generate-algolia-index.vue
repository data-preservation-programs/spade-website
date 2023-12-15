<!--
  This is a dummy page.
  It is used to initiate Algolia to compile a site content search index. This page
  is necessary because @nuxt/content's database is only accessible during runtime.
-->

<script setup lang="ts">
// ======================================================================= Setup
const config = useRuntimeConfig()
if (config.public.zeroAlgolia.enable) {
  const { data: routes } = await useFetch('/api/generate-algolia-index')
}

// ======================================================================= Hooks
onMounted(() => {
  navigateTo('/')
})
</script>
