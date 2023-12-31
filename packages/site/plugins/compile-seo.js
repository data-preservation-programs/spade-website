/*
 *
 * 🔌 [Plugin] CompileSeo
 *
 */

// ///////////////////////////////////////////////// Convert SEO to final output
// ------------------------------------------------------ Output for head() hook
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  nuxtApp.provide('CompileSeo', (seo) => {
    console.log(seo)
    console.log(config.public)
    const siteName = config.public.seo.siteName
    const siteUrl = config.public.siteUrl
    const title = seo.title
    const description = seo.description
    const image = siteUrl + seo.og_image
    const url = seo.og_url
    const incomingStructuredData = seo.structured_data || {}
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': incomingStructuredData['@type'] || 'WebSite',
      name: title,
      abstract: description,
      mainEntity: {
        '@type': incomingStructuredData['@type'] || 'WebSite',
        name: siteName,
        url: siteUrl
      },
      image,
      url
    }
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: seo.og_site_name },
        { hid: 'og:url', property: 'og:url', content: url },
        { hid: 'og:type', property: 'og:type', content: seo.og_type },
        { hid: 'og:image', property: 'og:image', content: image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { hid: 'twitter:description', name: 'twitter:description', content: description },
        { hid: 'twitter:image', name: 'twitter:image', content: image }
      ],
      link: [
        { rel: 'canonical', href: url },
        { rel: 'alternate', hreflang: 'en', href: url },
        { rel: 'alternate', hreflang: 'x-default', href: url }
      ],
      __dangerouslyDisableSanitizers: ['script'],
      script: [{ innerHTML: JSON.stringify(structuredData), type: 'application/ld+json' }]
    }
  })
})
