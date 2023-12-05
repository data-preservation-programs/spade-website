/**
 * @note only use for requests from client to backend
 */

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useFetchAuth = async (url, body = {}) => {
  body.url = url
  try {
    const response = await $fetch.raw('/api/fetch-auth', {
      method: 'post',
      ...(body.headers && { headers: body.headers }),
      body
    })
    return response._data
  } catch (e) {
    return undefined
  }
}
