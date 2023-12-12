<template>
  <footer id="site-footer">
    <div class="grid">
      <div class="col-10" data-push-left="off-2">

        <div class="footer-contents">
          <div class="grid-noGutter full">

            <div class="col-8">
              <section class="section-support">

                <div class="heading">
                  {{ support.heading }}
                </div>

                <div class="description">
                  {{ support.description }}
                </div>

                <div class="cta">
                  <ButtonCta
                    :tag="support.cta.tag"
                    :target="support.cta.target"
                    :to="support.cta.url">
                    {{ support.cta.text }}
                  </ButtonCta>
                </div>

              </section>
            </div>

            <div class="col-4">
              <section class="section-help">

                <div class="heading">
                  {{ help.heading }}
                </div>

                <div class="links-column">
                  <ButtonCta
                    v-for="link in help.links"
                    :key="link.text"
                    :tag="link.tag"
                    :target="link.target"
                    :to="link.url"
                    class="help-link">
                    {{ link.text }}
                  </ButtonCta>
                </div>

              </section>
            </div>

            <div class="col-12">
              <section class="section-legal">

                <div class="heading">
                  {{ legal.heading }}
                </div>

                <div class="links-row">
                  <ButtonCta
                    v-for="link in legal.links"
                    :key="link.text"
                    :tag="link.tag"
                    :target="link.target"
                    :to="link.url"
                    class="legal-link">
                    {{ link.text }}
                  </ButtonCta>
                </div>

              </section>
            </div>

          </div>
        </div>

      </div>
    </div>
  </footer>
</template>

<script setup>
// ======================================================================== Data
const route = useRoute()
const routeLang = computed(() => route.params.language)

const { data: Footer } = await useAsyncData( 'footer', async () => {
    const content = await queryContent({
      where: {
        _file: { $contains: `data/${routeLang.value}/footer.json` }
      }
    }).find()
    return content[0]
}, { watch: [routeLang] } )

// ==================================================================== Computed
const support = computed(() => Footer.value.panel_left)
const help = computed(() => Footer.value.panel_right)
const legal = computed(() => Footer.value.panel_bottom)

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-footer {
  background-color: var(--background-color);
  transition: background-color 500ms;
}

.full {
  padding: 0 !important;
}

section {
  padding-bottom: toRem(30);
}

.footer-contents,
.section-legal {
  padding-top: toRem(30);
  border-top: solid 0.125rem var(--background-color__secondary);
  transition: border-color 500ms;
}

.section-support {
  padding-right: toRem(52);
}

.heading {
  @include h2;
  margin-bottom: toRem(19);
  transition: color 500ms;
}

.description {
  margin-bottom: toRem(28);
  transition: color 500ms;
}

.links-column,
.links-row {
  display: flex;
}

.links-column {
  flex-direction: column;
}

.help-link {
  position: relative;
  margin-left: toRem(13);
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: toRem(-13);
    transform: translateY(-50%);
    border-radius: 50%;
    width: toRem(5);
    height: toRem(5);
    background-color: var(--link-color);
    transition: background-color 500ms;
    &:hover {
      background-color: var(--link-hover-color);
    }
  }
}

.section-legal {
  .heading {
    @include h3;
    margin-top: 0;
    margin-bottom: toRem(9);
  }
  .legal-link {
    &:not(:last-child) {
      margin-right: toRem(28);
    }
  }
}
</style>
