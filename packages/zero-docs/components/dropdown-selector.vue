<template>
  <ZeroDropdown
    :display-selected="true"
    :default-option="props.options[defaultSelectedIndex].slug"
    @option-selected="handleOptionSelect">
    <!-- :default-option="props.options[0]" -->

    <template #toggle-button="{ togglePanel, panelOpen, selected }">
      <button :class="['selector', { 'panel-open': panelOpen }]" @click="togglePanel">
        <span class="selection">{{ selected }}</span>
        <IconChevron :class="['chevron', { up: panelOpen }]" />
      </button>
    </template>

    <template #dropdown-panel="{ setSelected, isSelected }">
      <button
        v-for="option in props.options"
        :key="option.slug"
        :class="['dropdown-option', { selected: isSelected(option.slug) }]"
        @click="setSelected(option.slug)">
        {{ option.name }} [{{ option.slug }}]
      </button>
    </template>

  </ZeroDropdown>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  defaultSelectedIndex: {
    type: Number,
    required: false,
    default: 0
  }
})

// ======================================================================== Data
const docsStore = useZeroDocsStore()
const route = useRoute()

// ===================================================================== Methods
/**
 * @method handleOptionSelect
 */
const handleOptionSelect = option => {
  if (process.dev) {
    const optionLowerCase = option.slug.toLowerCase()
    docsStore.setLanguage(optionLowerCase)
    navigateTo(`/${optionLowerCase}${route.params.slug.reduce((acc, slugStr) => { return acc.concat('/', slugStr) }, '')}`)
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.panel-container) {
  padding-top: 1rem;
}

:deep(.panel) {
  border: 1px solid var(--divider);
  background-color: var(--background-color);
  border-radius: 1rem;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

}

.selector {
  display: flex;
  align-items: center;
  &:hover,
  &.panel-open {
    &:before {
      transition: 150ms ease-in;
      opacity: 1;
    }
  }
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: -8px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    background-color: var(--divider);
    border-radius: toRem(5);
    opacity: 0;
    z-index: -1;
    transition: 150ms ease-out;
  }
  span,
  :deep(svg) {
    display: block;
  }
  .selection {
    @include navigation;
    margin-right: toRem(5);
  }
}

.dropdown-option {
  padding: toRem(5) toRem(10);
  white-space: nowrap;
  transition: 500ms;
  font-weight: 600;
  &:hover {
    color: var(--link-color);
  }
  &.selected {
    cursor: default;
  }
}
</style>
