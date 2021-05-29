<template>
  <template-item-field :value="value" v-bind="$attrs" v-on="$listeners">
    <template #tools-template>
      <ui-button
        variant="text"
        class="item-field__tool-btn"
        @click="openAndFill"
      >
        {{ $t("Open & Fill") }}
      </ui-button>
      <ui-button
        variant="text"
        class="item-field__tool-btn"
        @click.native="copyValue"
      >
        {{ $t("Copy") }}
      </ui-button>
    </template>
  </template-item-field>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiButton } from "@light-town/ui";
import TemplateItemField from "../template/index.vue";
import openAndFillHelper from "../../item-model/helpers/open-and-fill.helper";

export default Vue.extend({
  name: "UrlItemField",
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
    openAndFill() {
      this.$emit("open-and-fill");
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
