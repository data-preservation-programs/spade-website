<template>
  <ZeroAlgoliaModal>

    <template #group-heading="{ heading }">
      <div class="group-heading">
        {{ heading }}
      </div>
    </template>

    <template #result="{ result, getResultTitle }">
      <div :class="['result-container', { active: result.objectID === activeResult }]">
        <IconHash class="icon hash" />
        <div class="content">
          <span class="result-title" v-html="getResultTitle(result)"></span>
          <span class="result-path">{{ `${result.entryName}` }}</span>
        </div>
        <IconReturn class="icon action" />
      </div>
    </template>

    <template #toolbar-bottom>
      <div class="tip">
        <IconReturn class="icon return" />
        <span class="tip-text">to select</span>
      </div>
      <div class="tip">
        <IconNavigate class="icon navigate" />
        <span class="tip-text">to navigate</span>
      </div>
      <div class="tip">
        <IconEscape class="icon escape" />
        <span class="tip-text">to close</span>
      </div>
      <div class="tip algolia-logo">
        <span class="tip-text">search by</span>
        <IconAlgolia class="icon algolia" />
      </div>
    </template>

  </ZeroAlgoliaModal>
</template>

<script setup>
// ======================================================================== Data
const algoliaStore = useZeroAlgoliaStore()
const { activeResult } = storeToRefs(algoliaStore)
</script>

<style lang="scss" scoped>
// /////////////////////////////////////////////////////////////////////// Modal
.algolia-modal {
  &:before {
    background-color: var(--algolia-backdrop);
  }
}

:deep(.ais-InstantSearch) {
  box-shadow: 2px -4px 4px 0px rgba(0, 0, 0, 0.05), 2px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: var(--algolia-background);
  border-radius: 0.625rem;
}

// /////////////////////////////////////////////////////////////////// Searchbox
:deep(.ais-SearchBox) {
  background-color: var(--algolia__searchbox__background-color);
  border: 2px solid var(--divider);
  border-radius: toRem(10);
  transition: border 250ms ease;
  &.focused {
    border-color: var(--link-color);
    .ais-SearchBox-submitIcon {
      path {
        transition: 150ms ease-in;
        fill: var(--link-color);
      }
    }
  }
}

:deep(.ais-SearchBox-input) {
  @include h2;
  flex: 1;
  height: toRem(60);
  padding-right: toRem(12);
  font-size: toRem(22);
  font-weight: 400;
  letter-spacing: 0;
  color: var(--theme-color);
  border: none;
  border-radius: toRem(10);
  appearance: none;
  &::-webkit-search-cancel-button {
    display: none;
  }
}

:deep(.ais-SearchBox-submitIcon) {
  display: block;
  width: toRem(24);
  height: toRem(24);
  margin: 0 toRem(18);
  path {
    fill: var(--theme-color);
    transition: 150ms ease-out;
  }
}

:deep(.ais-SearchBox-reset) {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  &:hover {
    .ais-SearchBox-resetIcon {
      path {
        transition: 150ms ease-in;
        fill: var(--link-color);
      }
    }
  }
}

:deep(.ais-SearchBox-resetIcon) {
  margin: 0 toRem(18);
  path {
    fill: var(--theme-color);
    transition: 150ms ease-out;
  }
}

// ///////////////////////////////////////////////////////////////////// Results
.group-heading {
  @include p1;
  position: sticky;
  top: 0;
  padding: toRem(15) 0 toRem(10) toRem(12);
  background-color: var(--algolia-background);
  color: var(--link-color);
  font-weight: 700;
  z-index: 100;
}

.result-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  padding: toRem(8) toRem(14);
  padding-right: toRem(20);
  border-radius: 10px;
  background-color: var(--algolia__result__background-color);
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.05);
  &:hover,
  &.active {
    background-color: var(--link-color);
    .result-title,
    .result-path {
      color: var(--algolia__result__hover__color);
      :deep(mark) {
        color: var(--algolia__result__hover__color);
      }
    }
    .result-path {
      opacity: 0.7;
    }
    .icon {
      :deep(path) {
        fill: var(--algolia__result__hover__color);
      }
    }
  }
}

:deep(.result-title) {
  mark {
    background-color: var(--theme-color);
    color: var(--theme-color__inverted);
    padding: 0 toRem(4);
    margin: 0 toRem(1);
  }
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 toRem(14);
}

.hit-title,
.hit-path {
  display: block;
  transition: none;
}

.hit-title {
  @include p1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-flex: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: var(--theme-color);
  :deep(mark) {
    background: none;
    color: var(--link-color);
    font-weight: 500;
  }
}

.hit-path {
  @include p2;
  color: var(--theme-color);
  opacity: 0.7;
}

.icon {
  &.hash {
    width: toRem(24);
  }
  &.action {
    width: toRem(20);
  }
  :deep(path) {
    fill: var(--theme-color);
  }
}

// ///////////////////////////////////////////////////////////////////// Toolbar
:deep(.toolbar-bottom) {
  border-top: solid 1px var(--divider);
}

.tip {
  display: flex;
  flex-direction: row;
  align-items: center;
  :deep(path) {
    fill: var(--theme-color);
  }
  &.algolia-logo {
    span {
      margin-left: 0;
      margin-right: 0.5rem;
    }
    :deep(svg) {
      transform: translateY(0.125rem);
      path {
        fill: #003DFF;
      }
    }
  }
}

.icon {
  display: block;
  &.return {
    width: 14px;
  }
  &.navigate {
    width: 20px;
  }
  &.escape {
    width: 20px;
    transform: translateY(0.125rem);
  }
  &.algolia {
    height: 16px;
  }
}

.tip-text {
  font-size: toRem(12);
  line-height: 1;
  margin-left: 0.5rem;
  white-space: nowrap;
}
</style>
