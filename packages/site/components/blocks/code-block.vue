<template>
  <div class="code-block">
    <div class="code-list">
      <ul>
        <li
          v-for="(line, n) in lines"
          :key="`line-${n}`"
          :class="['code-line', { 'heading': n === 0 }]">
          <span class="code id">{{ n === 0 ? 'ID' : n }}</span>
          <span class="code type">{{ line.type }}</span>
          <span class="code path">{{ line.path }}</span>
          <span class="code scan-state">{{ line.scanState }}</span>
          <span class="code dag-state">{{ line.dagState }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// ======================================================================= Props
// eslint-disable-next-line
const props = defineProps({
  block: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// ==================================================================== Computed
const lines = computed(() => {
  return Array.isArray(props.block.lines) ? props.block.lines : []
})

</script>

<style lang="scss" scoped>
.code-block {
  position: relative;
}

.code-list {
  padding: toRem(24);
  background-color: unset;
  border-radius: toRem(6);
  @include mini {
    padding: toRem(7) toRem(13);
  }
}

.code-line {
  display: flex;
  justify-content: space-between;
  @include inlineCode;
  margin-bottom: 0.125rem;
  color: unset;
  @include medium {
    margin-bottom: 0;
  }
  @include mini {
    overflow: hidden;
  }
  &.heading {
    color: unset;
  }
}

.code {
  display: inline-block;
  white-space: nowrap;
  @include inlineCode;
  @include tiny {
    font-size: 0.75rem;
  }
  &.id,
  &.type {
    width: 12%;
    @include medium {
      width: 20%;
    }
    @include tiny {
      width: 13%;
    }
  }
  &.id {
    @include small {
      display: none;
    }
    @include mini {
      display: inline-block;
    }
    @include tiny {
      width: 10%;
    }
  }
  &.path {
    width: 40%;
    @include medium {
      width: 60%;
    }
    @include small {
      width: 80%;
    }
    @include mini {
      width: 60%;
    }
    @include tiny {
      width: 62%;
    }
  }
  &.scan-state {
    width: 21%;
    @include medium {
      display: none;
    }
  }
  &.dag-state {
    width: 16%;
    @include gridMaxMQ {
      display: none;
    }
  }
}
</style>
