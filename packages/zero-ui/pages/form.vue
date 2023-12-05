<template>
  <main class="page">

    <ZeroMarkdownParser :markdown="markdown" class="markdown" />

    <FormFieldContainer :scaffold="scaffold.input_type_text" />
    <FormFieldContainer :scaffold="scaffold.input_type_number_integer" />
    <FormFieldContainer :scaffold="scaffold.input_type_number_float" />
    <FormFieldContainer :scaffold="scaffold.textarea" />
    <FormFieldContainer :scaffold="scaffold.radio" />
    <FormFieldContainer :scaffold="scaffold.radio_conditional_textarea" />
    <FormFieldContainer :scaffold="scaffold.checkbox" />
    <FormFieldContainer :scaffold="scaffold.boolean" />
    <FormFieldContainer :scaffold="scaffold.datepicker_single" />
    <FormFieldContainer :scaffold="scaffold.datepicker_multiple" />
    <FormFieldContainer :scaffold="scaffold.datepicker_single_withTime" />
    <FormFieldContainer :scaffold="scaffold.datepicker_multiple_withTime" />
    <FormFieldContainer :scaffold="scaffold.datepicker_range" />
    <FormFieldContainer :scaffold="scaffold.datepicker_range_withTime" />
    <FormFieldContainer :scaffold="scaffold.select" />

  </main>
</template>

<script setup>
// ======================================================================== Data
const { data: content } = await useAsyncData('content', () => {
  return queryContent({
    where: {
      _path: { $contains: '/zero-ui/form' }
    }
  }).find()
})

const markdown = content.value.find(item => item._extension === 'md').raw
const scaffold = content.value.find(item => item._extension === 'json')
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.markdown {
  width: 100%;
}

:deep(.field-container) {
  &:not(:last-child) {
    margin-bottom: 3rem;
  }
}
</style>
