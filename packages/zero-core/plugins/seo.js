// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNuxtPlugin, useHead } from '#imports'
import CloneDeep from 'lodash/cloneDeep'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const seo = (key, override) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const zeroStore = useZeroStore()
  const { seo: SeoContent } = storeToRefs(zeroStore)
  if (!SeoContent.value._) { return }
  const defaults = CloneDeep(SeoContent.value._) // global SEO values
  if (!defaults) { throw new Error('Missing default "_" SEO entry') }
  let entry = CloneDeep(SeoContent.value[key])
  /**
   * Gather data and merge with defaults
   */
  if (entry && override) {
    for (const key in entry) {
      if (override.hasOwnProperty(key)) {
        if (entry[key].includes(`|${key}|`)) {
          entry[key] = entry[key].replaceAll(`|${key}|`, override[key])
        } else {
          entry[key] = override[key]
        }
      } else if (defaults.hasOwnProperty(key)) {
        entry[key] = defaults[key]
      }
    }
  }
  entry = Object.assign({ schemaOrgData: {} }, defaults, entry)
  /**
   * Compile data
   */
  const siteUrl = config.public.siteUrl
  const url = siteUrl + route.path
  const ogImage = entry.ogImage ? siteUrl + entry.ogImage : undefined
  const description = entry.description
  const title = entry.title
  const schemaOrgData = {
    '@context': 'https://schema.org',
    '@type': entry.schemaOrgData['@type'] || 'WebSite',
    name: title,
    abstract: description,
    mainEntity: {
      '@type': entry.schemaOrgData['@type'] || 'WebSite',
      name: title,
      url
    },
    image: ogImage,
    url
  }
  const data = {
    title,
    meta: [
      { name: 'description', content: description },
      { hid: 'og:title', property: 'og:title', content: title },
      { hid: 'og:description', property: 'og:description', content: description },
      { hid: 'og:site_name', property: 'og:site_name', content: seo.og_site_name },
      { hid: 'og:url', property: 'og:url', content: url },
      { hid: 'og:type', property: 'og:type', content: entry.ogType },
      { hid: 'og:image', property: 'og:image', content: ogImage },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', name: 'twitter:title', content: title },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      { hid: 'twitter:image', name: 'twitter:image', content: ogImage }
    ],
    link: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', hreflang: 'en', href: url },
      { rel: 'alternate', hreflang: 'x-default', href: url }
    ],
    script: [{ innerHTML: JSON.stringify(schemaOrgData), type: 'application/ld+json' }]
  }
  useHead(data)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtPlugin(() => {
  seo()
  return {
    provide: {
      seo
    }
  }
})
