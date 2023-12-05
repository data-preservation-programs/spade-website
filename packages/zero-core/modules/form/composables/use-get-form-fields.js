// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { useZeroFormStore } from '../stores/use-zero-form-store'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useGetFormFields = formId => {
  const store = useZeroFormStore()
  const keys = Object.keys(store.fields)
  const fields = []
  keys.map(fieldId => {
    const field = store.fields[fieldId]
    if (field.formId === formId) {
      fields.push(field)
    }
  })
  return fields
}
