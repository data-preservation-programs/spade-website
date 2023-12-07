<template>
  <div :class="['card', `theme__${card.theme}`]">
    
    <div class="title">
      {{ card.title }}
    </div>

    <div class="description">
      {{ card.description }}
    </div>

    <div v-if="cta" class="cta">
      <ButtonCta
        :to="cta.to"
        :tag="cta.tag"
        :target="cta.target">
        {{ cta.text }}
      </ButtonCta>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const cta = computed(() => props.card.cta)
</script>

<style lang="scss" scoped>
.card {
  color: $perano;
}

.description {
  font-family: $fontSuisseIntl;
  font-size: toRem(16);
  font-weight: 400;
  line-height: leading(27, 16);
  letter-spacing: 0.48px;
  @include medium {
    font-size: toRem(14);
  }
}

.card.theme__big-number {
  .title {
    @include h2;
    color: $cornflowerBlue;
    text-align: center;
    white-space: nowrap;
    @include large {
      font-size: toRem(32);
    }
    @include medium {
      font-size: toRem(26);
      margin-top: toRem(18);
    }
    @include mini {
      font-size: toRem(24);
      line-height: leading(47, 24);
    }
  }
  .description {
    text-align: center;
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    line-height: leading(24, 16);
    letter-spacing: 0.48px;
    color: white;
    @include medium {
      font-size: toRem(14);
    }
    @include mini {
      font-size: toRem(11);
      letter-spacing: 0.03em;
    }
  }
}
</style>