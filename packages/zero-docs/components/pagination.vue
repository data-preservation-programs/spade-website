<template>
  <nav v-if="previous || next" id="pagination" :class="{ single: !previous || !next }">

    <ButtonClear
      v-if="previous"
      :to="previous.path"
      tag="nuxt-link"
      class="nav-link prev">
      <div class="label">
        <IconArrow class="icon-arrow left" />
        Previous
      </div>
      <div class="page-title">
        {{ previous.title }}
      </div>
      <div v-if="previousSection" class="directory-title">
        <component
          :is="useResolveComponent(previous.dirIcon)"
          v-if="useResolveComponent(previous.dirIcon)"
          class="icon-directory" />
        {{ previousSection.title }}
      </div>
    </ButtonClear>

    <ButtonClear
      v-if="next"
      :to="next.path"
      tag="nuxt-link"
      class="nav-link next">
      <div class="label">
        Next
        <IconArrow class="icon-arrow right" />
      </div>
      <div class="page-title">
        {{ next.title }}
      </div>
      <div v-if="nextSection" class="directory-title">
        <component
          :is="useResolveComponent(next.dirIcon)"
          v-if="useResolveComponent(next.dirIcon)"
          class="icon" />
        {{ nextSection.title }}
      </div>
    </ButtonClear>

  </nav>
</template>

<script setup>

// ======================================================================== Data
const route = useRoute()
const currentPath = route.path
const routeLang = computed(() => route.params.language)

const { data: Sidebar } = await useAsyncData('sidebar', async () => {
  const content = await queryContent({
    where: {
      _file: { $contains: `data/${routeLang.value}/sidebar.json` }
    }
  }).find()
  return content[0].body
}, { watch: [routeLang] })

const navigation = []
const dirCount = Sidebar.value.length
const firstDir = Sidebar.value[0]
const lastDir = Sidebar.value.slice(-1)[0]
Sidebar.value.forEach((directory, dirIndex) => {
  const dirSlug = directory.slug
  const pages = directory.children
  pages.forEach((page, pageIndex) => {
    const inFirstDir = dirIndex === 0
    const inLastDir = dirIndex === dirCount - 1
    const previousDir = inFirstDir ? lastDir : Sidebar.value[dirIndex - 1]
    const nextDir = inLastDir ? firstDir : Sidebar.value[dirIndex + 1]
    navigation.push({
      ...(pageIndex === 0 && { previousDir }),
      ...(pageIndex === pages.length - 1 && { nextDir }),
      dirIndex,
      pageIndex,
      dirPageCount: pages.length,
      dirTitle: directory.title,
      dirSlug,
      dirIcon: directory.icon,
      title: page.title,
      path: `/${routeLang}/${dirSlug}${page.href}`
    })
  })
})

const navItemCount = navigation.length
const firstNavItem = navigation[0]
const lastNavItem = navigation.slice(-1)[0]

const currentPathIndex = navigation.findIndex(page => page.path === currentPath)
const onFirstPage = currentPathIndex === 0
const onLastPage = currentPathIndex === navItemCount - 1
const previous = onFirstPage ? lastNavItem : navigation[currentPathIndex - 1]
const next = onLastPage ? firstNavItem : navigation[currentPathIndex + 1]

const currentPage = navigation.find(page => page.path === currentPath)
const previousSection = currentPage?.pageIndex === 0 ? currentPage?.previousDir : undefined
const nextSection = currentPage?.pageIndex === currentPage?.dirPageCount - 1 ? currentPage?.nextDir : undefined
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#pagination {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 3rem;
  padding-right: 2.5rem;
  &.single {
    justify-content: flex-end;
  }
}

:deep(.nav-link) {
  &:hover {
    &.prev {
      .icon-arrow.left {
        transition: 150ms ease-in;
        transform: translateX(-0.5rem);
      }
    }
    &.next {
      .icon-arrow.right {
        transition: 150ms ease-in;
        transform: rotate(180deg) translateX(-0.5rem);
      }
    }
    .page-title {
      transition: 150ms ease-in;
      color: var(--link-color);
    }
  }
  .button-content {
    display: flex;
    flex-direction: column;
    transition: none;
  }
  &.prev {
    .button-content {
      align-items: flex-start;
    }
  }
  &.next {
    .button-content {
      align-items: flex-end;
    }
  }
}

.label,
.page-title,
.directory-title {
  transition: 500ms;
}

.label {
  font-size: toRem(18);
  font-weight: 700;
}

:deep(.icon-arrow) {
  width: toRem(14);
  transition: 150ms ease-out;
  &.left {
    margin-right: toRem(11);
  }
  &.right {
    margin-left: toRem(11);
    transform: rotate(180deg);
  }
  path {
    fill: var(--theme-color);
    transition: 500ms;
  }
}

.page-title {
  font-size: toRem(18);
  font-weight: 500;
}

.directory-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: toRem(14);
  font-weight: 500;
}

:deep(.icon-directory) {
  margin-right: 0.5rem;
  width: toRem(16);
  path,
  rect {
    transition: 500ms;
  }
  path {
    fill: var(--theme-color);
  }
  rect {
    stroke: var(--theme-color);
  }
}
</style>
