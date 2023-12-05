// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { useValidateField } from './use-validate-field'
import { useZeroFormStore } from '../stores/use-zero-form-store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// =========================================================== getNullStateValue
const getNullStateValue = scaffold => {
  const type = scaffold.type
  let value
  switch (type) {
    case 'checkbox' : value = -1; break
    case 'radio' : value = -1; break
    case 'select' : value = []; break
    case 'range' : value = scaffold.min; break
    case 'array' : value = []; break
    case 'upload' : value = []; break
    case 'boolean' : value = false; break
    default : value = ''; break
  }
  return value
}

// ============================================================= getDefaultValue
const getDefaultValue = (scaffold, model) => {
  const dualValueFields = ['select', 'radio', 'checkbox'] // fields that can contain both a String and a Number (index) as the value/defaultValue
  const modelKey = scaffold.modelKey
  const type = scaffold.type
  const defaultValue = scaffold.defaultValue
  const options = scaffold.options
  let value = getNullStateValue(scaffold) // get the base value
  // If default value is set in the scaffold, get that
  if (scaffold.hasOwnProperty('defaultValue') && defaultValue !== '') {
    value = defaultValue
  }
  // If default value is set in the model, get that
  if (model && model.data && model.data.hasOwnProperty(modelKey) && model.data[modelKey] !== null) {
    value = model.data[modelKey]
  }
  // defaultValue can be an array of indexes, a single index Number, an array of labels or a single label String
  if (dualValueFields.includes(type)) {
    if (!Array.isArray(value)) { // if defaultValue is not an array, turn it into one
      value = [value]
    }
    const compiled = []
    value.forEach((entry) => { // convert labels to indexes so final output ex: [2, 3, 7]
      const found = options.findIndex(option => option.label === entry)
      if (found !== -1 && !compiled.includes(found)) {
        compiled.push(found)
      } else if (typeof entry === 'number' && options[entry] && !compiled.includes(entry)) {
        compiled.push(entry)
      }
    })
    value = compiled
  }
  return value
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useRegisterField = (id, formId, scaffold, validate) => {
  const store = useZeroFormStore()
  const model = store.models[formId]
  const value = getDefaultValue(scaffold, model)
  const conditions = scaffold.conditions
  const displayField = !conditions || (conditions && conditions.length === 0)
  const field = { // `groupId` and `fieldKey` are reserved keys, set in `array.vue`
    id,
    formId,
    modelKey: scaffold.modelKey,
    validate,
    state: 'not-started',
    originalState: null,
    validation: null,
    originalValidation: null,
    displayField,
    mounted: displayField,
    value,
    originalValue: value,
    scaffold
  }
  const { state } = useValidateField(field)
  if (state === 'completed') {
    field.state = state
  }
  field.originalState = state
  field.originalValidation = state
  return field
}
