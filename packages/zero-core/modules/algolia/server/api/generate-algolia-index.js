// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { serverQueryContent } from '#content/server'
import StartCase from 'lodash/startCase'
import MarkdownParser from 'kramed'
import { parse as NodeHtmlParser } from 'node-html-parser'
import AlgoliaSearch from 'algoliasearch'
import Chalk from 'chalk'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/**
 * @method generateBreadcrumbs
 */

const generateBreadcrumbs = (path, parentDirSlug) => {
  const full = path.slice(1, path.length).split('/')
  const index = full.indexOf(parentDirSlug)
  return {
    full,
    scoped: [
      full[index - 1],
      parentDirSlug
    ]
  }
}

/**
 * @method generateEntry
 */

const generateEntry = (doc, heading, id) => {
  let path = doc.path
  if (id) {
    path += `#${id}`
  }
  return {
    objectID: path,
    path,
    heading,
    content: ''
  }
}

/**
 * @method convertRawMarkdownToJson
 */

const convertRawMarkdownToJson = doc => {
  const parsedMarkdown = MarkdownParser(doc.raw)
  const parsedHtml = NodeHtmlParser(parsedMarkdown, {
    blockTextElements: {
      code: true
    }
  })
  const nodes = parsedHtml.childNodes
  if (nodes.length === 0) { return [] }
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  let heading = doc.title.trim()
  const compiled = []
  let currentIndex = -1
  if (!headings.includes(nodes[0].rawTagName)) {
    compiled.push(generateEntry(doc, heading))
    currentIndex++
  }
  const len = nodes.length
  for (let i = 0; i < len; i++) {
    const node = nodes[i]
    const content = node.textContent
    if (headings.includes(node.rawTagName)) {
      heading = content.trim()
      currentIndex++
      compiled.push(generateEntry(doc, heading, node.id))
    } else {
      compiled[currentIndex].content += content
    }
  }
  return compiled
}

/**
 * @method logOperationComplete
 */

const logOperationComplete = indexName => {
  const hex1 = '#C36B00'
  const hex2 = '#DB7800'
  const hex3 = '#FFFFFF'
  console.log(
    '\n  ⚡️',
    `${Chalk.underline.hex(hex1).bold('log:module:algolia ')}${Chalk.bgHex(hex2).hex(hex3).bold(' zero-core/modules/algolia/server/api/generate-algolia-index.js ')}`,
    Chalk.bold('\n     Algolia indexing complete'),
    `\n     index: ${Chalk.bold(indexName)}\n`
  )
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineEventHandler(async event => {
  /**
   * Fetch ALL content nested under `/docs`
   */
  let docs = await serverQueryContent(event, {
    where: {
      _path: { $contains: '/docs' }
    }
  }).find()
  /**
   * Only filter out non-markdown and non-src files and compile only necessary keys
   */
  docs = docs.filter(doc => doc._extension === 'md' && !doc._path.includes('/src')).map(doc => {
    const path = doc._path.replace('/docs', '')
    const dir = doc._dir
    return {
      path,
      parentDirSlug: dir,
      parentDirTitle: StartCase(dir),
      parentDirPath: `${path.split('/' + dir).shift()}/${dir}`,
      breadcrumbs: generateBreadcrumbs(path, dir),
      title: doc.title,
      ext: doc._extension,
      raw: doc.raw
    }
  })
  const records = []
  const len = docs.length
  for (let i = 0; i < len; i++) {
    const doc = docs[i]
    const sections = convertRawMarkdownToJson(doc)
    sections.forEach(section => {
      records.push({
        ...section,
        breadcrumbs: doc.breadcrumbs
      })
    })
  }

  if (records.length > 0) {
    const config = useRuntimeConfig().public.zeroAlgolia
    try {
      const client = await AlgoliaSearch(config.applicationId, config.apiKey)
      const indexName = config.indexName
      const index = client.initIndex(indexName)
      await index.setSettings({
        searchableAttributes: [
          'path', 'heading', 'content', 'breadcrumbs'
        ]
      })
      const objectIDs = await index.saveObjects(records)
      logOperationComplete(indexName)
    } catch (e) {
      console.log('======================================== createAlgoliaIndex')
      throw e
    }
  }
})
