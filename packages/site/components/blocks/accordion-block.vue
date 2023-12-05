<template>
  <div class="accordion-block">
    <div class="accordion">
      <div
        v-for="(section, index) in sections"
        :key="`accordion-section-${index}`"
        :class="['accordion-section', { open: active[index] } ]"
        @click="toggleSection(index)">

        <div class="border"></div>

        <div class="accordion-heading">

          <component :is="getIconComponent(section.icon)" class="icon" />

          <h3 class="h3">
            {{ section.heading }}
          </h3>

          <PlusMinusIcon :active="active[index]" />

        </div>

        <div class="accordion-content">
          <div class="text">
            {{ section.content }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// ===================================================================== Imports
const PieChartIcon = resolveComponent('icon/pie-chart-icon')
const ListIcon = resolveComponent('icon/list-icon')
const GlobeIcon = resolveComponent('icon/globe-icon')
const BranchIcon = resolveComponent('icon/branch-icon')
const MessageIcon = resolveComponent('icon/message-icon')
const InboxIcon = resolveComponent('icon/inbox-icon')

// ======================================================================= Props
const props = defineProps({
  block: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// ======================================================================== Data
const active = ref(new Array(props.block.sections.length).fill(false))

// ==================================================================== Computed
const sections = computed(() => {
  return props.block.sections
})

// ===================================================================== Methods
/**
 * @method toggleSection
 */
const toggleSection = (index) => {
  active.value[index] = !active.value[index]
}
/**
 * @method getIconComponent
 */
const getIconComponent = (icon) => {
  switch (icon) {
    case 'pie-chart' : return PieChartIcon;
    case 'list' : return ListIcon;
    case 'globe' : return GlobeIcon;
    case 'branch' : return BranchIcon;
    case 'message' : return MessageIcon;
    case 'inbox' : return InboxIcon;
    default : return 'span'
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.accordion-heading,
.accordion-content {
  position: relative;
  z-index: 2;
}

.accordion-heading {
  position: relative;
  display: flex;
  align-items: center;
  padding: toRem(16) 0;
  @include tiny {
    padding: toRem(10) 0;
    padding-right: toRem(38);
  }
  .icon {
    width: toRem(30);
    height: toRem(30);
    margin-right: toRem(22);
    @include tiny {
      width: toRem(22);
      height: toRem(22);
      min-width: toRem(22);
    }
  }
  :deep(.plus-minus-icon) {
    position: absolute;
    right: 0;
    top: calc(50% - toRem(15));
    width: toRem(30);
    height: toRem(30);
    @include tiny {
      width: toRem(22);
      height: toRem(22);
      top: calc(50% - toRem(11));
    }
    circle {
      // @include transitionDefault;
      fill: unset;
    }
  }
}

.accordion-content {
  padding-left: toRem(52);
  padding-right: toRem(73);
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms cubic-bezier(0.33, 0.2, 0.41, 0.99);
  @include mini {
    padding: 0 toRem(48);
  }
  @include tiny {
    padding: 0 toRem(41);
  }
  .text {
    @include p2;
    margin-bottom: toRem(16);
  }
}

.border {
  position: absolute;
  z-index: 1;
  inset: 0;
  border: solid 1px none;
  border-radius: toRem(3);
}

.accordion-section {
  position: relative;
  padding: 0 toRem(17);
  margin-bottom: toRem(13);
  cursor: pointer;
  // @include shadow2;
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    inset: 0;
    opacity: 0;
    border-radius: toRem(3);
    box-sizing: border-box;
    padding: toRem(1);
    // @include transitionDefault;
    -webkit-mask:
       linear-gradient(#fff 0 0) content-box,
       linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
  }
  &:hover {
    &:after {
      opacity: 1;
    }
    :deep(.plus-minus-icon) {
      filter: drop-shadow(0px 0px 3px rgba(#FFC582, 0.6));
    }
  }
  &.open {
    .accordion-content {
      max-height: toRem(200);
      @include large {
        max-height: toRem(228);
      }
      @include medium {
        max-height: toRem(300);
      }
    }
  }
}
</style>
