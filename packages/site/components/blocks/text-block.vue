<template>
  <div
    :class="['block text-block', `align__${block.align ? block.align : 'left'}`, `theme__${block.theme}`]">

    <h5 v-if="block.label" class="label h5" v-html="block.label"></h5>

    <template v-if="block.heading">
      <component
        :is="block.h ? `h${block.h}` : 'h2'"
        :class="['heading', { 'heading-image': block.img }]">
        <img v-if="block.img" :src="block.img" />
        <span
          :class="block.h ? `h${block.h}` : 'h2'"
          v-html="block.heading">
        </span>
      </component>
    </template>

    <div class="text-wrapper">
      <div v-if="block.description" class="description">
        <ZeroMarkdownParser :markdown="block.description" />
      </div>
    </div>

    <div v-if="block.ctas" class="button-row">
      <template v-if="ctaData">
        <ButtonCta
          v-for="(cta, index) in ctaData"
          :key="index"
          :tag="cta.tag"
          :to="cta.to"
          :theme="cta.theme"
          :target="cta.target"
          :variant="ctaVariant || cta.variant"
          :disabled="cta.disabled">
          {{ cta.text }}
          <span
            v-if="cta.caption"
            class="caption">
            {{ cta.caption }}
          </span>
        </ButtonCta>
      </template>
    </div>
  </div>
</template>

<script>
// import Button from '@/components/button'

export default {
  name: 'TextBlock',

  props: {
    block: {
      /**
       * align: String (left, right, center)
       * label: String
       * heading: String
       * description: String
       * ctas: [{Button}]
       */
      type: Object,
      required: true
    }
  },

  data () {
    return {
      resize: false,
      ctaVariant: false
    }
  },

  computed: {
    ctaData () {
      if (this.block.ctas && Array.isArray(this.block.ctas)) {
        return this.block.ctas.map((object) => {
          return { ...object, disabled: object.to === undefined || object.to === '' }
        })
      }
      return false
    }
  },

  mounted () {
    if (this.ctaData && this.ctaData.some(cta => cta.theme === 'primary' && cta.variant !== 'large')) {
      this.resizeCta()
      this.resize = () => { this.resizeCta() }
      window.addEventListener('resize', this.resize )
    }
  },

  beforeUnmount () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    resizeCta () {
      if (window.matchMedia('(max-width: 40rem)').matches) {
        if (!this.ctaVariant) { this.ctaVariant = 'small' }
      } else if (this.ctaVariant) {
        this.ctaVariant = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.text-block {
  position: relative;
  &.align__center {
    text-align: center;
    .label,
    .button-row {
      display: flex;
      justify-content: center;
    }
  }
  &.align__right {
    text-align: right;
    .label,
    .button-row {
      justify-content: flex-end;
    }
  }
  > * {
    margin-bottom: toRem(30);
    position: relative;
  }
}

.button-row {
  margin-bottom: 0;
  .button:first-child {
    margin-right: toRem(35);
  }
  .button:only-child {
    margin-right: 0;
  }
}

.button-row {
  :deep(.button) {
    &.theme__primary {
      @include mini {
        height: toRem(33);
      }
      .inner-content {
        @include mini {
          height: toRem(33);
          padding: toRem(8) toRem(28) toRem(8) toRem(10);
        }
      }
      .detail-wrapper {
        @include mini {
          left: toRem(-19);
          width: calc(100% + toRem(19) - toRem(2));
        }
      }
    }
  }
}

.h1 {
  @include h1;
  @include gradientText(110deg);
  @include medium {
    font-size: toRem(40);
  }
  @include small {
    font-size: toRem(30);
    line-height: leading(44, 30);
    background: linear-gradient(130deg, $zircon 6.23%, $whiteLilac 28.53%, $royalBlue 85.09%);
    @include gradientTextBase;
  }
}

// ///////////////////////////////////////////////////////////////////// Theming
.theme__hero-header {
  .label {
    display: flex;
    align-items: center;
    padding: toRem(4) toRem(5);
    background-color: #181D2A;
    width: fit-content;
    height: toRem(40);
    border-radius: toRem(30);
    margin-bottom: toRem(35);
    @include small {
      margin-bottom: toRem(22);
      background-color: #0A1844;
    }
    :deep(span) {
      display: inline-block;
      white-space: nowrap;
      text-align: center;
      font-family: $fontSuisseIntl;
      font-size: toRem(14);
      line-height: leading(27, 14);
      letter-spacing: 0.28px;
      color: white;
      @include small {
        font-size: toRem(13);
        line-height: leading(27, 13);
      }
      &:first-child {
        padding: toRem(4) toRem(22);
        font-weight: 500;
        border-radius: toRem(26);
        @include gradientBlueBlue(100deg);
        @include small {
          background: transparent;
          color: $canary;
          padding: toRem(2) 0 toRem(2) toRem(22);
        }
      }
      &:last-child {
        font-weight: 400;
        margin: 0 toRem(22);
        @include small {
          margin:0 toRem(10) 0 toRem(22);
        }
      }
    }
  }
  .heading {
    margin-bottom: toRem(25);
    @include small {
      margin-bottom: toRem(19);
    }
  }
  .text-wrapper {
    margin-bottom: 0;
    @include small {
      margin-bottom: toRem(25);
    }
  }
  .description {
    font-family: Suisse Intl;
    font-size: toRem(18);
    font-weight: 600;
    line-height: leading(30, 18);
    letter-spacing: 0.54px;
    color: $perano;
    :deep(.highlight) {
      font-weight: 700;
      color: white;
    }
  }
  .button-row {
    margin-bottom: toRem(25);
    :deep(.button) {
      display: block;
      width: fit-content;
    }
  }
}

.theme__info {
  .label {
    @include h6;
    opacity: 0.6;
    margin-bottom: toRem(23);
  }
  .heading {
    margin-bottom: toRem(24);
    @include small {
      margin-bottom: toRem(14);
    }
  }
  .description {
    margin-bottom: toRem(32);
    @include small {
      margin-bottom: toRem(26);
    }
  }
  .button-row {
    :deep(.button) {
      display: block;
      width: fit-content;
    }
  }
}
</style>

