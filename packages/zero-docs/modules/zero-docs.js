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

/**
 * @method getDirectoryPath
 */

const getDirectoryPath = options => {
  const sources = options.sources
  const targetPath = sources.targetDocs?.base
  const srcPath = sources.srcDocs?.base
  return Fs.existsSync(targetPath) ? targetPath : srcPath
}

/**
 * @method walk
 */

const walk = (dir, split, next) => {
  const regex = new RegExp(`${split}(.*)`)
  let levelPath = dir.split(regex)
  levelPath.shift()
  levelPath.pop()
  levelPath = levelPath[0]
  const level = levelPath.split('/').length
  Fs.readdirSync(dir, { withFileTypes: true }).forEach(dirEnt => {
    const dirPath = resolve(dir, dirEnt.name)
    const isDirectory = Fs.statSync(dirPath).isDirectory()
    const ext = Path.extname(dirEnt.name).toLowerCase()
    if (level >= 5) {
      console.error(
        '\n  ❗️',
        `${Chalk.underline.red.bold('error:layer:zero-docs ')}${Chalk.bgRed.hex('#FFFFFF').bold(' server/plugins/generate-sitemap.js ')}\n`,
        `    Content can only be nested up to 3 directories deep.\n`,
        `    Example: ${Chalk.blue('/en/the-docs-directory/data')}\n`,
        Chalk.red('    Server should be restarted once nesting is fixed')
      )
      process.exit(0)
    }
    isDirectory ?
      walk(dirPath, split, next) :
      next({
        path: resolve(dir, dirEnt.name),
        name: dirEnt.name,
        slug: dirEnt.name.split(ext)[0],
        ext,
        level,
        levelPath
        // topLevelSlug: levelPath.split('/')[0],
        // parentSlug: levelPath.split('/').pop()
      })
  })
}

/**
 * @method generateSiteUrls
 */

const generateSiteUrls = (nitroConfig, options) => {
  if (nitroConfig.dev) { return }
  const path = getDirectoryPath(options.content)
  let siteUrls = []
  walk(path, path.split('/').pop(), file => {
    if (file.ext === '.md' && file.name !== 'src') {
      siteUrls.push(
        file.level < 4 ?
          `${file.levelPath.replace(/\d+. /g, '').replace(/[0-9]./g, '')}/${file.slug.replace(/\d+. /g, '').replace(/[0-9]./g, '')}` :
          `${file.levelPath.replace(/\d+. /g, '').replace(/[0-9]./g, '')}`
      )
    }
  })
  siteUrls = [...new Set(siteUrls)]
  console.log(siteUrls)
  siteUrls.forEach(url => {
    nitroConfig.prerender.routes.push(url)
  })
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (_, nuxt) => {
  console.log('\n  ⚡️', `${Chalk.underline.green.bold('load:layer ')}${Chalk.bgGreen.hex('#FFFFFF').bold(' zero-docs ')}\n`)
  const options = nuxt.options
  checkIfTargetDocsDirectoryExists(options.content)
  /**
   * Add all URLs to static site generation
   */
  nuxt.hook('nitro:config', nitroConfig => {
    generateSiteUrls(nitroConfig, options)
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
