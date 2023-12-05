// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { serverQueryContent } from '#content/server'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default cachedEventHandler(async (e) => {
  let docs = await serverQueryContent(e).find()
  return docs.reduce((acc, doc) => {
    const path = doc._path
    if (path && path.includes('/docs/content')) {
      acc.push({
        loc: path.replace('/docs/content', ''),
        lastmod: new Date()
      })
    }
    return acc
  }, [])
},
{
  name: 'sitemap',
  maxAge: 60 * 10 // cache URLs for 10 minutes
})
