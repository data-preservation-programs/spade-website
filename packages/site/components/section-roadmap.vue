<template>
  <div class="roadmap">

    <div class="roadmap-heading">
      <h2 class="text">
        {{ block.heading }}
      </h2>
    </div>

    <div class="roadmap-sections">
      <div
        v-for="(month, i) in roadmap"
        :key="`roadmap-section-${i}`"
        class="section">

        <div class="section-heading">
          <div class="text">
            {{ moment(month.eta).format('MMMM YYYY') }}
          </div>
        </div>

        <div class="section-milestones">

          <div v-if="month.description" class="description">
            {{ month.description }}
          </div>

          <div class="milestones">
            <div
              v-for="item in month.milestones"
              :key="item"
              class="milestone">
              {{ item.title }}
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
// ===================================================================== Imports
import { storeToRefs } from 'pinia';
import { useGeneralStore } from '../stores/general.js'
import moment from 'moment'

// ======================================================================= Props
const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

// ======================================================================== Data
const generalStore = useGeneralStore()
const { siteContent } = storeToRefs(generalStore)

// ==================================================================== Computed
const sections = computed(() => props.block.sections)
const roadmap = computed(() => {
  const items = [].concat(sections.value)
  if (siteContent.value?.roadmap) {
    const keys = Object.keys(siteContent.value.roadmap)
    keys.forEach((key) => {
      const milestones = siteContent.value.roadmap[key]
      const month = sections.value.find(section => section.eta === key) || { milestones: [] }
      items.push({ eta: key, milestones: milestones.concat(month.milestones) })
    })
  }
  return items
    .sort((a, b) => moment(a.eta).valueOf() - moment(b.eta).valueOf())
    .filter((month) => moment(month.eta).isBefore(moment().add(1, 'years')))
})

</script>

<style lang="scss" scoped>
.roadmap {
  color: white;
}

.roadmap-heading {
  margin-bottom: toRem(137);
  @include small {
    margin-bottom: toRem(36);
  }
  .text {
    font-family: $fontSora;
    font-size: toRem(60);
    font-weight: 400;
    line-height: leading(80, 60);
    letter-spacing: 0.6px;
    @include small {
      font-size: toRem(28);
      line-height: leading(42, 28);
      letter-spacing: 0.28px;
    }
  }
}

.section {
  display: flex;
  padding-bottom: toRem(67);
  @include small {
    flex-direction: column;
  }
}

.section-heading {
  margin-top: toRem(13);
  width: 20%;
  @include small {
    width: 100%;
    margin-bottom: toRem(28);
  }
  .text {
    position: relative;
    width: fit-content;
    white-space: nowrap;
    font-family: $fontSora;
    font-size: toRem(24);
    font-weight: 600;
    line-height: leading(32, 24);
    @include small {
      font-size: toRem(13);
      line-height: leading(17.5, 13);
    }
    &:after {
      content: '';
      position: absolute;
      top: 100%;
      width: 100%;
      left: 0;
      height: toRem(16);
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: left;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='145' height='16' viewBox='0 0 145 16' fill='none'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M144.447 2.46526C144.908 1.85744 144.474 0.984375 143.711 0.984375H0V4.72929C0 5.75767 0.840363 6.58778 1.86867 6.57515L137.712 4.90741C138.115 4.90247 138.33 5.37912 138.061 5.67799L132.326 12.0355C131.814 12.6031 131.705 13.4275 132.052 14.1088L132.145 14.2932C132.763 15.5075 134.438 15.6574 135.261 14.5721L144.447 2.46526Z' fill='%23E8FF5A'/%3e%3c/svg%3e");
    }
  }
}

.section-milestones {
  width: 80%;
  @include small {
    width: 100%;
  }
}

.description,
.milestones {
  padding-left: 12.5%;
  @include small {
    padding-left: 15%;
  }
}

.milestones {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: calc(6.25% - toRem(2.5));
    width: toRem(5);
    height: calc(100% + 2rem);
    border-radius: toRem(2.5);
    background-color: white;
    background: linear-gradient(180deg, #D6D0DF 0%, rgba(214, 208, 223, 0.15) 100%);
  }
}

.description {
  position: relative;
  font-family: $fontSuisseIntl;
  font-size: toRem(18);
  font-weight: 500;
  line-height: leading(24, 18);
  margin-bottom: toRem(35);
  @include small {
    font-size: toRem(15);
    line-height: leading(22.5, 15);
    margin-bottom: toRem(9);
  }
  &:before {
    content: '';
    position: absolute;
    top: calc(50% - toRem(6));
    left: calc(6.25% - toRem(6));
    width: toRem(12);
    height: toRem(12);
    border-radius: 50%;
    background-color: white;
  }
}

.milestone {
  padding: toRem(24) toRem(40);
  font-family: $fontSuisseIntl;
  font-size: toRem(16);
  font-weight: 400;
  line-height: leading(22, 16);
  border: solid 1.5px $toreaBay;
  border-radius: toRem(8);
  @include small {
    padding: toRem(14) toRem(20);
    font-size: toRem(14);
    line-height: leading(21, 14);
    letter-spacing: 0.28px;
    border: solid 1px $toreaBay;
  }
  &:not(:last-child) {
    margin-bottom: toRem(16);
    @include small {
      margin-bottom: toRem(8);
    }
  }
}

</style>