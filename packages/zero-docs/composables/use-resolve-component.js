// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useResolveComponent = tag => {
  let component
  switch (tag) {
    case 'SiteLogo' : component = resolveComponent('SiteLogo'); break
    default: component = false
  }
  return component
}
