// ////////////////////////////////////////////////////////////////// [Class] Ls
// -----------------------------------------------------------------------------
class Ls {
  // =============================================================== constructor
  constructor (options) {
    this.prefix = options.prefix || 'zero'
  }

  // ======================================================================= get
  get (key) {
    return localStorage.getItem(`${this.prefix}${key}`)
  }

  // ======================================================================= set
  set (key, value) {
    localStorage.setItem(`${this.prefix}${key}`, value)
  }

  // ==================================================================== remove
  remove (key) {
    localStorage.removeItem(`${this.prefix}${key}`)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default () => {
  const config = useRuntimeConfig()
  return new Ls(config.public.ls || {})
}
