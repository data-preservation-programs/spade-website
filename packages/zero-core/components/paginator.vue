<template>
  <div v-if="total !== 0 && totalPages !== 1" class="paginator">

    <slot name="before" />

    <template v-if="currentPage !== 0">
      <slot name="first" :increment-page="incrementPage" />
      <slot name="prev" :increment-page="incrementPage" />
      <slot name="breaker-left" />
    </template>

    <template v-for="page in pages">
      <slot
        v-if="page.display"
        name="page"
        :page="page"
        :increment-page="incrementPage" />
    </template>

    <template v-if="currentPage !== totalPages - 1">
      <slot name="breaker-right" />
      <slot name="next" :increment-page="incrementPage" />
      <slot name="last" :increment-page="incrementPage" />
    </template>

    <slot name="after" />

  </div>
</template>

<script setup>
// ================================================================ Setup & Data
const props = defineProps({
  buffer: {
    type: Number,
    required: false,
    default: 2
  },
  limit: {
    type: Number,
    required: true
  },
  offset: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['pageIncremented'])

// ==================================================================== Computed
const currentPage = computed(() => props.offset / props.limit)
const totalPages = computed(() => Math.ceil(props.total / props.limit))

const pages = computed(() => {
  const pages = totalPages.value
  const current = currentPage.value
  const buffer = props.buffer
  const compiled = []
  for (let i = 0; i < pages; i++) {
    compiled.push({
      value: i,
      display: i >= current - buffer - 1 && i <= current + buffer - 1,
      current: i === current
    })
  }
  return compiled
})

const incrementPage = (action, page) => {
  switch (action) {
    case 'first' : page = 0; break
    case 'prev' : page = currentPage.value - 1; break
    case 'next' : page = currentPage.value + 1; break
    case 'last' : page = totalPages.value - 1; break
  }
  if (currentPage.value !== page) {
    emit('pageIncremented', {
      page,
      offset: page * props.limit
    })
  }
}
</script>
