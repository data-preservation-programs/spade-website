<template>
  <ZeroFormField
    v-slot="{ field, fieldId, fieldType, state, required, disabled, validationMessage, updateValue, toggleState }"
    v-bind="props"
    :class="['field-container', { focused }]">

    <label v-if="scaffold.label" :for="fieldId" :class="['field-label', state]">
      <div class="panel-left">
        <IconInProgress class="icon in-progress" />
        <IconComplete class="icon completed" />
        <IconError class="icon error" />
        <span class="text">
          {{ scaffold.label }}
          <sup v-if="required" class="required">*</sup>
        </span>
      </div>
    </label>

    <div v-if="scaffold.description" class="description">
      {{ scaffold.description }}
    </div>

    <component
      :is="`Form${fieldType}`"
      :field="field"
      :form-scaffold="formScaffold"
      :disabled="disabled"
      @update-value="updateValue"
      @toggle-focused="handleFocus($event, toggleState)" />

    <!-- <Array
      v-else
      v-slot="{ groups, addGroup, removeGroup }"
      :field="field"
      :form-scaffold="formScaffold"
      :disabled="disabled">

      <div
        v-for="(group, groupIndex) in groups"
        :key="group.id"
        class="group">

        <FieldContainer
          v-for="(fieldScaffold, index) in group.scaffolds"
          :key="`${group.id}|${index}`"
          :scaffold="fieldScaffold" />

        <ButtonX
          class="trash-button"
          @clicked="removeGroup(groupIndex)">
          <IconTrash class="icon-trash" />
        </ButtonX>

      </div>

      <ButtonA
        class="add-group-button"
        @clicked="addGroup()">
        Add
      </ButtonA>

    </Array> -->

    <slot />

    <div v-if="validationMessage" class="validation-message">
      {{ validationMessage }}
    </div>

  </ZeroFormField>
</template>

<script setup>
// ======================================================================= Setup
const props = defineProps({
  scaffold: {
    type: Object,
    required: true
  },
  /**
   * Used in the Array field
   */
  formScaffold: {
    type: Object,
    required: false,
    default: () => {}
  },
  forceDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  forceValidate: {
    type: Boolean,
    required: false,
    default: true
  },
  /**
   * On occasions where the final root element in field-conditional.vue render
   * must be something specific. Such as when wrapping a <tbody> in a field-standalone,
   * it cannot be a div as the wrapper. It must be <tbody> at the root to prevent
   * SSR hydration errors.
   */
  rootHtmlTag: {
    type: String,
    required: false,
    default: 'div'
  }
})

// ======================================================================== Data
const focused = ref(false)

// ===================================================================== Methods
const handleFocus = (state, toggleState) => {
  focused.value = state
  toggleState(state)
}
</script>

<style lang="scss" scoped>
@keyframes grow {
  0% { transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

// ///////////////////////////////////////////////////////////////////// General
.field-container {
  &:hover,
  &:focus-within {
    .tooltip {
      &:before,
      &:after,
      .icon {
        transition: 150ms ease-in;
        opacity: 1;
      }
      &:before {
        transform: translate(0, -50%) rotate(-90deg);
      }
      &:after {
        transform: translate(0, -50%);
      }
      .icon {
        transform: scale(1);
      }
    }
  }
  &.disabled {
    .field-label {
      cursor: default;
    }
  }
}

:deep(.field) {
  position: relative;
  font-weight: 500;
}

:deep(.description) {
  margin-top: 0.5rem;
  line-height: leading(30, 18);
  margin-bottom: 2.25rem;
}

// ////////////////////////////////////////////////////////////////////// Arrays
.array {
  display: flex;
  flex-direction: column;
}

.group {
  display: flex;
  flex-direction: row;
  .field {
    flex: 1;
      margin-bottom: 2rem;
    &:not(:last-child) {
      margin-right: 2rem;
    }
  }
}

.add-group-button {
  margin-left: auto;
}

.icon-trash {
  width: 1.5rem;
}

// /////////////////////////////////////////////////////////////////////// Label
.field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(18);
  font-size: toRem(18);
  line-height: 1;
  cursor: pointer;
  .text {
    font-weight: 500;
    transform-origin: left;
    transition: 150ms ease-out;
  }
  .required {
    color: #FF0000;
    font-size: toRem(20);
    top: 0;
  }
  &.in-progress {
    .icon.in-progress {
      display: block;
    }
  }
  &.completed {
    .icon.completed {
      display: block;
    }
  }
  &.error {
    .icon.error {
      display: block;
    }
  }
}

.panel-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.icon {
  display: none;
  margin-right: toRem(11);
  &.question-mark {
    display: block;
  }
}

// ////////////////////////////////////////////////////////////////// Validation
:deep(.validation-message) {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: red;
  font-style: italic;
  sup {
    top: -0.125rem;
    margin-right: 0.0625rem;
    font-size: 100%;
  }
}
</style>
