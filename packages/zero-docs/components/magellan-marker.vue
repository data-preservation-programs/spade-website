<template>
  <div
    :class="['active-link-marker', { hide: !activeUrlHash }]"
    :style="{ height: activeLinkMarkerHeight, top: activeLinkMarkerPosition }" />
</template>

<script setup>
// ======================================================================== Data
const linkElement = ref(null)
const activeLinkMarkerHeight = ref('0px')
const route = useRoute()
const docsStore = useZeroDocsStore()
const { activeUrlHash } = storeToRefs(docsStore)

// ==================================================================== Computed
const activeLinkMarkerPosition = computed(() => {
  if (!activeUrlHash.value || !linkElement.value) { return `32px` }
  const buttonTop = linkElement.value.getBoundingClientRect().top
  const parentTop = linkElement.value.parentNode.getBoundingClientRect().top
  return `${buttonTop - parentTop}px`
})

// ==================================================================== Watchers
watch(activeUrlHash, (hash) => {
  linkElement.value = document.querySelector(`[link-hash="${hash}"]`)
  if (!hash || !linkElement.value) { return false }
  activeLinkMarkerHeight.value = `${linkElement.value.offsetHeight}px`
})

watch(route, () => {
  const firstLinkElement = document.querySelector(`[link-hash]`)
  activeLinkMarkerHeight.value = `${firstLinkElement.offsetHeight}px`
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.active-link-marker {
  position: absolute;
  top: $sidebarPadding;
  left: calc($sidebarPadding - 0.5rem);
  width: 0.25rem;
  background-color: var(--link-color);
  border-radius: toRem(4);
  transition: 150ms ease-in-out;
  &.hide {
    opacity: 0;
  }
}
</style>
