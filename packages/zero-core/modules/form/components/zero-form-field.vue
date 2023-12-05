<template>
  <component
    :is="rootHtmlTag"
    v-if="field && displayField"
    :class="['field-container', state, { disabled }]">

    <slot
      :field="field"
      :field-id="id"
      :field-type="fieldType"
      :state="state"
      :required="required"
      :disabled="disabled"
      :validation-message="validationMessage"
      :update-value="updateValue"
      :toggle-state="toggleState" />

  </component>
</template>

<script setup>
// ===================================================================== Imports
import Debounce from 'lodash/debounce'

// ======================================================================= Props
const props = defineProps({
  scaffold: {
    type: Object,
    required: true
  },
  forceDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  forceValidate: {
    type: Boolean,
    required: false,
    default: true
  },
  /**
   * On occasions where the final root element in field-conditional.vue render
   * must be something specific. Such as when wrapping a <tbody> in a field-standalone,
   * it cannot be a div as the wrapper. It must be <tbody> at the root to prevent
   * SSR hydration errors.
   */
  rootHtmlTag: {
    type: String,
    required: false,
    default: 'div'
  }
})

// ================================================================ Setup & Data
const scaffold = props.scaffold
const formId = scaffold.formId
const modelKey = scaffold.modelKey
const required = scaffold.required
const react = scaffold.react
const conditions = scaffold.conditions
const deregisterOnDestroy = scaffold.hasOwnProperty('deregisterOnDestroy') ? scaffold.deregisterOnDestroy : true
const id = modelKey || scaffold.id
if (!id || id === '') {
  throw new Error('Form field is missing "id" key. Fields must always have a unique id.')
}
let debounceSaveFieldToLsUponValueUpdate = null
const store = useZeroFormStore()
const { fields } = storeToRefs(store)
let field = fields.value[id]

if (!field) {
  store.setField(useRegisterField(
    id,
    formId,
    scaffold,
    props.forceValidate
  ))
}

const { $bus } = useNuxtApp()

const emit = defineEmits(['updateValue'])

// ==================================================================== Computed
field = computed(() => fields.value[id])
const displayField = computed(() => field.value?.displayField)
const state = computed(() => field.value.state)
const disabled = computed(() => props.forceDisabled || scaffold.disabled)

const fieldType = computed(() => {
  const type = scaffold.type
  let component = false
  switch (type) {
    case 'input' : component = 'FieldInput'; break
    case 'textarea' : component = 'FieldTextarea'; break
    case 'boolean' : component = 'FieldBoolean'; break
    case 'range' : component = 'FieldRange'; break
    case 'checkbox' : component = 'FieldCheckbox'; break
    case 'radio' : component = 'FieldRadio'; break
    case 'select' : component = 'FieldSelect'; break
    case 'typeahead' : component = 'FieldTypeahead'; break
    case 'chiclet' : component = 'FieldChiclet'; break
    case 'wysiwyg' : component = 'FieldWysiwyg'; break
    case 'datepicker' : component = 'FieldDatepicker'; break
    case 'json' : component = 'FieldJson'; break
    case 'upload' : component = 'FieldUpload'; break
    default : component = `Field${useUnSlugify(type)}`
  }
  return component
})

const validationMessage = computed(() => {
  const validationMessage = scaffold.validationMessage
  const validation = field.value.validation
  if (!validationMessage || !validation) { return null }
  return validationMessage[validation]
})

// ======================================================================= Hooks
onMounted(async () => {
  await nextTick(async () => {
    const fieldToRestoreFromLsOrToDisplay = await getLocalStorageValue() || {
      id,
      mounted: displayField.value
    }
    await store.setField(fieldToRestoreFromLsOrToDisplay)
    $bus.$on('fieldValueUpdated', (field) => {
      detectConditions(field)
      initializeReactions(field)
    })
    detectConditions(fieldToRestoreFromLsOrToDisplay, 'mounted')
    debounceSaveFieldToLsUponValueUpdate = Debounce(() => {
      // useSaveFieldToLS(field.value)
    }, 500)
  })
})

onBeforeUnmount(() => {
  if (deregisterOnDestroy) {
    store.removeField(id)
  } else {
    store.setField({
      id,
      mounted: false
    })
  }
})

// ===================================================================== Methods
/**
 * @method toggleState
 */

const toggleState = async focused => {
  if (!disabled.value) {
    const update = { id }
    if (focused) {
      update.state = 'in-progress'
    } else {
      const check = useValidateField(field.value)
      update.state = check.state
      update.originalState = check.state
      update.validation = check.validation
      update.originalValidation = check.originalValidation
    }
    await store.setField(update)
    if (!focused) {
      // useSaveFieldToLS(field.value)
    }
  }
}

/**
 * @method updateValue
 */

const updateValue = async value => {
  const updated = { id, value }
  await store.setField(updated)
  debounceSaveFieldToLsUponValueUpdate()
  emit('updateValue', value)
  $bus.$emit('fieldValueUpdated', updated)
}

/**
 * @method getLocalStorageValue
 */

const getLocalStorageValue = () => {
  const form = JSON.parse(zeroLs().get(`form__${formId}`))
  if (!form) { return undefined }
  const field = form[modelKey]
  if (!field) { return undefined }
  const check = useValidateField(field)
  field.state = check.state
  field.originalState = check.state
  field.validation = check.validation
  field.originalValidation = check.originalValidation
  return field
}

/**
 * @method initializeReactions
 */

const initializeReactions = async updatedField => {
  if (!react) { return }
  const len = react.length
  for (let i = 0; i < len; i++) {
    const reaction = react[i]
    if (reaction.modelKey === updatedField.id) {
      const updated = {
        id,
        value: this[reaction.func](...Object.values(reaction.args))
      }
      const check = useValidateField(field.value)
      updated.state = check.state
      updated.validation = check.validation
      await store.setField(updated)
      // useSaveFieldToLS(field.value)
    }
  }
}

/**
 * @method detectConditions
 */

const detectConditions = async (updatedField, loadState) => {
  if (!conditions && (updatedField.id === id || loadState !== 'mounted')) { return }
  const dualValueFields = ['select', 'radio', 'checkbox']
  const len = conditions.length
  let toggleDisplayField = [true]
  for (let i = 0; i < len; i++) {
    const condition = conditions[i]
    const eq = `${condition.eq}`
    const neq = `${condition.neq}`
    const field = await useField().get(condition.modelKey)
    if (field) {
      const type = field.scaffold.type
      let value = `${field.value}`
      if (dualValueFields.includes(type)) {
        value = `${value[0]}`
      }
      const valueIsNullState = useFieldValueIsNullState(field)
      if (valueIsNullState) {
        toggleDisplayField.push(false)
      } else if (eq !== 'undefined') {
        toggleDisplayField.push(value === eq)
      } else if (neq !== 'undefined') {
        toggleDisplayField.push(value !== neq)
      }
    }
  }
  toggleDisplayField = toggleDisplayField.every(val => val === true)
  if (displayField.value !== toggleDisplayField) {
    const updated = {
      id,
      validate: toggleDisplayField,
      displayField: toggleDisplayField,
      mounted: toggleDisplayField
    }
    await store.setField(updated)
    if (loadState !== 'mounted') {
      // useSaveFieldToLS(field.value)
    }
  }
}
</script>
