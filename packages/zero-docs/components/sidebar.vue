<template>
  <aside class="sidebar">

    <div class="navigation-wrapper">
      <div class="gradient top" />
      <ContentNav />
      <div class="gradient bottom" />
    </div>

    <div class="magellan-menu-wrapper">
      <div class="gradient top" />
      <MagellanMenu />
      <div class="gradient bottom" />
    </div>

  </aside>
</template>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.sidebar {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: $siteHeaderHeight;
  left: calc((100vw - $gridWidth) / 2);
  width: $sidebarWidth;
  height: calc(100% - #{$siteHeaderHeight});
  background-color: var(--background-color);
  border-right: 1px solid var(--divider);
  transition: background-color 500ms, border-color 500ms;
  @include gridMaxMQ {
    left: 0;
  }
}

#content-nav,
#magellan-menu {
  height: 100%;
  overflow-y: scroll;
  padding: $sidebarPadding;
  padding-left: 0;
  @include customMaxMQ($gridWidth + 1rem) {
    padding-left: 2rem;
  }
}

#magellan-menu {
  padding-top: calc($sidebarPadding + 1.25rem);
}

.gradient {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2rem;
  pointer-events: none;
  z-index: 100;
  &.top {
    top: 0;
    background: linear-gradient(to bottom, var(--background-color), rgba(var(--background-color), 0));
  }
  &.bottom {
    bottom: 0;
    background: linear-gradient(to top, var(--background-color), rgba(var(--background-color), 0));
  }
}

// //////////////////////////////////////////////////////// [Navigation] content
.navigation-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

// /////////////////////////////////////////////////////// [Navigation] magellan
.magellan-menu-wrapper {
  position: relative;
  max-height: calc(100vh * 0.382);
  &:after {
    content: '';
    position: absolute;
    bottom: calc(100% - 1px);
    right: 0;
    height: 1px;
    width: calc(100% + (100vw - $gridWidth) / 2);
    background-color: var(--divider);
    transition: background-color 500ms;
    @include gridMaxMQ {
      width: calc(100% + (100vw * 0.041665));
    }
  }
  .gradient.top {
    top: 1px;
  }
}
</style>
