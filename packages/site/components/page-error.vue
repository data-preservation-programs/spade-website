<template>
  <div class="page error">

    <SiteHeader />

    <div class="grid">
      <div class="col-6_md-8" data-push-left="off-2_lg-3_md-0">
        <div class="page-content">

          <h1 class="heading">
            {{ statusCode }}
          </h1>

          <div class="message">
            {{ message }}
          </div>

          <pre v-if="stack && stack !== ''"><code>{{ stack }}</code></pre>

          <nuxt-link
            v-if="data?.from"
            :to="data.from">
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
  statusCode: {
    type: Number,
    required: false,
    default: 404
  },
  message: {
    type: String,
    required: false,
    default: 'Looks like the page you\'re looking for doesn\'t exist'
  },
  stack: {
    type: String,
    required: false,
    default: ''
  },
  data: {
    type: Object,
    required: false,
    default: () => {}
  }
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
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
</style>
