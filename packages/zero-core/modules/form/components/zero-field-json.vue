<template>
  <div :class="['field-json', state, { empty, disabled, 'no-validate': !validate }]">

    <ZeroMarkdownParser
      v-if="disabled"
      :markdown="valueFormatted"
      class="editor" />

    <div
      v-else
      ref="editorRef"
      class="editor" />

  </div>
</template>

<script setup>
// ===================================================================== Imports
import Ace from 'ace-builds'
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'
import modeJsonUrl from 'ace-builds/src-noconflict/mode-json?url'
import themeOneDarkUrl from 'ace-builds/src-noconflict/theme-one_dark?url'

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
  }
})

const emit = defineEmits(['updateValue', 'toggleFocused'])

// ======================================================================== Data
const editorRef = ref(null)
const aceEditor = ref(null)
const scaffold = props.field.scaffold
const placeholder = JSON.stringify(scaffold.placeholder, false, 2) || JSON.stringify({ foobar: 'sample JSON input' }, false, 2)

// ==================================================================== Computed
const value = computed(() => props.field.value)
const state = computed(() => props.field.state)
const empty = computed(() => !value.value || value.value === '')
const validate = computed(() => props.field.validate)
const valueFormatted = computed(() => {
  const formatted = value.value === '' ? placeholder : JSON.stringify(JSON.parse(value.value), false, 2)
  return `\`\`\`json\n${formatted}\n\`\`\``
})

// ======================================================================= Hooks
onMounted(() => {
  Ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)
  Ace.config.setModuleUrl('ace/mode/json', modeJsonUrl)
  Ace.config.setModuleUrl('ace/theme/one_dark', themeOneDarkUrl)
  aceEditor.value = Ace.edit(editorRef.value, {
    mode: 'ace/mode/json',
    theme: 'ace/theme/one_dark',
    useWorker: true,
    useSoftTabs: true,
    tabSize: 2,
    fontSize: 14,
    fontFamily: 'Andale Mono',
    behavioursEnabled: true
  })
  aceEditor.value.on('focus', () => emit('toggleFocused', true))
  aceEditor.value.on('blur', () => emit('toggleFocused', false))
  aceEditor.value.session.on('change', () => {
    const value = aceEditor.value.getValue().replaceAll(' ', '').replaceAll('\t', '').replaceAll('\n', '')
    emit('updateValue', value)
  })
})
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.field-json {
  position: relative;
}

.editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

:deep(.editor.markdown) {
  .code-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
