<template>
  <div class="page error">

    <div class="grid-noGutter">

      <!-- ========================================================= Sidebar -->
      <div class="col-3">
        <Sidebar />
      </div>

      <!-- ========================================================= Content -->
      <div class="col-7">
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
