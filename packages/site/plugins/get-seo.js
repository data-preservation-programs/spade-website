/*
 *
 * 🔌 [Plugin] GetSeo
 *
 */

// ///////////////////////////////////////////////// Get SEO and Open Graph data
// ----------------------------- Return global SEO if no identifier is specified
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('GetSeo', (storeName = 'general', identifier = 'general') => {
    const store = nuxtApp.$pinia.state.value[storeName]
    let data = store.siteContent[identifier]
    if (!data) { data = store.siteContent.general }
    if (data) {
      const seo = data.seo
      const og = data.og
      return {
        title: seo.title,
        description: seo.description,
        structured_data: seo.structured_data,
        og_site_name: og.site_name,
        og_url: og.url,
        og_type: og.type,
        og_image: og.image
      }
    }
    return {}
  })
})
