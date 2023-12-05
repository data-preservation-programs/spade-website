// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { useField } from './composables/use-field'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useResetForm = formId => {
  const fields = useGetFormFields(formId)
  const len = fields.length
  if (len === 0) { return false }
  for (let i = 0; i < len; i++) {
    useField().reset(fields[i].id)
  }
}
