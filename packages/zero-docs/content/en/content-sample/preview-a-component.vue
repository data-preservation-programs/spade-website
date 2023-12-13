<template>
  <div class="an-example-preview-component">

    <div class="text">
      This is an example of a preview component. It can be used to display a live demo of an actual component and likes to follow you around up-and-down the page. It can pull external data from an API and can even be interactive. Check it out:
    </div>

    <div class="count">
      {{ count }}
    </div>

    <button
      class="iterate-count-button"
      @click="iterateCount">
      Click me
    </button>

  </div>
</template>

<script setup>
// ======================================================================== Data
const count = ref(0)

// ===================================================================== Methods
const iterateCount = () => {
  count.value++
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.an-example-preview-component {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border: 2px solid var(--divider);
  border-radius: 1rem;
  transition: border-color 500ms;
  > * {
    transition: color 500ms, background-color 500ms, border-color 500ms, transform 150ms;
  }
}

.count,
.iterate-count-button {
  margin-top: 1rem;
}

.count {
  padding: toRem(4) toRem(14);
  font-weight: 500;
  color: var(--theme-color);
  border-radius: toRem(4);
  border: 2px solid var(--divider);
}

.iterate-count-button {
  padding: toRem(4) toRem(12);
  border-radius: toRem(4);
  font-weight: 500;
  color: var(--theme-color__inverted);
  background-color: var(--theme-color);
  &:hover {
    transition: transform 150ms;
    transform: scale(1.1);
  }
}
</style>
