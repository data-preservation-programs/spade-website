// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Chalk from 'chalk'

import {
  defineNuxtModule
} from 'nuxt/kit'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/**
 * @method validateEnvs
 */

const validateEnvs = () => {
  const envs = {
    ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    ALGOLIA_INDEX_ID: process.env.ALGOLIA_INDEX_ID
  }
  Object.keys(envs).map(key => {
    const env = envs[key]
    if (env && env !== '') {
      delete envs[key]
    }
  })
  const errors = Object.keys(envs)
  if (errors.length > 0) {
    console.log(
      '\n  ❗️',
      `${Chalk.underline.red.bold('error:module:algolia ')}${Chalk.bgRed.hex('#FFFFFF').bold(' zero-core/modules/algolia/index.js ')}\n`,
      Chalk.red.bold(`    Looks like you enabled the Algolia Zero module but forgot to define the required environment variables\n`),
      Chalk.red('    The following variables are missing:\n'),
      Chalk.bold.red(`    · ${errors.join('\n     · ')}`)
    )
    throw new Error('Missing environment variables')
  }
}

/**
 * @method addOptionsToRuntimeConfig
 */

const addOptionsToRuntimeConfig = (nuxtOptions, options) => {
  nuxtOptions.runtimeConfig.public.zeroAlgolia = options
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = async (_, nuxt) => {
  const options = nuxt.options.zero.modules.algolia || {}
  if (!options.enable) { return }
  validateEnvs()
  addOptionsToRuntimeConfig(nuxt.options, options)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  // meta,
  setup
})
