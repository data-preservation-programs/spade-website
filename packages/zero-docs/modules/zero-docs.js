// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs-extra'

import {
  defineNuxtModule
} from 'nuxt/kit'

// ////////////////////////////////////////////////////////////////////// Config
// -----------------------------------------------------------------------------
const meta = {
  name: '@undone-labs/nuxt-module-zero-docs',
  configKey: 'nuxtModuleZeroDocs',
  compatibility: {
    nuxt: '^3.0.0'
  }
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/**
 * @method validateKeyMustBeObject
 */

const checkIfTargetDocsDirectoryExists = options => {
  const sources = options.sources
  const exists = Fs.existsSync(sources.targetDocs.base)
  if (exists) {
    delete sources.srcDocs
  }
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (_, nuxt) => {
  console.log('📦 [load:module] zero-docs')
  const options = nuxt.options
  checkIfTargetDocsDirectoryExists(options.content)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
