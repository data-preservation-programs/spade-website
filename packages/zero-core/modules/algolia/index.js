// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Chalk from 'chalk'

import {
  defineNuxtModule,
  createResolver
} from 'nuxt/kit'

import Path from 'path'
import Fs from 'fs'
import AlgoliaSearch from 'algoliasearch'
import MarkdownParser from 'kramed'
import { parseFrontMatter } from 'remark-mdc'
import { parse as NodeHtmlParser } from 'node-html-parser'
import useUnSlugify from '../../composables/unslugify'

const { resolve } = createResolver(import.meta.url)

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
  nuxtOptions.runtimeConfig.public.zeroAlgolia = {
    enable: options.enable,
    indexName: options.indexName
  }
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
        levelPath,
        topLevelSlug: levelPath.split('/')[1],
        parentSlug: levelPath.split('/').pop()
      })
  })
}

/**
 * @method parseMarkdownStringToJson
 */

const parseMarkdownStringToJson = (fileName, fileLevelPath, fileLevel, string) => {
  fileName = fileName.replace(/[0-9]./g, '')
  const sections = []
  const parsedFrontmatter = parseFrontMatter(string)
  const parsedMarkdown = MarkdownParser(parsedFrontmatter.content)
  const parsedHtml = NodeHtmlParser(parsedMarkdown, {
    blockTextElements: {
      code: true
    }
  })
  const nodes = parsedHtml.childNodes
  const len = nodes.length
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  let heading = useUnSlugify(fileName, 'pascal-case', '-', ' ')
  let compiled = {}
  if (nodes[0] && !headings.includes(nodes[0].rawTagName)) {
    compiled = {
      [heading]: {
        content: '',
        headingId: fileLevel < 4 ? fileName : fileLevelPath.split('/').pop()
      }
    }
  }
  for (let i = 0; i < len; i++) {
    const node = nodes[i]
    const content = node.textContent
    if (headings.includes(node.rawTagName)) {
      heading = content
      compiled[heading] = {
        content: '',
        headingId: node.id
      }
    } else if (content && content !== '') {
      compiled[heading].content += content
    }
  }
  Object.keys(compiled).forEach(key => {
    sections.push({
      heading: key,
      headingId: compiled[key].headingId,
      fileName,
      content: `${compiled[key].content}`
    })
  })
  return sections
}

/**
 * @method compileDirContentForAlgoliaIndexing
 */

const compileDirContentForAlgoliaIndexing = sources => {
  const records = []
  sources.forEach(source => {
    walk(source, source.split('/').pop(), file => {
      const filePath = file.path
      if (file.ext === '.md' && file.name !== 'src') {
        const sections = parseMarkdownStringToJson(
          file.name,
          file.levelPath,
          file.level,
          Fs.readFileSync(filePath, 'utf-8')
        )
        const topLevelSlug = file.topLevelSlug
        const parentSlug = file.parentSlug
        const fileLevelPath = file.levelPath
        sections.forEach(section => {
          records.push({
            objectID: (file.level < 4 ?
                          `/${fileLevelPath}/${section.fileName.replace('.md', '')}#${section.headingId}` :
                          `/${fileLevelPath}#${section.headingId}`).replace('//', '/'),
            sidebarHeading: useUnSlugify(parentSlug, 'pascal-case', '-', ' '),
            entryName: useUnSlugify(
              file.level < 4 ? section.fileName : parentSlug,
              'pascal-case',
              '-',
              ' '
            ),
            entrySection: section.heading,
            content: section.content
          })
        })
      }
    })
  })
  return records
}

/**
 * @method createAlgoliaIndex
 */

const createAlgoliaIndex = async (options, records) => {
  try {
    const client = AlgoliaSearch(options.applicationId, options.apiKey)
    const indexName = options.indexName
    const index = client.initIndex(indexName)
    await index.setSettings({
      searchableAttributes: [
        'sidebarHeading', 'entryName', 'entrySection', 'content'
      ]
    })
    const objectIDs = await index.saveObjects(records)
    console.log(`The following records have been added/updated to the Algolia index [${indexName}]:`)
    console.log(objectIDs)
  } catch (e) {
    console.log('========================================== createAlgoliaIndex')
    throw e
  }
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = async (_, nuxt) => {
  const options = nuxt.options.zero.modules.algolia || {}
  if (!options.enable) { return }
  validateEnvs()
  addOptionsToRuntimeConfig(nuxt.options, options)
  const records = compileDirContentForAlgoliaIndexing(options.sources)
  try {
    await createAlgoliaIndex(options, records)
  } catch (e) {
    console.log('========================================= zero:module:algolia')
    console.log(e)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  // meta,
  setup
})
