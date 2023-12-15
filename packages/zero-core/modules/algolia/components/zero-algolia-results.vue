<template>
  <div class="results-container">

    <!-- =========================================================== results -->
    <template v-if="resultsFound">
      <section
        v-for="group in groups"
        :key="group.heading">

        <slot name="group-heading" :heading="group.heading" />

        <div class="results-list">
          <nuxt-link
            v-for="result in group.results"
            :key="result.objectID"
            :to="result.path"
            @mouseenter="algoliaStore.setActiveResult(result.objectID)"
            @click="handleClick">
            <slot
              name="result"
              :result="result"
              :get-result-title="getResultTitle"
              :get-result-content="getResultContent" />
          </nuxt-link>
        </div>

      </section>
    </template>

    <!-- ================================================== no results found -->
    <div v-else class="no-results-placeholder">
      No results found, try a different query
    </div>

  </div>
</template>

<script setup>
// ===================================================================== Imports
import StartCase from 'lodash/startCase'

// ======================================================================== Data
const props = defineProps({
  results: {
    type: Array,
    required: true,
    default: () => []
  }
})

const algoliaStore = useZeroAlgoliaStore()
const { activeResult, modalActive } = storeToRefs(algoliaStore)
const keyCommandEventListener = ref(null)
const docsStore = useZeroDocsStore()
const { language } = storeToRefs(docsStore)

// ==================================================================== Computed
const groups = computed(() => {
  const results = props.results
  const len = results.length
  const compiled = {}
  for (let i = 0; i < len; i++) {
    const result = results[i]
    let breadcrumbs = result.breadcrumbs.full
    const index = breadcrumbs.indexOf(language.value)
    if (index !== -1) {
      breadcrumbs.splice(index, 1)
    }
    const section = StartCase(breadcrumbs[0])
    if (!compiled.hasOwnProperty(section)) {
      compiled[section] = [result]
    } else {
      compiled[section].push(result)
    }
  }
  return Object.keys(compiled).map(key => {
    return {
      heading: key,
      results: compiled[key]
    }
  })
})

const filteredResultList = computed(() => {
  return groups.value.reduce((acc, group) => {
    return acc.concat(group.results)
  }, [])
})

const resultsFound = computed(() => [] /* headings.value.length > 0 */)

// ======================================================================= Hooks
onMounted(() => {
  /**
   * cmd+k/esc is handled in @/src/modules/zero/modules/algolia/components/modal.vue
   */
  keyCommandEventListener.value = (e) => {
    const key = e.key
    const code = e.code
    const keyCode = e.keyCode
    const meta = e.metaKey || key === 'Meta' || code === 'MetaLeft' || code === 'MetaRight' || keyCode === 91 || keyCode === 93
    const up = key === 'ArrowUp' || code === 'ArrowUp' || keyCode === 38
    const down = key === 'ArrowDown' || code === 'ArrowDown' || keyCode === 40
    const enter = key === 'Enter' || code === 'Enter' || keyCode === 13
    const ctrl = e.ctrlKey || key === 'Control' || code === 'ControlLeft' || code === 'ControlRight' || keyCode === 17
    const shift = e.shiftKey || key === 'Shift' || code === 'ShiftLeft' || code === 'ShiftRight' || keyCode === 16
    if (up || down) {
      if (modalActive.value) { e.preventDefault() }
      const list = filteredResultList.value
      let currentIndex = filteredResultList.value.findIndex(result => result.objectID === activeResult.value)
      let nextIndex
      if (currentIndex === -1) {
        nextIndex = down ? 0 : nextIndex = filteredResultList.value.length - 1
      } else if (down && currentIndex < filteredResultList.value.length - 1) {
        nextIndex = currentIndex += 1
      } else if (up && currentIndex !== 0) {
        nextIndex = currentIndex -= 1
      }
      if (nextIndex !== undefined) {
        algoliaStore.setActiveResult(list[nextIndex].objectID)
      }
    } else if (enter && activeResult.value) {
      algoliaStore.toggleModal(false)
      if (meta || ctrl) { // cmd+enter → open in new tab | ctrl+enter → open in new tab and switch to tab
        navigateTo(activeResult.value, { open: { target: '_blank' } } )
      } else if (shift) { // shift+enter → open in new window
        navigateTo(activeResult.value, {
          open: { target: '_blank' },
          windowFeatures: { popup: true }
        })
      } else { // enter → open in same window
        navigateTo(activeResult.value)
      }
    }
  }
  window.addEventListener('keydown', keyCommandEventListener.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyCommandEventListener.value)
})

// ===================================================================== Methods
/**
 * @method getResultTitle
 */

const getResultTitle = result => {
  return result._highlightResult.heading.matchLevel === 'full' ?
    result.heading :
    result.heading
}

/**
 * @method getResultContent
 */

const getResultContent = result => {
  return `<div>${result._highlightResult.content.matchLevel === 'full' ?
    formatMatchingContent(result._highlightResult.content.value) :
    result.content}</div>`
}

/**
 * @method formatMatchingContent
 */

const formatMatchingContent = string => {
  const sentences = string.split('.')
  const result = sentences.find(sentence => sentence.includes('<mark>'))
  if (result) {
    const text = result.trim()
    const maxChars = 75
    const afterIndex = text.indexOf('</mark>') + 7 // add 1 for each character in '</mark>'; i.e. 7
    if (afterIndex > maxChars - 1) {
      const trimBefore = afterIndex - maxChars + 10 // 10 for a buffer before the end of the string
      return `...${text.substring(trimBefore, text.length).trim()}`
    } else {
      return `${text.substring(0, maxChars)}`
    }
  }
  return string
}

/**
 * @method handleClick
 */

const handleClick = () => {
  algoliaStore.toggleModal(false)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.no-results-placeholder {
  padding-top: toRem(12);
  text-align: center;
  font-weight: 500;
}
</style>
