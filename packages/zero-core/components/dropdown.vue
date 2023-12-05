<template>
  <div
    v-click-outside="closePanel"
    :class="['dropdown-panel', `toggle-on-${toggleOn}`]">

    <slot
      name="toggle-button"
      :toggle-panel="togglePanel"
      :panel-open="panelOpen"
      :close-panel="closePanel"
      :selected="selected">
    </slot>

    <div :class="['panel-container', { open: panelOpen }]">

      <div class="panel">
        <slot
          name="dropdown-panel"
          :close-panel="closePanel"
          :set-selected="setSelected"
          :is-selected="isSelected">
        </slot>
      </div>

    </div>

  </div>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  toggleOn: {
    type: String,
    required: false,
    default: 'click'
  },
  displaySelected: {
    type: Boolean,
    required: false,
    default: false
  },
  defaultOption: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['dropdownPanelToggled', 'optionSelected'])

// ======================================================================== Data
const panelOpen = ref(false)
const selected = ref('')

// ==================================================================== Watchers
watch(panelOpen, (state) => { emit('dropdownPanelToggled', state) })

watch(selected, (val) => { emit('optionSelected', val) })

// ======================================================================= Hooks
onMounted(() => {
  if (props.defaultOption) {
    setSelected(props.defaultOption)
  }
})

// ===================================================================== Methdos
/**
 * @method togglePanel
 */

const togglePanel = () => {
  if (props.toggleOn === 'click') {
    panelOpen.value = !panelOpen.value
  }
}

/**
 * @method closePanel
 */

const closePanel = () => {
  if (props.toggleOn === 'click' && panelOpen.value) {
    panelOpen.value = false
  }
}

/**
 * @method setSelected
 */

const setSelected = value => {
  if (props.displaySelected) {
    selected.value = value
  }
  closePanel()
}

/**
 * @method isSelected
 */

const isSelected = value => {
  return value === selected.value
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.dropdown-panel {
  position: relative;
  &.toggle-on-hover {
    &:hover {
      .panel-container {
        transition: 150ms ease-in;
        transform: translate(-50%, 0);
        opacity: 1;
        visibility: visible;
        pointer-events: all;
      }
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Panel
/**
 * .panel-container padding-top (offset) and .panel width and/or max-height must
 * be set in the parent component as these are custom properties that will differ
 * panel-to-panel
 */

.panel-container {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  transition: 150ms ease-out;
  &:not(.open) {
    transition: 150ms ease-in;
    transform: translate(-50%, 1rem);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
</style>
