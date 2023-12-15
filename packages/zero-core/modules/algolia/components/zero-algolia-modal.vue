<template>
  <div
    v-if="enableAlgolia"
    :class="['algolia-modal', { active: modalActive }]"
    @click.self="closeModal">
    <AisInstantSearch :index-name="indexName" :search-client="algolia">

      <AisSearchBox
        ref="searchInput"
        :class="{ focused: searchFocused }"
        @focus="searchBoxFocus"
        @blur="searchBoxBlur" />

      <div class="results-list-container">
        <AisHits>
          <template #default="{ items }">
            <ZeroAlgoliaResults :results="items">
              <template #group-heading="{ heading }">
                <slot name="group-heading" :heading="heading" />
              </template>
              <template #result="{ result, getResultTitle, getResultContent }">
                <slot
                  name="result"
                  :result="result"
                  :get-result-title="getResultTitle"
                  :get-result-content="getResultContent" />
              </template>
            </ZeroAlgoliaResults>
          </template>
        </AisHits>
      </div>

      <div class="toolbar-bottom">
        <slot name="toolbar-bottom" />
      </div>

    </AisInstantSearch>
  </div>
</template>

<script setup>
// ===================================================================== Imports
import { renderToString } from 'vue/server-renderer'
import {
  AisInstantSearch,
  AisSearchBox,
  AisHits,
  createServerRootMixin
} from 'vue-instantsearch/vue3/es'

// ======================================================================== Data
const runtimeConfig = useRuntimeConfig()
const algoliaStore = useZeroAlgoliaStore()
const { modalActive } = storeToRefs(algoliaStore)
const keyCommandEventListener = ref(null)
const searchFocused = ref(false)
const searchInput = ref(null)
const route = useRoute()
const indexName = runtimeConfig.public.zeroAlgolia.indexName
const enableAlgolia = runtimeConfig.public.zeroAlgolia.enable
const algolia = useAlgoliaRef()
const serverRootMixin = ref(
  createServerRootMixin({
    searchClient: algolia,
    indexName
  })
)
const { instantsearch } = serverRootMixin.value.data()
provide('$_ais_ssrInstantSearchInstance', instantsearch)

const { data: algoliaState } = await useAsyncData('algolia-state', async () => {
  if (process.server) {
    const nuxtApp = useNuxtApp()
    nuxtApp.$algolia.transporter.requester = (
      await import('@algolia/requester-node-http').then(
        (lib) => lib.default || lib
      )
    ).createNodeHttpRequester()
  }
  return instantsearch.findResultsState({
    // IMPORTANT: a component with access to `this.instantsearch` to be used by the createServerRootMixin code
    component: {
      $options: {
        components: {
          AisInstantSearchSsr,
          AisIndex,
          AisConfigure,
          AisRefinementList,
          AisHits,
          AisHighlight,
          AisSearchBox,
          AisStats,
          AisPagination
        },
        data() {
          return { instantsearch }
        },
        provide: { $_ais_ssrInstantSearchInstance: instantsearch },
        render() {
          return h(AisInstantSearchSsr, null, () => [
            // Include any vue-instantsearch components that you use including each refinement attribute
            h(AisHits)
          ])
        }
      }
    },
    renderToString
  })
})

// ==================================================================== Watchers
watch(route, () => {
  if (modalActive.value) { closeModal() }
})

watch(modalActive, (active) => {
  if (active) {
    setTimeout(() => {
      document.querySelector('.ais-SearchBox-input').focus()
    }, 300)
  }
})

// ======================================================================= Hooks
onBeforeMount(() => {
  if (algoliaState.value) {
    instantsearch.hydrate(algoliaState.value)
  }
})

onMounted(() => {
  /**
   * up/down/enter is handled in @/src/modules/zero/modules/algolia/components/results.vue
   */
  keyCommandEventListener.value = (e) => {
    const key = e.key
    const code = e.code
    const keyCode = e.keyCode
    const meta = e.metaKey || key === 'Meta' || code === 'MetaLeft' || code === 'MetaRight' || keyCode === 91 || keyCode === 93
    const k = key === 'k' || code === 'KeyK' || keyCode === 75
    const esc = key === 'Escape' || code === 'Escape' || keyCode === 27
    if (meta && k) {
      algoliaStore.toggleModal(true)
    } else if (esc && modalActive.value) {
      algoliaStore.toggleModal(false)
    }
  }
  window.addEventListener('keydown', keyCommandEventListener.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyCommandEventListener.value)
})

// ===================================================================== Methods
const closeModal = () => { algoliaStore.toggleModal(false) }

const searchBoxFocus = () => { searchFocused.value = true }

const searchBoxBlur = () => { searchFocused.value = false }
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.algolia-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  pointer-events: none;
  z-index: 2000;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: -1;
    transition: 150ms ease-out;
  }
  &.active {
    visibility: visible;
    pointer-events: all;
    opacity: 1;
    &:before {
      transition: 250ms ease-in;
      opacity: 0.7;
    }
    .ais-InstantSearch {
      transition: 150ms ease-in;
      opacity: 1;
      transform: translateY(0);
    }
  }
}

:deep(.ais-InstantSearch) {
  display: flex;
  flex-direction: column;
  margin: toRem(60) auto auto;
  max-width: toRem(560);
  max-height: toRem(600);
  opacity: 0;
  overflow: hidden;
  transform: translateY(1rem);
  z-index: 1000;
  transition: 150ms ease-out;
}

// /////////////////////////////////////////////////////////////////// Searchbox
:deep(.ais-SearchBox-form) {
  display: flex;
  flex-direction: row-reverse;
  position: relative;
}

:deep(.ais-SearchBox) {
  margin: toRem(12);
  margin-bottom: 0;
  padding: 0;
}

// //////////////////////////////////////////////////////////////// Results list
.results-list-container {
  flex: 1;
  padding: 0 toRem(12);
  padding-bottom: toRem(12);
  overflow-y: scroll;
}

:deep(.ais-Hits-list) {
  flex-direction: column;
  flex-wrap: nowrap;
}

:deep(.ais-Hits-item) {
  width: unset;
}

// ///////////////////////////////////////////////////////////////////// Toolbar
.toolbar-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: toRem(54);
  width: 100%;
  padding: toRem(10) toRem(20);
}
</style>
