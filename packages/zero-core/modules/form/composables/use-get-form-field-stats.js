// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useGetFormFieldStats = formId => {
  const fields = useGetFormFields(formId)
  const len = fields.length
  const stats = {
    total: 0, // the full grand total of all registered fields, regardless of visibility
    mounted: 0, // fields visible & active on page (excludes conditionally HIDDEN fields)
    count: 0, // fields that are mounted, are conditionally VISIBLE and are not explicitly excluded
    'not-started': 0,
    'in-progress': 0,
    completed: 0,
    error: 0
  }
  for (let i = 0; i < len; i++) {
    const field = fields[i]
    stats.total++
    if (field.formId === formId && field.displayField && field.mounted) {
      stats.mounted++
      if (field.scaffold.excludeFromStats !== true) {
        stats.count++
        field.state === 'not-started' ? stats['not-started']++
          : field.state === 'in-progress' ? stats['in-progress']++
            : field.state === 'completed' ? stats.completed++
              : stats.error++
      }
    }
  }
  return stats
}
