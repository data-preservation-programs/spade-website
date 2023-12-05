// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineEventHandler } from '#imports'
import { readBody } from 'h3'

import useFetchAuthNitro from '../../composables/use-fetch-auth-nitro'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineEventHandler(async (event) => {
  try {
    const response = await useFetchAuthNitro(event, await readBody(event))
    return response._data.payload
  } catch (e) {
    console.log(e)
    return false
  }
})
