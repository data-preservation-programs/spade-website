<template>
  <button
    id="theme-toggle"
    type="button"
    :class="theme"
    @click="toggleTheme">
    <span class="icon-container">

      <IconSun v-if="theme === 'light'" class="icon" />

      <IconMoon v-if="theme === 'dark'" class="icon" />

    </span>
  </button>
</template>

<script setup>
// ======================================================================= Setup
const generalStore = useGeneralStore()

// ======================================================================== Data
const { theme } = storeToRefs(generalStore)

// ======================================================================= Hooks
onMounted(() => {
  const initialTheme = localStorage.getItem('theme')
  if (initialTheme) {
    generalStore.setTheme(initialTheme)
  }
})

// ===================================================================== Methods
/**
 * @method toggleTheme
 */
const toggleTheme = () => {
  const toggle = theme.value === 'light' ? 'dark' : 'light'
  generalStore.setTheme(toggle)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#theme-toggle {
  display: flex;
  width: toRem(70);
  height: toRem(35);
  border: 2px solid var(--divider);
  border-radius: toRem(17.5);
  box-sizing: border-box;
  background-color: var(--background-color);
  &:hover {
    transition: 250ms ease-in;
  }
}

.icon-container {
  margin: 3px;
  background-color: var(--secondary-background-color);
  border-radius: 50%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.icon {
  display: block;
  width: toRem(15);
  height: toRem(15);
  margin: 5px;
  :deep(path) {
    color: var(--primary-text-color);
  }
}

// ////////////////////////////////////////////////////////////////////// Themes
.light {
  .icon-container {
    transform: translateX(0);
    transition: transform 250ms ease-in;
    .icon-sun {
      opacity: 1;
      transition: opacity 100ms ease-in;
    }
  }
}

.dark {
  .icon-container {
    transform: translateX(toRem(34));
    transition: transform 250ms ease-in;
    .icon-moon {
      opacity: 1;
      transition: opacity 100ms ease-in;
    }
  }
}
</style>
