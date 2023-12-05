<template>
  <main class="page">

    <h1 class="page-heading">
      Dropdown
    </h1>

    <!--**
        * [Dropdown] onClick
        * -->
    <ZeroDropdown @dropdown-panel-toggled="dropdownPanelToggled">

      <!-- =================================================== Toggle button -->
      <template #toggle-button="{ togglePanel, panelOpen }">
        <button
          :class="['navigation-toggle-button', { 'panel-open': panelOpen }]"
          @click="togglePanel">
          <div class="navigation-toggle-button-inner-container">
            Click to toggle
          </div>
        </button>
      </template>

      <!-- =========================================================== Panel -->
      <template #dropdown-panel>
        <ul>
          <li>Lorem ipsum</li>
          <li>Dolor sit</li>
          <li>Amet consectetur</li>
        </ul>
      </template>

    </ZeroDropdown>

    <!--**
        * [Dropdown] onHover
        * -->
    <ZeroDropdown
      toggle-on="hover"
      @dropdown-panel-toggled="dropdownPanelToggled">

      <!-- =================================================== Toggle button -->
      <template #toggle-button="{ togglePanel, panelOpen }">
        <button
          :class="['navigation-toggle-button', { 'panel-open': panelOpen }]"
          @click="togglePanel">
          <div class="navigation-toggle-button-inner-container">
            Hover to toggle
          </div>
        </button>
      </template>

      <!-- =========================================================== Panel -->
      <template #dropdown-panel>
        <ul>
          <li>Lorem ipsum</li>
          <li>Dolor sit</li>
          <li>Amet consectetur</li>
        </ul>
      </template>

    </ZeroDropdown>

  </main>
</template>

<script setup>
// ===================================================================== Methods
const dropdownPanelToggled = (state) => {
  console.log('Dropdown Panel Toggled:', state)
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
:deep(.dropdown-panel) {
  display: inline-block;
  &:not(:last-child) {
    margin-right: 3rem;
  }
}

.navigation-toggle-button {
  padding: 0 toRem(8);
  background-color: var(--divider);
  border-radius: toRem(4);
}

:deep(.panel-container) {
  padding-top: 0.5rem;
}

:deep(.panel) {
  width: 20rem;
  border-radius: toRem(5);
  background-color: var(--theme-color);
  color: var(--theme-color__inverted);
}

ul {
  padding: 1rem;
  list-style: none;
}
</style>
