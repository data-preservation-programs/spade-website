// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { useZeroFormStore } from '../stores/use-zero-form-store'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useValidateForm = formId => {
  const store = useZeroFormStore()
  const fields = useGetFormFields(formId)
  const len = fields.length
  if (len === 0) { return false }
  let formValid = true
  for (let i = 0; i < len; i++) {
    const field = fields[i]
    if (field.validate && field.mounted) {
      const check = useValidateField(field)
      if (check.state !== 'completed' && check.validation) {
        formValid = false
      }
      store.setField(Object.assign({
        id: field.id,
        state: check.state,
        originalState: check.originalState,
        validation: check.validation,
        originalValidation: check.originalValidation
      }))
    }
  }
  return formValid
}
