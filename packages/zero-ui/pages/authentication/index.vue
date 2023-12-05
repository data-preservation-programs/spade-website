<template>
  <main class="page">

    <h1 class="page-heading">
      Authentication
    </h1>

    <ZeroKitchenSinkButton
      v-bind="loginWithGithubButton"
      :disabled="loggedIn"
      @clicked="useLoginWith('github')">
      Login with GitHub
    </ZeroKitchenSinkButton>

    <client-only>
      <ZeroKitchenSinkButton
        v-bind="loginWithMetamaskButton"
        :disabled="loggedIn"
        @clicked="useLoginWith('metamask')">
        {{ metamaskInstalled ? 'Login with MetaMask' : 'Click here to install MetaMask' }}
      </ZeroKitchenSinkButton>
    </client-only>

    <ZeroKitchenSinkButton
      v-bind="logoutButton"
      :disabled="!loggedIn"
      @clicked="useLogout()">
      Logout
    </ZeroKitchenSinkButton>

    <template v-if="loggedIn">
      <h3>Providers</h3>
      <ZeroKitchenSinkButton
        v-bind="registerOauthProviderGithubButton"
        @clicked="useLoginWith('github')">
        Connect Github
      </ZeroKitchenSinkButton>
      <client-only>
        <ZeroKitchenSinkButton
          v-bind="registerOauthProviderMetamaskButton"
          @clicked="useLoginWith('metamask')">
          {{ metamaskInstalled ? 'Connect MetaMask' : 'Click here to install MetaMask' }}
        </ZeroKitchenSinkButton>
      </client-only>
    </template>

    <h4>Session</h4>
    <ZeroMarkdownParser :markdown="sessionCode" />

    <h4>User</h4>
    <ZeroMarkdownParser :markdown="userCode" />

  </main>
</template>

<script setup>
// ======================================================================== Data
const authStore = useZeroAuthStore()
const {
  session,
  user,
  loggedIn,
  metamaskInstalled
} = storeToRefs(authStore)

const loginWithGithubButton = {
  tag: 'button',
  loader: 'auth-github',
  theme: 'basic'
}

const loginWithMetamaskButton = {
  tag: 'button',
  loader: metamaskInstalled.value ? 'auth-metamask' : undefined,
  theme: 'basic'
}

const logoutButton = {
  tag: 'button',
  loader: 'auth-logout',
  theme: 'basic'
}

const registerOauthProviderGithubButton = {
  tag: 'button',
  loader: 'auth-register-github',
  theme: 'basic'
}

const registerOauthProviderMetamaskButton = {
  tag: 'button',
  loader: metamaskInstalled.value ? 'auth-register-metamask' : undefined,
  theme: 'basic'
}

// ==================================================================== Computed
const sessionCode = computed(() => '```json\n' + (session.value ? JSON.stringify(session.value, null, 2) : 'No session found') + '\n```')
const userCode = computed(() => '```json\n' + (user.value ? JSON.stringify(user.value, null, 2) : 'No user found') + '\n```')

// onMounted(() => {
//   console.log(window.ethereum)
// })
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
h4 {
  &:first-of-type {
    margin-top: 3rem;
  }
}

.button {
  margin-right: 1rem;
  margin-bottom: 1rem;
}
</style>
