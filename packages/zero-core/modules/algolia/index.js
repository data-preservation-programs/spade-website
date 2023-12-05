// // ///////////////////////////////////////////////////////////////////// Imports
// // -----------------------------------------------------------------------------
import {
  defineNuxtModule
  // createResolver,
  // addComponentsDir,
  // addComponent,
  // addImportsDir,
  // addImports,
  // addPlugin
  // addImports,
  // extendPages,
  // addLayout,
  // addServerHandler,
  // addRouteMiddleware
} from 'nuxt/kit'

// import Path from 'path'
// import Fs from 'fs'
// import { loadNuxtConfig } from 'nuxt/kit'
// import AlgoliaSearch from 'algoliasearch'
// import MarkdownParser from 'kramed'
// import { parseFrontMatter } from 'remark-mdc'
// import { parse as NodeHtmlParser } from 'node-html-parser'
// import { useUnSlugify } from '../../composables/use-unslugify'

// // /////////////////////////////////////////////////////////////////// Functions
// // -----------------------------------------------------------------------------
// // /////////////////////////////////////////////////// parseMarkdownStringToJson
// const parseMarkdownStringToJson = (fileName, fileLevelPath, fileLevel, string) => {
//   fileName = fileName.replace(/[0-9]./g, '')
//   const sections = []
//   const parsedFrontmatter = parseFrontMatter(string)
//   const parsedMarkdown = MarkdownParser(parsedFrontmatter.content)
//   const parsedHtml = NodeHtmlParser(parsedMarkdown, {
//     blockTextElements: {
//       code: true
//     }
//   })
//   const nodes = parsedHtml.childNodes
//   const len = nodes.length
//   const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
//   let heading = useUnSlugify(fileName, 'pascal-case', '-', ' ')
//   let compiled = {}
//   if (!headings.includes(nodes[0].rawTagName)) {
//     compiled = {
//       [heading]: {
//         content: '',
//         headingId: fileLevel < 2 ? fileName : fileLevelPath.split('/').pop()
//       }
//     }
//   }
//   for (let i = 0; i < len; i++) {
//     const node = nodes[i]
//     const content = node.textContent
//     if (headings.includes(node.rawTagName)) {
//       heading = content
//       compiled[heading] = {
//         content: '',
//         headingId: node.id
//       }
//     } else if (content && content !== '') {
//       compiled[heading].content += content
//     }
//   }
//   Object.keys(compiled).forEach(key => {
//     sections.push({
//       heading: key,
//       headingId: compiled[key].headingId,
//       fileName,
//       content: `${compiled[key].content}`
//     })
//   })
//   return sections
// }

// // //////////////////////////////////////////////////////////////////////// walk
// const walk = (dir, split, next) => {
//   let levelPath = dir.split(split)
//   levelPath = levelPath.length === 2 ? levelPath.pop().slice(1) : `${split}${levelPath.pop()}`
//   const level = levelPath === '' ? 0 : levelPath.split('/').length
//   Fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
//     const dirPath = Path.join(dir, file.name)
//     const isDirectory = Fs.statSync(dirPath).isDirectory()
//     if (level >= 3) {
//       console.error('‼️ Content can only be nested 2 directories deep. ‼️')
//       process.exit(0)
//     }
//     isDirectory ?
//       walk(dirPath, split, next) :
//       next({
//         path: Path.join(dir, file.name),
//         name: file.name.split('.md')[0],
//         ext: Path.extname(file.name).toLowerCase(),
//         level,
//         levelPath: levelPath,
//         topLevelSlug: levelPath.split('/')[0],
//         parentSlug: levelPath.split('/').pop()
//       })
//   })
// }

// // ///////////////////////////////////////// compileDirContentForAlgoliaIndexing
// const compileDirContentForAlgoliaIndexing = (nuxtConfig) => {
//   const records = []
//   nuxtConfig.algolia.sources.forEach(source => {
//     walk(source.path, source.contentDirectoryName, file => {
//       const filePath = file.path
//       if (file.ext === '.md' && file.name !== 'src') {
//         const sections = parseMarkdownStringToJson(
//           file.name,
//           file.levelPath,
//           file.level,
//           Fs.readFileSync(filePath, 'utf-8')
//         )
//         const topLevelSlug = file.topLevelSlug
//         const parentSlug = file.parentSlug
//         const fileLevelPath = file.levelPath
//         sections.forEach(section => {
//           records.push({
//             objectID: (file.level < 2 ?
//                           `/${fileLevelPath}/${section.fileName}#${section.headingId}` :
//                           `/${fileLevelPath}#${section.headingId}`).replace('//', '/'),
//             sidebarHeading: useUnSlugify(topLevelSlug, 'pascal-case', '-', ' '),
//             entryName: useUnSlugify(
//               file.level < 2 ? section.fileName : parentSlug,
//               'pascal-case',
//               '-',
//               ' '
//             ),
//             entrySection: section.heading,
//             content: section.content
//           })
//         })
//       }
//     })
//   })
//   return records
// }

// // ////////////////////////////////////////////////////////// createAlgoliaIndex
// const createAlgoliaIndex = async (nuxtConfig, records) => {
//   try {
//     const client = AlgoliaSearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY)
//     const indexName = nuxtConfig.algolia.indexName
//     const index = client.initIndex(indexName)
//     await index.setSettings({
//       searchableAttributes: [
//         'sidebarHeading', 'entryName', 'entrySection', 'content'
//       ]
//     })
//     const objectIDs = await index.saveObjects(records)
//     console.log(`The following records have been added/updated to the Algolia index [${indexName}]:`)
//     console.log(objectIDs)
//   } catch (e) {
//     console.log('========================================== createAlgoliaIndex')
//     throw e
//   }
// }

// // //////////////////////////////////////////////////////////////////////// sync
// const sync = async () => {
//   console.log('HIT')
//   // const nuxtConfig = await loadNuxtConfig()
//   // if (!nuxtConfig.algolia.disable) {
//   //   try {
//   //     await createAlgoliaIndex(
//   //       nuxtConfig,
//   //       compileDirContentForAlgoliaIndexing(nuxtConfig)
//   //     )
//   //   } catch (e) {
//   //     console.log('================================ syncContentDirOnFileChange')
//   //     console.log(e)
//   //   }
//   // }
// }; sync()

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (_, nuxt) => {
  const options = nuxt.options.zero.modules.algolia
  if (!options.enable) { return }
  console.log('ALGOLIA')
  // const nuxtConfig = await loadNuxtConfig()
  // if (!nuxtConfig.algolia.disable) {
  //   try {
  //     await createAlgoliaIndex(
  //       nuxtConfig,
  //       compileDirContentForAlgoliaIndexing(nuxtConfig)
  //     )
  //   } catch (e) {
  //     console.log('================================ syncContentDirOnFileChange')
  //     console.log(e)
  //   }
  // }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  // meta,
  setup
})
