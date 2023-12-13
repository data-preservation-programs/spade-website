<template>
  <div class="page error">

    <SiteHeader />

    <div class="grid-center">
      <div class="col-6">
        <div class="page-content">

          <h1 class="heading">
            {{ error.statusCode }}
          </h1>

          <div class="message">
            {{ error.message }}
          </div>

          <pre v-if="error.stack"><code>{{ error.stack }}</code></pre>

          <nuxt-link
            v-if="error.data?.from"
            :to="error.data.from">
            Go back
          </nuxt-link>

        </div>
      </div>
    </div>

    <SiteFooter />

  </div>
</template>

<script setup>
// ======================================================================== Data
defineProps({
  error: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page.error {
  // padding-top: 0;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
}
.page-content {
  padding-bottom: $siteHeaderHeight;
}

.heading {
  @include h1;
  font-size: toRem(100);
  line-height: 1;
  color: var(--link-color);
  margin-bottom: 2rem;;
}

.message {
  @include h3;
  transition: color 500ms;
}

.page-content {

}
</style>
