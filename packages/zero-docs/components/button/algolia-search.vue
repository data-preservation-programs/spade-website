<template>
  <ZeroAlgoliaSearchButton />
</template>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.search-icon) {
  path {
    fill: var(--theme-color);
  }
}

:deep(.text) {
  @include navigation;
  font-weight: 400;
}

:deep(.key-command) {
  border-color: var(--divider);
}
</style>
