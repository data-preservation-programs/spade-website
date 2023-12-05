<template>
  <div class="page">
    <div class="grid">
      <div class="col">

        {{ zeroUuid().v4() }}
        <ZeroMarkdownParser markdown="### hello" />
        <ZeroButton>
          Helloooo
        </ZeroButton>

      </div>
    </div>
  </div>
</template>

<script setup>
// const { $bus } = useNuxtApp()
// console.log($bus)
</script>
