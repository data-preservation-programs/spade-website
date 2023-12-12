<template>
  <div :class="['card', `theme__${card.theme}`]">

    <div
      v-if="card.backgroundImage"
      class="background-image"
      :style="{ 'background-image': `url(${card.backgroundImage})` }">
    </div>

    <div v-if="card.icon" class="icon">
      <component :is="getIconComponent(card.icon)" />
    </div>

    <div v-if="card.title" class="title">
      {{ card.title }}
    </div>

    <div v-if="card.description" class="description">
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
// ====================================================================== Import
const additionIcon = resolveComponent('./icon/additions')
const keyLockIcon = resolveComponent('./icon/key-lock')
const onrampIcon = resolveComponent('./icon/onramp')
const brokerIcon = resolveComponent('./icon/broker')
const documentIcon = resolveComponent('./icon/document')
const heartIcon = resolveComponent('./icon/heart')
const idIcon = resolveComponent('./icon/id')
const oracleIcon = resolveComponent('./icon/oracle')
const tenantIcon = resolveComponent('./icon/tenant')
const openSourceIcon = resolveComponent('./icon/open-source')
const spIcon = resolveComponent('./icon/sp')
const stackIcon = resolveComponent('./icon/stack')

// ======================================================================= Props
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})
// ==================================================================== Computed
const cta = computed(() => props.card.cta)

// ===================================================================== Methods
const getIconComponent = (icon) => {
  switch (icon) {
    case 'addition': return additionIcon
    case 'keylock': return keyLockIcon
    case 'onramp': return onrampIcon
    case 'broker': return brokerIcon
    case 'document': return documentIcon
    case 'heart': return heartIcon
    case 'id': return idIcon
    case 'oracle': return oracleIcon
    case 'tenant': return tenantIcon
    case 'open-source': return openSourceIcon
    case 'sp': return spIcon
    case 'stack': return stackIcon
    default: return false
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
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

.background-image {
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

// ///////////////////////////////////////////////////////// Theme [Big Numbers]
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

// /////////////////////////////////////////////////////////////// Theme [Basic]
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

// /////////////////////////////////////////////////////////////// Theme [Image]
.card.theme__image {
  height: 100%;
  border-radius: toRem(20);
  overflow: hidden;
  min-height: toRem(321);
  @include mini {
    margin: 0 -0.25rem;
    min-height: toRem(212);
    border-radius: toRem(10);
  }
}

// /////////////////////////////////////////////////////////////// Theme [Block]
.card.theme__block {
  padding: toRem(30) toRem(24);
  display: flex;
  flex-direction: column;
  border-radius: toRem(20);
  background: white;
  color: $woodsmoke;
  min-height: toRem(321);
  @include mini {
    margin: 0 -0.25rem;
    padding: toRem(15) toRem(10);
    min-height: toRem(212);
    border-radius: toRem(10);
  }
  .icon {
    display: flex;
    margin-bottom: auto;
    @include mini {
      width: toRem(30);
      height: toRem(30);
      margin-bottom: toRem(30);
      :deep(svg) {
        width: 100%;
        height: 100%;
      }
    }
  }
  .title {
    font-family: $fontSora;
    font-size: toRem(22);
    font-weight: 600;
    line-height: leading(31, 22);
    margin-bottom: toRem(12);
    @include mini {
      font-size: toRem(16);
      line-height: leading(22, 16);
    }
  }
  .description {
    font-family: $fontSuisseIntl;
    font-size: toRem(16);
    line-height: leading(24, 16);
    letter-spacing: 0.32px;
    @include mini {
      font-size: toRem(13);
      line-height: leading(19.5, 13);
      margin-bottom: 0.5rem;
    }
  }
}
</style>