// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref, computed } from '#imports'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useZeroDocsStore = defineStore('docs', () => {
  // ===================================================================== state
  const settings = ref({})
  const activeSection = ref(false)
  const activeLinkMarkerHeight = ref(0)
  const magellanLinks = ref([])

  // ================================================================== computed
  const theme = computed(() => {
    return settings.value.hasOwnProperty('theme') ?
      settings.value.theme :
      'light'
  })

  const themeToggleVisible = computed(() => {
    return settings.value.hasOwnProperty('themeToggleVisible') ?
      settings.value.themeToggleVisible :
      true
  })

  const language = computed(() => {
    return settings.value.hasOwnProperty('language') ?
      settings.value.language :
      'en'
  })

  const languageSelectorVisible = computed(() => {
    return settings.value.hasOwnProperty('languageSelectorVisible') ?
      settings.value.languageSelectorVisible :
      false
  })

  // =================================================================== actions

  /**
   * @method setSettings
   */

  const setSettings = incoming => {
    settings.value = incoming
  }

  /**
   * @method setTheme
   */

  const setTheme = newTheme => {
    settings.value.theme = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  }

  /**
   * @method setLanguage
   */

  const setLanguage = newLanguage => {
    settings.value.language = newLanguage
    localStorage.setItem('language', newLanguage)
  }

  /**
   * @method setActiveSection
   */

  const setActiveSection = hash => {
    activeSection.value = hash
  }

  /**
   * @method compileMagellanLinks
   */

  const compileMagellanLinks = headings => {
    if (headings.length === 0) {
      magellanLinks.value = []
      return
    }
    magellanLinks.value = headings.reduce((acc, item) => {
      acc.push({
        level: `level-${item.localName}`,
        hash: `#${item.id}`,
        id: item.id,
        sectionId: item.getAttribute('section'),
        text: item.textContent.replace('#', '')
      })
      return acc
    }, [])
    setActiveLinkMarkerHeight()
  }

  /**
   * @method setActiveLinkMarkerHeight
   */

  const setActiveLinkMarkerHeight = () => {
    const firstLinkElement = document.querySelector(`[link-hash]`)
    if (firstLinkElement) {
      activeLinkMarkerHeight.value = firstLinkElement.offsetHeight
    }
  }

  // ==================================================================== return
  return {
    // ----- state
    activeSection,
    magellanLinks,
    activeLinkMarkerHeight,
    // ----- computed
    theme,
    themeToggleVisible,
    language,
    languageSelectorVisible,
    // ----- actions
    setSettings,
    setTheme,
    setLanguage,
    setActiveSection,
    compileMagellanLinks,
    setActiveLinkMarkerHeight
  }
})
