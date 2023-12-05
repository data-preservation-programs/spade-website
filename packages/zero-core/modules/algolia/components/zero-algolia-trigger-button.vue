<template>
  <button
    v-if="!disableAlgolia"
    class="algolia-trigger-button"
    @click="handleClick">

    <div class="search-icon">
      <template v-if="$slots.icon">
        <slot name="icon" />
      </template>
      <ZeroIconSearch class="icon" />
    </div>

    <div class="text">
      <template v-if="$slots.text">
        <slot name="text" />
      </template>
      <template v-else>
        Search
      </template>
    </div>

    <div class="key-command">
      <template v-if="$slots.keyCommand">
        <slot name="key-command" />
      </template>
      <template v-else>
        <span>⌘ K</span>
      </template>
    </div>

  </button>
</template>

<script setup>
// ======================================================================= Props
const emit = defineEmits(['clicked'])

// ======================================================================== Data
const algoliaStore = useZeroAlgoliaStore()
const runtimeConfig = useRuntimeConfig()
const disableAlgolia = runtimeConfig.public.algolia.disable

// ===================================================================== Methods
const handleClick = () => {
  emit('clicked')
  algoliaStore.toggleModal(true)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.algolia-trigger-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    &:not(:last-child) {
      margin-right: toRem(14);
    }
  }
}

.search-icon {
  display: flex;
  width: toRem(20);
  :deep(path) {
    transition: 150ms ease;
  }
}

.key-command {
  display: flex;
  border: solid 1px #898989;
  border-radius: toRem(5);
  padding: 0.25rem 0.5rem 0.1875rem 0.5rem;
  line-height: 1;
  span {
    line-height: inherit;
    opacity: 0.6;
  }
}
</style>
