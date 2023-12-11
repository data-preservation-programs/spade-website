<template>
  <div v-if="graph" :class="['graph-card', block.graph]">

    <div class="caption before">
      {{ graph.captionBefore }}
    </div>

    <div class="graph" :style="{ height: `${graph.height}px` }">

      <div v-if="graph.axis" class="y-axis">
        <span v-for="n in 4" :key="`y-val-${n}`">
          {{ `${(n - 1) * 2}k` }}
        </span>
      </div>

      <div class="curves">
        <div
          v-for="(curve, i) in graph.curves"
          :key="`curve-${i}`"
          :class="['curve', `curve-${i + 1}`]"
          :style="{ '--curve-stroke-color': curve.color }">
          <component :is="getSvgCurve(curve.svg)" />
        </div>
      </div>

    </div>

    <div class="caption after">
      {{ graph.captionAfter }}
    </div>

    <div v-if="graph.legend" class="legend">
      <div
        v-for="(curve, i) in graph.curves"
        :key="`legend-item-${i}`"
        class="legend-item">
        <div class="color-block" :style="{ 'background-color': curve.color }"></div>
        <span>
          {{ curve.name }}
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
// ====================================================================== Import
const GraphCurveOne = resolveComponent('./svgs/graph-curve-1')
const GraphCurveTwo = resolveComponent('./svgs/graph-curve-2')
const GraphCurveThree = resolveComponent('./svgs/graph-curve-3')
const GraphCurveFour = resolveComponent('./svgs/graph-curve-4')
const GraphCurveFive = resolveComponent('./svgs/graph-curve-5')

// ======================================================================= Props
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

// ======================================================================== Data
const graphs = {
  'onboarding_trend': {
    captionAfter: 'Data onboarding trend',
    axis: false,
    legend: false,
    height: 105,
    curves: [
      {
        name: '',
        color: '#DCE76E',
        svg: 1
      }
    ]
  },
  'tib_onboarded': {
    captionBefore: 'Total TiB onboarded',
    axis: true,
    legend: true,
    height: 185,
    curves: [
      {
        name: 'Cumulative',
        color: '#3F3CF6',
        svg: 2
      },
      {
        name: 'Daily',
        color: '#DCE76E',
        svg: 1
      }
    ]
  },
  'cumulative_data': {
    captionBefore: 'Cumulative data onboarded',
    axis: false,
    legend: false,
    height: 162,
    curves: [
      {
        name: '',
        color: '#DCE76E',
        svg: 3
      }
    ]
  },
  'active_sps': {
    captionBefore: 'Daily and weekly active SPs',
    axis: false,
    legend: true,
    height: 150,
    curves: [
      {
        name: 'Daily active SPs',
        color: '#3F3CF6',
        svg: 5
      },
      {
        name: 'Weekly active SPs',
        color: '#DCE76E',
        svg: 4
      }
    ]
  }
}
// ==================================================================== Computed
const graph = computed(() => graphs[props.block.graph])

// ===================================================================== Methods
const getSvgCurve = (svg) => {
  switch (svg) {
    case 1: return GraphCurveOne
    case 2: return GraphCurveTwo
    case 3: return GraphCurveThree
    case 4: return GraphCurveFour
    case 5: return GraphCurveFive
    default: return false
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.graph-card {
  background-color: $blackPearl;
  border-radius: toRem(10);
  padding: toRem(23) toRem(20);
  color: white;
  @include mini {
    padding: toRem(17) toRem(12);
  }
  &.tib_onboarded {
    .curve-1 {
      :deep(svg) {
        transform: translateY(1.5rem);
        @include mini {
          transform: translateY(1rem);
        }
      }
    }
  }
  span {
    display: block;
    font-family: $fontSuisseIntl;
    font-size: toRem(14);
    line-height: leading(20, 14);
    @include mini {
      font-size: toRem(8.5);
    }
  }
}

.graph {
  display: flex;
  justify-content: space-between;
  margin-bottom: toRem(18);
  @include mini {
    height: unset !important;
  }
}

.caption {
  font-family: $fontSuisseIntl;
  font-size: toRem(16);
  font-weight: 500;
  line-height: leading(22, 16);
  margin: toRem(5) 0;
  padding: 0 toRem(7);
  @include mini {
    font-size: toRem(10);
  }
  &.before {
    @include mini {
      margin-top: 0;
    }
  }
}

.y-axis {
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  width: fit-content;
  height: 100%;
  padding-right: toRem(6);
  @include mini {
    height: unset;
    align-self: stretch;
  }
}

.curves {
  position: relative;
  flex-grow: 1;
  height: 100%;
}

.curve {
  --curve-stroke-color: #3F3CF6;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @include mini {
    max-height: toRem(100);
  }
  &.curve-1 {
    position: relative;
    margin-top: auto;
    @include mini {
      max-width: toRem(134);
    }
  }
  &:not(.curve-1) {
    :deep(svg) {
      width: 100%;
    }
  }
  :deep(svg) {
    height: 100%;
    @include mini {
      width: 100%;
      height: unset;
    }
    path {
      stroke: var(--curve-stroke-color);
    }
  }
}

.legend-item {
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: toRem(11);
  }
}

.color-block {
  width: toRem(12.5);
  height: toRem(12.5);
  border-radius: toRem(3.5);
  margin-right: toRem(13);
}
</style>