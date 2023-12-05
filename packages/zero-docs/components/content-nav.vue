<template>
  <nav id="content-nav">
    <section
      v-for="directory in Sidebar"
      :key="directory.slug"
      class="section">

      <div class="section-heading">

        <component
          :is="useResolveComponent(directory.icon)"
          v-if="useResolveComponent(directory.icon)"
          class="icon-directory" />

        <h2
          :class="['title', { active: routeMatchesCurrentDirectory(directory.slug) }]"
          v-html="directory.title" />

      </div>

      <ButtonClear
        v-for="link in directory.children"
        :key="generateLink(directory.slug, link.href)"
        :to="generateLink(directory.slug, link.href)"
        :tag="link.type"
        :disabled="isCurrentRoute(generateLink(directory.slug, link.href))"
        class="link">
        <div class="button-label" v-html="link.title" />
      </ButtonClear>

    </section>
  </nav>
</template>

<script setup>
// ======================================================================== Data
const route = useRoute()

const { data: Sidebar } = await useAsyncData('sidebar', async () => {
  const content = await queryContent({
    where: {
      _file: { $contains: 'data/sidebar.json' }
    }
  }).find()
  return content[0].body
})

// ===================================================================== Methods
/**
 * @method generateLink
 */
const generateLink = (dirSlug, href) => {
  return `/${dirSlug}${href}`
}

/**
 * @method routeMatchesCurrentDirectory
 */
const routeMatchesCurrentDirectory = (slug) => {
  return route.path.includes(slug)
}

/**
 * @method isCurrentRoute
 */
const isCurrentRoute = (path) => {
  return path === route.path
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.section {
  &:first-of-type {
    .title {
      padding-top: 0;
    }
  }
  &:not(:first-of-type) {
    padding-top: 1rem;
  }
}

.section-heading {
  display: flex;
  align-items: center;
}

:deep(.icon-directory) {
  width: toRem(21);
  margin-right: toRem(14);
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

.title {
  @include sidebarSectionTitle;
  padding: toRem(4) 0;
  margin: 0;
  transition: color 200ms;
  color: var(--sidebar__title-color);
  &.active {
    color: var(--sidebar__title-color__active);
  }
}

:deep(.link.button) {
  display: block;
  padding: toRem(4) 0;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  &:hover:not(.router-link-active) {
    cursor: pointer;
    .button-label {
      transition: 500ms ease-in;
      color: var(--link-color);
    }
  }
  &.router-link-active {
    .button-label {
      font-weight: 700;
      color: var(--link-color);
    }
  }
  &[disabled="true"] {
    opacity: 1;
    cursor: default;
  }
  .button-label {
    @include sidebar;
    transition: color 500ms;
  }
}
</style>
