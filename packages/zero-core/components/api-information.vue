<template>
  <div v-if="headers || queryParameters || responseCodes" class="api-information">

    <!-- =========================================================== headers -->
    <div v-if="headers" class="headers section">
      <div class="heading">
        {{ getHeading('headers', headers) }}
      </div>
      <template v-for="(header, key) in props.headers">
        <div
          v-if="key !== '_section_heading'"
          :key="key"
          class="entry">
          <div class="metadata">
            <div class="key">
              {{ key }}
            </div>
            <div class="type">
              {{ header.type }}
            </div>
          </div>
          <ZeroMarkdownParser
            v-if="header.description"
            :markdown="header.description"
            class="description" />
        </div>
      </template>
    </div>

    <!-- ================================================== query parameters -->
    <div v-if="queryParameters" class="query-parameters section">
      <div class="heading">
        {{ getHeading('query_parameters', queryParameters) }}
      </div>
      <template v-for="(parameter, key) in props.queryParameters">
        <div
          v-if="key !== '_section_heading'"
          :key="key"
          class="entry">
          <div class="metadata">
            <div class="key">
              {{ key }}
            </div>
            <div class="type">
              {{ parameter.type }}
            </div>
          </div>
          <ZeroMarkdownParser
            v-if="parameter.description"
            :markdown="parameter.description"
            class="description" />
        </div>
      </template>
    </div>

    <!-- ==================================================== response codes -->
    <div v-if="responseCodes" class="response-codes section">
      <div class="heading">
        {{ getHeading('response_codes', responseCodes) }}
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Status Code</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(description, code) in props.responseCodes">
            <tr
              v-if="code !== '_section_heading'"
              :key="code">
              <td>
                <div class="http-code">
                  {{ code }}
                </div>
              </td>
              <td>
                <ZeroMarkdownParser
                  v-if="description"
                  :markdown="description"
                  class="description" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
// ======================================================================= Props
const props = defineProps({
  headers: {
    type: Object,
    required: false,
    default: undefined
  },
  queryParameters: {
    type: Object,
    required: false,
    default: undefined
  },
  responseCodes: {
    type: Object,
    required: false,
    default: undefined
  }
})

// ==================================================================== Headings
/**
 * @method getHeading
 */

const getHeading = (key, section) => {
  const map = {
    headers: "Headers",
    query_parameters: "Query Parameters",
    response_codes: "HTTP Response Status Codes"
  }
  return section._section_heading || map[key]
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.api-information {
  margin-top: 3rem;
}

.section {
  &:not(:first-child) {
    margin-top: 3rem;
  }
}

.heading {
  @include h4;
  margin-bottom: toRem(4);
  padding-bottom: toRem(4);
  border-bottom: 1px solid var(--divider);
  transition: color 500ms, border-color 500ms;
}

.entry {
  margin-bottom: 1rem;
  padding-top: 1rem;
  transition: border-color 500ms;
  &:not(:nth-child(2)) {
    border-top: 1px solid var(--divider);
  }
}

.metadata {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.key {
  @include inlineCode;
  line-height: 1;
  font-weight: 700;
  margin-right: 0.5rem;
  transition: color 500ms, background-color 500ms;
}

.type {
  font-weight: 500;
  transition: color 500ms;
}

:deep(.description) {
  margin-top: 0.5rem;
  p {
    margin-bottom: 0;
    &:not(:last-child) {
      margin-bottom: 0.25rem;
    }
  }
}

table {
  width: 100%;
}

tbody {
  tr {
    border-top: 1px solid var(--divider);
    transition: border-color 500ms;
  }
}

.http-code,
th {
  transition: color 500ms;
}

th {
  text-align: left;
  padding-top: 1.5rem;
  padding-bottom: toRem(8);
  &:first-child {
    padding-right: 3rem;
  }
}

td {
  padding: toRem(4) 0;
  &:first-child {
    font-weight: 500;
  }
  .markdown {
    margin-top: 0;
  }
}
</style>
