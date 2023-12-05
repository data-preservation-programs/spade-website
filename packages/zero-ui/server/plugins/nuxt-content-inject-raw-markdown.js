// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNitroPlugin } from '#internal/nitro'
import { parseFrontMatter } from 'remark-mdc'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNitroPlugin((nitroApp) => {
  const files = {}

  nitroApp.hooks.hook('content:file:beforeParse', file => {
    if (file._id.endsWith('.md')) {
      files[file._id] = file.body
    }
  })

  nitroApp.hooks.hook('content:file:afterParse', file => {
    if (file._id.endsWith('.md')) {
      const parsed = parseFrontMatter(files[file._id])
      file.raw = parsed.content
      file.metadata = parsed.data
    }
  })
})
