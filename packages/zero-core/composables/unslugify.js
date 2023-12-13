// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
/**
 * @note be VERY VERY careful if editing this composable. It's used in a lot of
 * places throughout zero-core
 */
export default (slug, type = 'pascal-case', splitWith = '-', joinWith = '') => {
  if (type === 'pascal-case') {
    return slug
      .toLowerCase()
      .split(splitWith)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(joinWith)
  } else if (type === 'camel-case') {
    return slug
      .toLowerCase()
      .split(splitWith)
      .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join(joinWith)
  } else {
    return 'Incompatible "Type" specified. Must be type "pascal-case" or "camel-case". Default is "pascal-case"'
  }
}
