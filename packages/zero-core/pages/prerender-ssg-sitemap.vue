<!--
  This is a dummy page.
  It is used to force @nuxt/content to crawl these links, and thus add them to
  the prerender list for SSG. This page is necessary because @nuxt/content's
  database is only accessible during runtime.
-->

<template>
  <div class="sitemap">
    <nuxt-link v-for="route in routes" :to="route.loc" />
  </div>
</template>

<script setup lang="ts">
// ======================================================================= Setup
const { data: routes } = await useFetch('/api/generate-sitemap')
</script>
