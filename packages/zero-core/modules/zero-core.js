// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Fs from 'fs-extra'
import Path from 'path'
import StartCase from 'lodash/startcase'
import KebabCase from 'lodash/kebabcase'
import CamelCase from 'lodash/camelcase'

import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addComponent,
  addImportsDir,
  addImports,
  addPlugin
  // addImports,
  // extendPages,
  // addLayout,
  // addServerHandler,
  // addRouteMiddleware
} from 'nuxt/kit'

const { resolve } = createResolver(import.meta.url)
const globalPrefix = 'Zero'

// ////////////////////////////////////////////////////////////////////// Config
// -----------------------------------------------------------------------------
const meta = {
  name: '@undone-labs/nuxt-module-zero-core',
  configKey: 'nuxtModuleZeroCore',
  compatibility: {
    nuxt: '^3.0.0'
  }
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/**
 * @method validateKeyMustBeObject
 */

const validateKeyMustBeObject = (entry, key) => {
  if (entry === undefined && entry === null || Array.isArray(entry) || typeof entry !== 'object') {
    throw new Error(`The "${key}" key in the nuxt config must be an object → {}`)
  }
}

/**
 * @method toPascalCase
 */

const convertCase = (string, to = 'kebab') => {
  const startCase = StartCase(string).replaceAll(' ', '')
  if (to === 'pascal') { return startCase }
  if (to === 'kebab') { return KebabCase(startCase) }
  if (to === 'camel') { return CamelCase(startCase) }
  return string
}

/**
 * @method registerComponents
 */

const registerComponents = (path, components) => {
  path = resolve(path, 'components')
  if (!Fs.existsSync(path)) { return }
  if (components) {
    Object.keys(components).forEach(name => {
      const component = components[name]
      if (component.enable) {
        addComponent({
          name: `${globalPrefix}${name}`,
          filePath: resolve(path, `${convertCase(name, 'kebab')}.vue`)
        })
      }
    })
  } else {
    addComponentsDir({
      path,
      global: true
    })
  }
}

/**
 * @method registerComposables
 */

const registerComposables = (path, composables) => {
  path = resolve(path, 'composables')
  if (!Fs.existsSync(path)) { return }
  if (composables) {
    Object.keys(composables).forEach(name => {
      const composable = composables[name]
      if (composable.enable) {
        const slug = KebabCase(name)
        let prefix = composable.prefix
        prefix = prefix && prefix !== '' ? prefix : globalPrefix
        name = convertCase(`${prefix.toLowerCase()}-${name}`, 'camel')
        addImports({
          name: 'default',
          as: name,
          from: resolve(path, slug)
        })
      }
    })
  } else {
    addImportsDir(path)
  }
}

/**
 * @method registerPlugins
 */

const registerPlugins = (path, plugins) => {
  path = resolve(path, 'plugins')
  if (!Fs.existsSync(path)) { return }
  Object.keys(plugins).forEach(slug => {
    const plugin = plugins[slug]
    if (plugin.enable) {
      addPlugin(resolve(path, slug))
    }
  })
}

/**
 * @method registerStores
 */

const registerStores = path => {
  path = resolve(path, 'stores')
  if (!Fs.existsSync(path)) { return }
  Fs.readdirSync(path).filter(file => file.includes('.js')).forEach(store => {
    const slug = store.split('.js')[0]
    console.log(`🧺 [zero:store] ${slug}`)
    addImports({
      name: convertCase(slug, 'camel'),
      from: resolve(path, store)
    })
  })
}

// /////////////////////////////////////////////////////////////////////// Setup
// -----------------------------------------------------------------------------
const setup = (_, nuxt) => {
  console.log('📦 [load:module] zero-core')
  const options = nuxt.options
  if (!options.hasOwnProperty('zero')) { return }
  const zeroOptions = options.zero
  const basePath = resolve('..')
  validateKeyMustBeObject(zeroOptions, 'zero')
  registerComponents(basePath, zeroOptions.components)
  registerComposables(basePath, zeroOptions.composables)
  registerPlugins(basePath, zeroOptions.plugins)
  registerStores(basePath)
  const modulesPath = resolve(basePath, 'modules')
  const modules = Fs.readdirSync(modulesPath)
  const len = modules.length
  for (let i = 0; i < len; i++) {
    const module = modules[i]
    const modulePath = resolve(modulesPath, module)
    if (!Fs.statSync(modulePath).isDirectory()) { continue }
    const moduleOptions = zeroOptions.modules[module]
    if (moduleOptions.enable) {
      if (Fs.statSync(modulePath).isDirectory()) {
        console.log(`🧰 [zero:module] ${module}`)
        registerComponents(modulePath)
        registerComposables(modulePath)
        registerPlugins(modulePath)
        registerStores(modulePath)
      }
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtModule({
  meta,
  setup
})
