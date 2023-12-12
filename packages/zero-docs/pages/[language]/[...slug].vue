<template>
  <main class="page">

    <!-- ============================================================ Header -->
    <header>
      <div class="grid">
        <div class="col-6_md-8" data-push-left="off-2_lg-3_md-0">
          <div class="content">
            <h1
              :id="pageSlug"
              ref="heading"
              class="heading">
              {{ pageHeading }}
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- ========================================================== Sections -->
    <section
      v-for="section in pageContent"
      :key="section._path"
      class="section">

      <div class="grid">

        <!-- ======================================================= Content -->
        <div class="col-6_md-8" data-push-left="off-2_lg-3_md-0">
          <div class="content">
            <ZeroMarkdownParser
              id="markdown"
              :markdown="section.raw"
              :section="content.length > 1 ? section._path.split('/').pop() : ''"
              class="markdown"
              @found-heading-nodes="docsStore.compileMagellanLinks" />
            <ZeroApiOverview
              v-if="section.apiOverview"
              :headers="section.apiOverview.headers"
              :query-parameters="section.apiOverview.queryParameters"
              :body-parameters="section.apiOverview.bodyParameters"
              :path-parameters="section.apiOverview.pathParameters"
              :response-codes="section.apiOverview.responseCodes" />
          </div>
        </div>

        <!-- ======================================================= Preview -->
        <div class="col-4_lg-3_md-4">
          <div class="preview">

            <ZeroApiPreview
              v-if="section.apiPreview"
              :sliders="section.apiPreview.sliders" />

            <component
              :is="getPreviewComponentName(section._path)"
              v-if="getPreviewComponentName(section._path)" />

          </div>
        </div>

      </div>

    </section>

    <div class="grid">
      <div class="col-6" data-push-left="off-2">
        <Pagination />
      </div>
    </div>

  </main>
</template>

<script setup>
// ======================================================================= Setup
definePageMeta({
  layout: 'docs'
})

// ======================================================================== Data
const nuxtApp = useNuxtApp()
const intersectionObserver = ref(null)
const headerHeight = ref(0)
const sections = ref([])
const scrollWindowEventListenerFunction = ref(null)
const route = useRoute()
const contentPath = ref(`/docs${route.path}`)
const navigatedByRoute = ref(false)
const navigatedByRouteDebounce = ref(null)
const ctx = getCurrentInstance()
const dirNameSplit = route.path.slice(1).split('/')
const docsStore = useZeroDocsStore()

const pageSlug = dirNameSplit[2]
const pageHeading = useToPascalCase(pageSlug, ' ')

const { data: content } = await useAsyncData('page-content', () => {
  return queryContent({
    where: {
      _path: { $contains: contentPath.value }
    }
  }).find()
}, { watch: [contentPath] })

const { data: definitionsSchema } = await useAsyncData('definitions-schema', () => {
  return queryContent({
    where: {
      _path: { $contains: `/docs/${dirNameSplit[0]}/${dirNameSplit[1]}/definitions-schema` }
    }
  }).findOne()
})

const routePathSplitLength = route.path.split('/').length
const sectionCount = content.value.length

if (routePathSplitLength < 3 || sectionCount === 0) {
  throw createError({
    statusCode: 404,
    message: 'Looks like the page you\'re looking for doesn\'t exist'
  })
}

const pageContent = ref([])

// ======================================================================= Setup
nuxtApp.$seo(
  '*',
  sectionCount === 1 ?
    content.value[0].metadata :
    content.value.find(item => item._file.includes('src.md')) || {}
)

// ==================================================================== Computed
const headerHeightOffset = computed(() => headerHeight.value * 3)

// ===================================================================== Methods
/**
 * @method generatePageContent
 */

const generatePageContent = () => {
  const array = content.value.filter(item => item._extension === 'md' && !item._file.includes('src.md'))
  array.forEach(mdContent => {
    const jsonContent = content.value.find(item => item._path === mdContent._path && item._extension === 'json')
    if (jsonContent) {
      if (Object.hasOwn(jsonContent, 'swagger')) {
        const { overview, preview } = useFormatSwaggerData(jsonContent, {...definitionsSchema.value})
        mdContent.apiOverview = overview
        mdContent.apiPreview = preview
      } else {
        mdContent.apiPreview = jsonContent
      }
    }
  })
  pageContent.value = array
}

/**
 * @method intersectionObserveHeadings
 * @see {@link https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/} for a thorough overview of how the IntersectionObserver works
 */
const intersectionObserveHeadings = () => {
  intersectionObserver.value = new IntersectionObserver((entries) => {
    const entry = entries[0]
    const entryId = entry.target.id
    const sectionId = entry.target.getAttribute('section')
    const intersectingTop = entry.boundingClientRect.top <= headerHeightOffset.value
    // const hash = window.location.hash.slice(1)
    // let activeSection = { id: entryId }
    // let activePath
    // console.log('→', entryId, route.path, intersectingTop, navigatedByRoute.value, entry.intersectionRatio, entry.isIntersecting)
    /**
     * While scrolling, update URL hash from DOM and use hash from DOM headings.
     * This does not fire if navigating via the magellan nav.
     */
    if (intersectingTop && !navigatedByRoute.value) {
      // console.log(entryId, sectionId)
      // console.log(entry)
      docsStore.setActiveSection(
        sectionId !== '' ? { id: entryId, sectionId } : { id: entryId }
      )
      // if (entryId !== hash) {
      //   // activePath = `${route.path}#${entryId}`
      //   // activeSection =
      //   // docsStore.setActiveSection(
      //   //   sectionId !== '' ? { id: entryId, sectionId } : { id: entryId }
      //   // )
      // } else {
      //   // const index = sections.value.findIndex(section => section.id === entryId)
      //   // if (index !== 0) {
      //   //   const current = sections.value[index - 1]
      //   //   activePath = `${route.path}#${current.id}`
      //   //   activeSection = current.id
      //   // } else {
      //   //   activeSection = false
      //   // }
      //   // docsStore.setActiveSection(activeSection)
      // }
    }
    // if (!navigatedByRoute.value && !intersectingTop && activeSection) {
    //   history.replaceState({}, null, activePath)
    // }
  }, {
    rootMargin: `${-headerHeightOffset.value}px 0px 0px 0px`
  })
  sections.value.forEach((section) => {
    intersectionObserver.value.observe(section)
  })
}

/**
 * @method detectPageScrolledToEdgesOfViewport
 */
const detectPageScrolledToEdgesOfViewport = () => {
  if (sections.value.length) {
    const lastMagellanNavItem = sections.value.slice(-1).pop()
    const lastMagellanNavItemId = lastMagellanNavItem.id
    const lastMagellanNavItemSectionId = lastMagellanNavItem.getAttribute('section')
    const scrollHandler = () => {
      const y = window.scrollY
      const viewportHeight = window.innerHeight
      const bodyHeight = document.body.offsetHeight
      if (y <= headerHeight.value) {
        // history.replaceState({}, null, route.path)
        // docsStore.setActiveSection(false)
      } else if (y + viewportHeight >= bodyHeight) {
        // history.replaceState({}, null, `${route.path}#${lastMagellanNavItemId}`)
        docsStore.setActiveSection(
          lastMagellanNavItemSectionId !== '' ?
            { id: lastMagellanNavItemId, sectionId: lastMagellanNavItemSectionId } :
            { id: lastMagellanNavItemId }
        )
      }
    }
    scrollWindowEventListenerFunction.value = zeroThrottle(scrollHandler, 100)
    window.addEventListener('scroll', scrollWindowEventListenerFunction.value)
  }
}

/**
 * @method getPreviewComponentName
 */
const getPreviewComponentName = path => {
  const componentList = ctx.appContext.components
  const previewComponentName = 'Preview' + useToPascalCase(path.replace('/docs/', '').replace('/', '-'))
  const previewExists = componentList.hasOwnProperty(previewComponentName)
  if (previewExists) { return previewComponentName }
  return false
}

// ==================================================================== Watchers
watch(route, async route => {
  generatePageContent()
  if (navigatedByRouteDebounce.value) { clearTimeout(navigatedByRouteDebounce.value) }
  navigatedByRouteDebounce.value = setTimeout(() => {
    navigatedByRoute.value = false
    clearTimeout(navigatedByRouteDebounce.value)
  }, 100)
  navigatedByRoute.value = true
  docsStore.setActiveSection({ id: route.hash.slice(1) })
}, { immediate: true })

// ======================================================================= Hooks
onMounted(async () => {
  // Need the following line for HMR to play nice with @nuxt/content module due to the following issue: https://github.com/nuxt/content/issues/1799
  await new Promise((resolve) => setTimeout(resolve))
  await nextTick(() => {
    const header = document.getElementById('site-header')
    headerHeight.value = header.offsetHeight
    sections.value = Array.from(document.querySelectorAll('#markdown *[id]'))
    intersectionObserveHeadings()
    detectPageScrolledToEdgesOfViewport()
  })
})

onBeforeUnmount(() => {
  sections.value.forEach((section) => {
    intersectionObserver.value.unobserve(section)
  })
  window.removeEventListener('scroll', scrollWindowEventListenerFunction.value)
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// Content
.page {
  padding-bottom: 5rem;
}

.content,
.preview {
  padding: 0 2rem 0 2rem;
  @include gridMaxMQ {
    padding-left: 0;
  }
}

:deep(.content) {
  h2, h3, h4, h5, h6 {
    scroll-margin-top: calc(#{$siteHeaderHeight} + 1.75rem);
  }
  @include customMaxMQ(toRem(1366)) {
    padding-left: 2rem;
  }
  @include large {
    padding-left: 0;
  }
}

.section {
  &:not(:nth-child(2)) {
    padding-top: 2rem;
    border-top: solid 2px var(--background-color__secondary);
    transition: border-color 500ms;
  }
  &:not(:nth-last-child(2)) {
    padding-bottom: 2rem;
  }
}

.preview {
  position: sticky;
  top: calc(#{$siteHeaderHeight} + 1rem);
  @include gridMaxMQ {
    padding-right: 0;
  }
}

.heading {
  @include h1;
  margin-bottom: 2rem;
}
</style>
