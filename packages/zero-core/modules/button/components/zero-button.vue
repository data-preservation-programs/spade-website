<template>
  <component
    :is="component"
    :to="tag === 'nuxt-link' ? to : undefined"
    :href="tag === 'a' ? to : undefined"
    :disabled="disabled || loading"
    :target="target"
    :class="['button', { selected }, { disabled }]"
    @click="clickHandler($event)">

    <slot :loading="loading" />

  </component>
</template>

<script setup>
// ===================================================================== Imports
import useUuid from '../../../composables/uuid'

// ======================================================================= Props
const props = defineProps({
  tag: { // 'button', 'a' or 'nuxt-link'
    type: String,
    required: false,
    default: 'button'
  },
  to: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  target: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  loader: {
    type: [String, Object],
    required: false,
    default: undefined
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  }
})

// ======================================================================= Setup
const emit = defineEmits(['clicked'])
const buttonStore = useZeroButtonStore()
const id = props.loader || useUuid().v4()
buttonStore.setButton({ id, loading: false })

// ======================================================================== Data
const { buttons } = storeToRefs(buttonStore)

// ==================================================================== Computed
const button = computed(() => buttons.value[id])
const loading = computed(() => button.value.loading)
const component = computed(() => {
  const tag = props.tag
  const disabled = props.disabled
  if (disabled) { return 'button' }
  if (tag !== 'nuxt-link') { return tag }
  return resolveComponent('NuxtLink')
})

// ===================================================================== Methods
const clickHandler = (e) => {
  e.stopPropagation()
  if (!props.disabled) {
    if (typeof props.loader === 'string') {
      buttonStore.setButton({ id, loading: true })
    }
    emit('clicked', e)
  }
}
</script>
