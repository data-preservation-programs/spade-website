// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref } from '#imports'
import { Octokit } from "@octokit/core";
import NavigationData from '@/data/navigation.json'
import FooterData from '@/data/footer.json'
import moment from 'moment'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const clipboard = ref(false)
const siteContent = ref({})
const theme = ref('light')
const navigationOpen = ref(false)

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////// clearStore
const clearStore = () => {
  siteContent.value = {}
}

// /////////////////////////////////////////////////////////////// getBaseData
const getBaseData = async (payload) => {
  const key = typeof payload === 'string' ? payload : payload.key
  let data = false
  switch (key) {
    case 'general': data = Object.assign({}, { navigation: NavigationData }, { footer: FooterData }); break
    default : data = payload.data; break
  }
  if (data) {
    siteContent.value[key] = data
  }
}

// //////////////////////////////////////////////////////////////////// setTheme
const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
  document.documentElement.className = newTheme
}

// /////////////////////////////////////////////////////////// setNavigationOpen
const setNavigationOpen = () => {
  navigationOpen.value = !navigationOpen.value
}

// ///////////////////////////////////////////////////////////// getRoadmapItems
const getRoadmapItems = async (incoming) => {
  try {
    const octokit = new Octokit({ auth: incoming.token })
    const roadmap = await octokit.request('GET /repos/data-preservation-programs/spade/issues/{19}', {
      owner: 'data-preservation-programs',
      repo: 'spade',
      issue_number: '19',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (roadmap?.data?.length) {
      const months = {}
      roadmap.data.forEach((item) => {
        const parsed = item.body?.match(/ETA:\s[0-9]{4}-[0-9]{2}-[0-9]{2}/gm)
        if (parsed?.length) {
          const eta = parsed[0].substring(5)
          const key = eta.substring(0, 7)
          item.eta = eta
          if (!months[key]) {
            months[key] = [item]
          } else {
            months[key].push(item)
          }
        }
      })
      Object.keys(months).forEach((key) => {
        months[key].sort((a, b) => moment(a.eta).valueOf() - moment(b.eta).valueOf())
      })
      siteContent.value.roadmap = months
    }
  } catch (e) {
    console.log('================================= [function: getRoadmapItems]')
    console.log(e)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useGeneralStore = defineStore('general', () => ({
  // ----- state
  clipboard,
  siteContent,
  theme,
  navigationOpen,
  // ----- actions
  clearStore,
  getBaseData,
  setTheme,
  setNavigationOpen,
  getRoadmapItems
}))
