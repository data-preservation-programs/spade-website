/**
 * @note only use for requests between Nitro and backend
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { appendResponseHeader, getQuery } from 'h3'
import { Agent } from 'undici'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default async (event, options = {}) => {
  try {
    const config = useRuntimeConfig()
    // Add forward / to url if none exists
    let url = options.url
    if (url.charAt(0) !== '/') { url = `/${url}` }
    delete options.url
    // Proxy cookies and add headers
    const reqCookies = event.node.req.headers.cookie || ''
    options.query = Object.assign(getQuery(event), options.query)
    options.headers = Object.assign(options.headers || {}, {
      ...(reqCookies !== '' && {
        cookie: reqCookies
      })
    })
    // Fetch data
    const response = await $fetch.raw(`${config.public.backendUrl}${url}`, Object.assign({
      credentials: 'include',
      ...(config.public.serverFlag === 'development' && {
        dispatcher: new Agent({
          connect: {
            rejectUnauthorized: false
          }
        })
      })
    }, options))
    const resCookies = response.headers.get('set-cookie')
    if (resCookies) {
      appendResponseHeader(event, 'set-cookie', response.headers.get('set-cookie'))
    }
    return response
  } catch (e) {
    console.log(e)
    throw e
  }
}
