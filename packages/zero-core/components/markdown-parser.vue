<template>

  <div
    ref="markdown"
    class="markdown"
    v-html="parsed" />

</template>

<script setup>
// ===================================================================== Imports
import Kramed from 'kramed'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import hljsCurl from 'highlightjs-curl'

// ======================================================================== Data
const props = defineProps({
  markdown: { // unprocessed markdown
    type: String,
    required: true
  },
  section: { // used to scope headings, needs to match sync.js
    type: String,
    required: false,
    default: ''
  }
})

const renderer = new Kramed.Renderer()
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const baseURL = `${runtimeConfig.public.siteUrl}${route.path}`
const textCopied = 'Copied!'
const textNotCopiedUrl = 'Click to copy link'
const textNotCopiedCode = 'Copy'
const zeroStore = useZeroStore()
const parsed = ref(null)
let copyButtons = []

// ============================================================== [Setup] Kramed
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('curl', hljsCurl)

renderer.link = function (href, title, text) {
  const split = text.split('||')
  const len = split.length
  let attributeString = ''
  if (len > 1) {
    try {
      const attributes = JSON.parse(split[1].replace(/&quot;/g, '"'))
      if (typeof attributes === 'object') {
        Object.keys(attributes).forEach((key) => {
          attributeString += `${key}="${attributes[key]}" `
        })
      }
    } catch (e) {
      return `<a href="${href}">${split[0]}</a>`
    }
  }
  return `<a href="${href}" ${attributeString}>${split[0]}</a>`
}

renderer.heading = function (text, level) {
  const escapedText = text.toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
  return `
    <h${level}
      id="${escapedText}"
      section="${props.section}"
      class="heading-anchor">
      <button
        class="copy-button"
        data-hash="${escapedText}"
        data-tooltip="Click to copy link"
        data-tooltip-theme="light"
        data-type="heading">#</button>
      ${text}
    </h${level}>
  `
}

renderer.code = function (code, language) {
  const languageInstalled = hljs.getLanguage(language)
  const highlighted = language && languageInstalled ?
    hljs.highlight(code, { language }) :
    hljs.highlightAuto(code)
  return `
    <div class="code-wrapper" ${highlighted.language ? `data-language="${highlighted.language}"` : false}>
      <button class="copy-button" data-type="code">
        Copy
      </button>
      <pre><code class="code-block">${highlighted.value}</code></pre>
    </div>
  `
}

parsed.value = Kramed(props.markdown, { renderer })

// ======================================================================= Watch
watch(
  () => props.markdown,
  incoming => {
    parsed.value = Kramed(incoming, { renderer })
  }
)

// ======================================================================= Hooks
onMounted(async () => {
  await nextTick(() => {
    copyButtons = document.querySelectorAll('.markdown .copy-button')
    const len = copyButtons.length
    for (let i = 0; i < len; i++) {
      const button = copyButtons[i]
      const hash = button.getAttribute('data-hash')
      const type = button.getAttribute('data-type')
      const text = type === 'heading' ? `${baseURL}#${hash}` : button.nextElementSibling.textContent
      button.addEventListener('click', () => {
        zeroAddTextToClipboard(text)
        zeroStore.setClipboard(text)
        clearCopiedStates()
        if (type === 'heading') {
          button.setAttribute('data-tooltip', textCopied)
        } else if (type === 'code') {
          button.innerText = textCopied
        }
      })
    }
  })
})

// ===================================================================== Methods
/**
 * @method clearCopiedStates
 */
const clearCopiedStates = () => {
  const len = copyButtons.length
  for (let i = 0; i < len; i++) {
    const button = copyButtons[i]
    const type = button.getAttribute('data-type')
    if (type === 'heading') {
      button.setAttribute('data-tooltip', textNotCopiedUrl)
    } else if (type === 'code') {
      button.innerText = textNotCopiedCode
    }
  }
}
</script>
