<template>
  <template-item-field :value="value" v-bind="$attrs" v-on="$listeners">
    <template #tools-template>
      <ui-button
        variant="text"
        class="item-field__tool-btn"
        @click.native="copyValue"
      >
        Copy
      </ui-button>
    </template>
  </template-item-field>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiButton } from "@light-town/ui";
import TemplateItemField from "../template/index.vue";

export default Vue.extend({
  name: "TextItemField",
  components: {
    UiGrid,
    UiButton,
    TemplateItemField,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyValue() {
      navigator.clipboard.writeText(this.value);
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
