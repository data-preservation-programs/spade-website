<template>
  <main class="page">

    <h1 class="page-heading">
      Protected
    </h1>

    <p>
      If you're seeing this, you're logged in! 🎉
    </p>

  </main>
</template>

<script setup>
// ======================================================================= Setup
definePageMeta({
  guarded: true
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
