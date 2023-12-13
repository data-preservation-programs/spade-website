// https://github.com/nuxt/eslint-plugin-nuxt/issues/173#issuecomment-1552676382

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { basename, resolve } from 'path'
import type { Import, Unimport } from 'unimport'
import { addTemplate, defineNuxtModule } from 'nuxt/kit'
import Chalk from 'chalk'

// ////////////////////////////////////////////////////////////////////// Module
// -----------------------------------------------------------------------------
const padding = ' '.repeat(4)
export default defineNuxtModule({
  setup (_, nuxt) {
    // =================================================================== setup
    const autoImports: { [key: string]: string[] } = {
      // global imports
      global: [
        '$fetch',
        'useCloneDeep',
        'defineStore',
        'defineNuxtConfig',
        'definePageMeta',
        'defineI18nConfig',
        'cachedEventHandler',
        'defineEventHandler'
      ]
    }

    // =================================================================== hooks
    nuxt.hook('imports:context', async (context: Unimport) => {
      const imports = await context.getImports()
      imports.forEach(autoImport => {
        const list = autoImports[autoImport.from] || []
        const name = autoImport.as ? autoImport.as!.toString() : autoImport.name.toString()
        autoImports[autoImport.from] = list.concat([name])
      })
    })

    nuxt.hook('imports:extend', (composableImport: Import[]) => {
      autoImports.composables = composableImport.map(autoImport => {
        if (autoImport.as) return autoImport.as!.toString()
        return autoImport.name.toString()
      })
    })

    nuxt.hook('modules:done', () => {
      const outDir = basename(nuxt.options.buildDir)
      const filename = '.eslint.nuxt3-globals.json'
      const fullPath = resolve(outDir, filename)

      const getContents = () => {
        // To prevent formatter accidentally fix padding of template string
        let contents = ''
        contents += '{\n'
        contents += '  "globals": {'
        for (const autoImport in autoImports) {
          contents += `\n${padding}// ${autoImport}`
          autoImports[autoImport].forEach(imp => {
            contents += '\n'
            contents += `${padding}"${imp}": "readonly",`
          })
        }
        contents = `${contents.slice(0, -1)}\n`
        contents += '  }\n'
        contents += '}\n'

        return contents
      }

      addTemplate({
        filename,
        getContents,
        write: true
      })

      const hex1 = '#C36B00'
      const hex2 = '#DB7800'
      const hex3 = '#FFFFFF'
      console.log(
        '\n  🧰',
        `${Chalk.underline.hex(hex1).bold('load:module ')}${Chalk.bgHex(hex2).hex(hex3).bold(' eslint-nuxt3-globals ')}`,
        Chalk.bold('\n     Globals file is generated at:'),
        `\n     ${fullPath}`
      )
    })
  }
})
