// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { serverQueryContent } from '#content/server'

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
    return {
      path: doc._path.replace('/docs', ''),
      dir: doc._dir,
      ext: doc._extension
    }
  })
  /**
   * Build top-level directory URLs
   */
  let dirs = docs.map(doc => `${doc.path.split('/' + doc.dir).shift()}/${doc.dir}`)
  dirs = [...new Set(dirs)]
  /**
   * Generate links for sitemap
   */
  const sitemapUrls = []
  docs.forEach(doc => sitemapUrls.push({ loc: doc.path, lastmod: new Date() }))
  dirs.forEach(dir => sitemapUrls.push({ loc: dir, lastmod: new Date() }))
  return sitemapUrls
})
