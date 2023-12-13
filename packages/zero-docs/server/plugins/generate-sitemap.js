// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs-extra'
import Path from 'path'
import Chalk from 'chalk'

import { defineNitroPlugin } from '#internal/nitro'
import {
  loadNuxtConfig,
  createResolver
} from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/**
 * @method getDirectoryPath
 */

const getDirectoryPath = options => {
  const sources = options.sources
  const targetPath = sources.targetDocs.base
  const srcPath = sources.srcDocs.base
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

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNitroPlugin(async nitroApp => {
  const config = await loadNuxtConfig()
  const path = getDirectoryPath(config.content)
  let siteUrls = []
  walk(path, path.split('/').pop(), file => {
    if (file.ext === '.md' && file.name !== 'src') {
      siteUrls.push(
        file.level < 4 ?
          `${file.levelPath}/${file.slug}` :
          `${file.levelPath}`
      )
    }
  })
  siteUrls = [...new Set(siteUrls)]
  nitroApp.hooks.hook('sitemap:resolved', ctx => {
    siteUrls.forEach(url => {
      ctx.urls.push({
        loc: url,
        changefreq: 'daily'
      })
    })
  })
})
