<template>
  <div class="card-list-block">
    <div :class="[grid, 'no-padding']">
      <div
        v-for="(card, i) in cards"
        :key="`card-col-${i}`"
        :class="[columns, 'card-wrapper']">

        <Card :card="card" />

      </div>
    </div>
  </div>
</template>

<script>
// ====================================================================== Import
import Card from '@/components/card'

// ====================================================================== Export
export default {
  name: 'CardListBlock',

  components: {
    Card
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

</style>
