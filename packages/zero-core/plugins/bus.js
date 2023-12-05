// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'
const emitter = mitt()

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtPlugin(() => {
  return {
    provide: {
      bus: {
        $on: emitter.on,
        $emit: emitter.emit
      }
    }
  }
})
