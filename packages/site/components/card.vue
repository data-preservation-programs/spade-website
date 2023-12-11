<template>
  <div :class="['card', `theme__${card.theme}`]">

    <div v-if="card.icon" class="icon">
      <component :is="getIconComponent(card.icon)" />
    </div>
    
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
const additionIcon = resolveComponent('./icon/additions')
const keyLockIcon = resolveComponent('./icon/key-lock')
const onrampIcon = resolveComponent('./icon/onramp')

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const cta = computed(() => props.card.cta)

const getIconComponent = (icon) => {
  switch (icon) {
    case 'addition': return additionIcon
    case 'keylock': return keyLockIcon
    case 'onramp': return onrampIcon
    default: return false
  }
}
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

.card.theme__basic {
  padding: toRem(25) toRem(33);
  border-radius: toRem(8);
  background: white;
  box-shadow: 0px 30px 25px -25px rgba(72, 76, 86, 0.25);
  color: $woodsmoke;
  .icon {
    display: flex;
    margin-bottom: toRem(29);
    @include mini {
      margin-bottom: toRem(20);
    }
  }
  .title {
    @include h5;
    margin-bottom: toRem(17);
    
  }
  .description {
    @include p2;
  }
}
</style>