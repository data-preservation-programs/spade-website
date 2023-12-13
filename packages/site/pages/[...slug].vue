<template>
  <div class="page error">

    <div class="grid-noGutter full">
      <div class="col-12" data-push-left="off-0">
        <section class="section-error">
          <HeroHeader
            :block="block"
            :error-page="true"
            class="error-page" />
        </section>
      </div>
    </div>

  </div>
</template>

<script setup>
// ======================================================================== Data
const block = {
  textblock: {
    h: 1,
    heading: '404'
  },
  errorblock: {
    theme: 'info',
    h: 2,
    heading: 'This page does not exist',
    ctas: [
      {
        text: 'Go back to home',
        to: '/',
        tag: 'nuxt-link',
        theme: 'gradient-dark'
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page.error {
  @include small {
    padding-top: $siteHeaderHeightMobile;
  }
}

</style>
