<template>
  <main class="page login-success">

    <component
      :is="resolveComponent()"
      v-if="resolveComponent()"
      class="custom-login-page" />

    <template v-else>
      <div class="text">
        authenticating
      </div>
      <div class="triple-dot-loader">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
    </template>

  </main>
</template>

<script setup>
// ======================================================================= Setup
definePageMeta({
  layout: 'zero-auth-layout',
  authenticate: false
})

useHead({ title: 'Authenticating' })

// ======================================================================== Data
const route = useRoute()
const config = useRuntimeConfig()

// ======================================================================= Hooks
onMounted(async () => {
  if (!window.opener && window.opener !== window && window.name !== 'login-github-popup') {
    await navigateTo('/')
  }
  animateTitle()
  const session = await useFetchAuth('/login', {
    method: 'post',
    query: Object.assign(route.query, { strategy: 'github' }),
    body: {}
  })
  window.opener.postMessage({
    session,
    loader: 'auth-github'
  }, config.public.siteUrl)
  window.close()
})

// ===================================================================== Methods
/**
 * @method resolveComponent
 */

const resolveComponent = () => {
  const instance = getCurrentInstance()
  const compToResolve = 'LoginLoading'
  if (typeof instance?.appContext.components === 'object' && compToResolve in instance.appContext.components) {
    return compToResolve
  }
  return false
}

/**
 * @method animateTitle
 */

const animateTitle = () => {
  let dots = ['.']
  setInterval(() => {
    dots.length === 3 ? dots = ['.'] : dots.push('.')
    useHead({
      title: `Authenticating${dots.join('')}`
    })
  }, 250)
}
</script>

<style lang="scss" scoped>
@keyframes dot {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

// ///////////////////////////////////////////////////////////////////// General
.page {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;
}

.custom-login-page {
  width: 100%;
  height: 100%;
}

.triple-dot-loader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 100%;
  display: inline-block;
  background-color: #303030;
  animation: dot 1.4s infinite ease-in-out both;
  transition: 250ms ease-in-out;
  &.dot-1 {
    animation-delay: -0.32s;
  }
  &.dot-2 {
    animation-delay: -0.16s;
    margin: 0 0.25rem;
  }
}

.text {
  font-family: monospace;
  margin-right: 1rem;
}
</style>
