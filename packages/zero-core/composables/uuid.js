// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import {
  NIL as NIL,
  parse as parse,
  stringify as stringify,
  v1 as v1,
  v3 as v3,
  v4 as v4,
  v5 as v5,
  validate as validate,
  version as version
} from 'uuid'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default () => {
  return {
    NIL,
    parse,
    stringify,
    v1,
    v3,
    v4,
    v5,
    validate,
    version
  }
}
