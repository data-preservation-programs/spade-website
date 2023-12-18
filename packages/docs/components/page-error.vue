<template>
  <div class="page error">

    <SiteHeader />

    <div class="grid">
      <div class="col-6" data-push-left="off-2">
        <div class="page-content">

          <h1 class="heading">
            {{ statusCode }}
          </h1>

          <div class="message">
            {{ message }}
          </div>

          <pre v-if="stack && stack !== ''"><code>{{ stack }}</code></pre>

          <ButtonClear
            class="button-home"
            tag="nuxt-link"
            to="/">
            Back to Home
          </ButtonClear>

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
.page.error {
  padding-top: $siteHeaderHeight;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
}
.page-content {
  padding: 6rem 0;
  margin-left: 2rem;
}

.heading {
  @include h1;
  font-size: toRem(80);
  line-height: 1;
  margin-bottom: 2rem;;
}

.message {
  @include h2;
  transition: color 500ms;
  margin-bottom: 2rem;
}

.button-home {
  display: block;
  width: fit-content;
  :deep(.button-content) {
    padding: toRem(8) toRem(12);
    background-color: var(--primary-accent-color);
    border-radius: toRem(8);
    color: var(--theme-color__inverted);
  }
}
</style>
