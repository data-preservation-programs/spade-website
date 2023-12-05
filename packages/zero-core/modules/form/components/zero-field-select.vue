<!-- https://css-tricks.com/striking-a-balance-between-native-and-custom-select-elements/ -->

<template>
  <div
    tabindex="-1"
    :class="['field-select', state, {
      'select-container-focused': selectContainerFocused,
      'select-native-focused': selectNativeFocused,
      'dropdown-open': dropdownOpen,
      disabled
    }]"
    @focus="handleFocusBlur('focus', 'select-container')"
    @blur="handleFocusBlur('blur', 'select-container')"
    @keydown="handleKeyboardNavigation($event)">

    <!-- ================================================= [Select] Disabled -->
    <div v-if="disabled" class="select custom">
      <slot
        name="disabled-window"
        :placeholder="placeholder"
        :label="label" />
    </div>

    <!-- =================================================== [Select] Native -->
    <select
      v-if="!disabled"
      :aria-labelledby="ariaLabelledby"
      :multiple="!isSingleOption"
      class="select native"
      tabindex="0"
      @focus="handleFocusBlur('focus', 'select-native')"
      @blur="handleFocusBlur('blur', 'select-native')"
      @change="selectOption('native', $event)">
      <option disabled="disabled" :selected="empty" value="-1">
        <slot
          name="option-native-default-text"
          :placeholder="placeholder"
          :label="label" />
      </option>
      <option
        v-for="(option, index) in options"
        :key="`native-${index}`"
        :value="option.index || index"
        :selected="isCurrentlySelected(option.index || index)">
        <slot name="option-native-text" :option="option" />
      </option>
    </select>

    <!-- =================================================== [Select] Custom -->
    <div
      v-if="!disabled"
      :aria-hidden="dropdownOpen ? 'false' : 'true'"
      class="select custom">

      <div
        class="selection-window-wrapper"
        @click="toggleDropdown">
        <slot
          name="selection-window"
          :selected="selectedOptions"
          :placeholder="placeholder"
          :label="label"
          :empty="empty" />
      </div>

      <div
        ref="dropdownElement"
        class="dropdown">
        <div
          v-for="(option, index) in options"
          :key="`custom-${index}`"
          :ref="el => { optionRefs[`option-${ariaLabelledby}-${option.index || index}`] = el }"
          class="option-wrapper"
          @mouseenter="toggleOptionHighlighted('enter', option.index || index)"
          @mouseleave="toggleOptionHighlighted('leave')"
          @click="selectOption('custom', option.index || index)">
          <slot
            name="option-custom"
            :option="option"
            :index="option.index || index"
            :highlighted="isCurrentlyHighlighted(option.index || index)"
            :selected="isCurrentlySelected(option.index || index)" />
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
// ======================================================================= Setup
const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  /**
   * Options need to be passed in explicitly since the options coming in from
   * the Typeahead are pre-processed
   */
  options: {
    type: Array,
    required: true
  },
  /**
   * Define whether or not to maintain selection based on index. In the case of
   * the typeahead field for example, there is no need to maintain a record of
   * which index is selected since the value is recorded by the typeahead. This
   * Select simply acts as a fresh value selector in that case.
   */
  maintainIndexState: {
    type: Boolean,
    required: false,
    default: true
  },
  /**
   * Define whether or not to handle v-click-outside in this component. Example:
   * the typeahead field handles this instead.
   */
  handleClickOutside: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits([
  'dropdownToggled',
  'optionHighlighted',
  'toggleEmpty',
  'toggleFocused',
  'updateValue'
])

// ======================================================================== Data
const selectContainerFocused = ref(false)
const selectNativeFocused = ref(false)
const dropdownElement = ref(null)
const optionRefs = ref({})
const dropdownOpen = ref(false)
const autoScrollDropdown = ref(false)
const currentOptionsHighlighted = ref([])

const scaffold = props.field.scaffold
const fieldKey = props.field.fieldKey
const modelKey = scaffold.modelKey
const label = scaffold.label
const placeholder = scaffold.placeholder
const isSingleOption = scaffold.hasOwnProperty('isSingleOption') ? scaffold.isSingleOption : true
const isSingleSelection = scaffold.hasOwnProperty('isSingleSelection') ? scaffold.isSingleSelection : true
const ariaLabelledby = modelKey || fieldKey

// ==================================================================== Computed
const selectedOptions = computed(() => {
  const value = props.field.value
  return typeof value === 'string' ? [] : value // typeahead values are strings
})
const state = computed(() => props.field.state)
const empty = computed(() => selectedOptions.value.length === 0)

// ======================================================================= Setup
currentOptionsHighlighted.value = isSingleSelection ? selectedOptions.value[0] : selectedOptions.value

// ======================================================================= Watch
watch(dropdownOpen, state => {
  emit('dropdownToggled', state)
})

watch(currentOptionsHighlighted, index => {
  emit('optionHighlighted', index)
  const option = optionRefs.value[`option-${ariaLabelledby}-${index}`]
  if (option) {
    if (autoScrollDropdown.value) {
      dropdownElement.value.scrollTop = option.offsetTop
      autoScrollDropdown.value = false
    }
  }
})

watch(empty, status => {
  emit('toggleEmpty', status)
})

// ======================================================================= Hooks
onBeforeUnmount(() => {
  emit('dropdownToggled', false)
})

// ===================================================================== Methods
const toggleDropdown = () => {
  dropdownOpen.value ? closeDropdown() : openDropdown()
}

const openDropdown = () => {
  currentOptionsHighlighted.value = selectedOptions.value
  dropdownOpen.value = true
}

const closeDropdown = () => {
  currentOptionsHighlighted.value = []
  dropdownOpen.value = false
}

const handleFocusBlur = (type, element) => {
  const focused = type === 'focus'
  if (element === 'select-container') {
    selectContainerFocused.value = focused
  } else {
    selectNativeFocused.value = focused
  }
  emit('toggleFocused', focused)
  if (props.handleClickOutside && type === 'blur') {
    closeDropdown()
  }
}

const toggleOptionHighlighted = (action, index) => {
  if (isSingleOption) {
    currentOptionsHighlighted.value = action === 'leave' ? [] : [index]
  }
}

const isCurrentlyHighlighted = (index) => {
  return isSingleSelection ? currentOptionsHighlighted.value === index : currentOptionsHighlighted.value.includes(index)
}

const isCurrentlySelected = (index) => {
  return isSingleSelection ? selectedOptions.value === index : selectedOptions.value.includes(index)
}

const selectOption = (type, incoming) => {
  const selectedIndex = parseInt(typeof incoming === 'number' ? incoming : incoming.target.value)
  let selected = isSingleOption ? [selectedIndex] : selectedOptions.value.slice()
  if (isSingleOption) {
    closeDropdown()
  } else {
    if (type === 'custom') {
      const found = selected.findIndex(index => index === selectedIndex)
      found === -1 ? selected.push(selectedIndex) : selected.splice(found, 1)
    } else if (type === 'native') {
      selected = Array.from(incoming.target.selectedOptions).map(option => (parseInt(option.value)))
    }
  }
  currentOptionsHighlighted.value = selected
  emit('updateValue', selected)
}

const handleKeyboardNavigation = (e) => {
  const classList = Array.from(e.srcElement.classList)
  if (!classList.includes('select-container') && !classList.includes('typehead-input')) { return }
  autoScrollDropdown.value = true
  const keyCode = e.keyCode
  const code = e.keyCode
  const key = e.key
  const esc = keyCode === 27 || code === 'Escape' || key === 'Escape'
  const down = keyCode === 40 || code === 40 || key === 'ArrowDown'
  const up = keyCode === 38 || code === 38 || key === 'ArrowUp'
  const submit = keyCode === 13 || code === 13 || key === 'Enter'
  if (!esc && !down && !up && !submit) { return }
  if (esc) { closeDropdown(); return }
  const currentHighlighted = currentOptionsHighlighted.value
  let selection = currentHighlighted
  if (isSingleOption) {
    selection = selection[0]
    if (selection === 0) {
      selection = 0
    } else if (selection === undefined) {
      selection = -1
    }
  }
  if (!selectContainerFocused.value && dropdownOpen.value) { e.preventDefault() }
  const options = props.options
  const len = options.length
  if (!props.maintainIndexState) {
    let prev = selection === -1 ? options[len - 1].index : options[0].index
    let next = selection === -1 ? options[0].index : options[len - 1].index
    for (let i = 0; i < len; i++) {
      if (options[i].index === selection) {
        const prevOption = options[i - 1]
        const nextOption = options[i + 1]
        if (prevOption) { prev = prevOption.index }
        if (nextOption) { next = nextOption.index }
      }
    }
    if (up && prev !== undefined) {
      selection = prev
    } else if (down && next !== undefined) {
      selection = next
    }
  } else {
    if (isSingleOption) {
      if (up && selection === -1) {
        selection = len - 1
      } else if (up && selection > 0) {
        selection--
      } else if (down && selection < len - 1) {
        selection++
      }
    } else {
      // TODO: implement keyboard navigation for multi-select
    }
  }
  currentOptionsHighlighted.value = isSingleOption ? [selection] : selection
  if (submit) {
    selectOption('custom', selection)
    closeDropdown()
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field-select {
  position: relative;
  width: 100%;
  height: 100%;
  &:after {
    content: '▾';
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    line-height: 1;
  }
  &.dropdown-open {
    .dropdown {
      display: block;
    }
  }
}

.select {
  width: 100%;
  height: 100%;
  &.native {
    appearance: none;
    background-color: transparent;
    border: 0;
    &:focus-visible {
      outline: none;
    }
  }
  &.custom {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 5;
  }
}

@media (hover: hover) {
  .field-select {
    &:after {
      display: none;
    }
    &.select-native-focused {
      &:after {
        content: 'press ↓ key';
        display: flex;
        font-size: toRem(14);
      }
    }
  }
  .select {
    &.native {
      opacity: 0;
      &:focus {
        opacity: 1;
        + .custom {
          display: none;
        }
      }
    }
    &.custom {
      display: block;
    }
  }
}

.selection-window-wrapper {
  width: 100%;
  height: 100%;
}

.dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  max-height: 10rem;
  overflow-y: scroll;
  background-color: black;
}
</style>
