<template>
  <div class="card-list-block">
    <div :class="[grid, 'no-padding']">
      <div
        v-for="(card, i) in cards"
        :key="`card-col-${i}`"
        :class="[card.col || columns, 'card-wrapper']">

        <GraphCard v-if="card.type === 'graph'" :block="card" />

        <ResponsiveClipper
          v-if="card.type === 'clip'"
          :display-guides="false"
          :breakpoints-x="card.clipPath === 1 ? [140, 310] : [140, 500]"
          :breakpoints-y="[70, 230]">
          <template #svg-path>
            <ClippedCardPathOne v-if="card.clipPath === 1" />
            <ClippedCardPathTwo v-if="card.clipPath === 2" />
          </template>
          <template #clipped-content>
            <Card :card="card" :class="[`clip-type-${card.clipPath}`]" />
          </template>
        </ResponsiveClipper>

        <Card v-if="card.type !== 'graph' && card.type !== 'clip'" :card="card" />

      </div>
    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import Card from '@/components/card'
import GraphCard from '@/components/graph-card'
import ResponsiveClipper from '@/components/responsive-clipper'
import ClippedCardPathTwo from '@/components/svgs/clipped-card-path-2'
import ClippedCardPathOne from '@/components/svgs/clipped-card-path-1'

// ====================================================================== Export
export default {
  name: 'CardListBlock',

  components: {
    Card,
    GraphCard,
    ResponsiveClipper,
    ClippedCardPathOne,
    ClippedCardPathTwo
  },

  props: {
    block: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    cards () {
      // const sortKey = this.block.sort_key
      // if (this.block.alphabetize && sortKey) {
      //   return [...this.block.cards].sort((a, b) => {
      //     if (a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) { return -1 }
      //     if (a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) { return 1 }
      //     return 0
      //   })
      // }
      return this.block.cards
    },
    grid () {
      return Array.isArray(this.block.card_grid) ? `grid-${this.block.card_grid.join('-')}` : 'grid'
    },
    columns () {
      return this.block.card_columns
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.card-list-block {
  position: relative;
  [class~="grid"], [class*="grid-"], [class*="grid_"] {
    width: 100% !important;
  }
}

.clip-type-1 {
  padding-bottom: toRem(40) !important;
  @include mini {
    padding-bottom: toRem(25) !important;
  }
}
</style>
