<script setup>
// ===================================================================== Imports
const docsStore = useZeroDocsStore()
const { language } = storeToRefs(docsStore)

const { data: Sidebar } = await useAsyncData('sidebar', async () => {
  const content = await queryContent({
    where: {
      _file: { $contains: `data/${language.value}/sidebar.json` }
    }
  }).find()
  return content[0].body
})

// ======================================================================= Setup
await navigateTo(`/${language.value}/${Sidebar.value[0].slug}${Sidebar.value[0].children[0].href}`)
</script>
