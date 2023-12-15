// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Path from 'path'
import Fs from 'fs-extra'
import Chalk from 'chalk'

import {
  createResolver,
  defineNuxtModule
} from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

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
 * @method checkIfTargetDocsDirectoryExists
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
const setup = async (_, nuxt) => {
  console.log('\n  ⚡️', `${Chalk.underline.green.bold('load:layer ')}${Chalk.bgGreen.hex('#FFFFFF').bold(' zero-docs ')}\n`)
  const options = nuxt.options
  checkIfTargetDocsDirectoryExists(options.content)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
