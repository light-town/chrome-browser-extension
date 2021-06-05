<template>
  <default-item :title="title">
    <ui-toggle :value="value" @input="(val) => $emit('input', val)" />
  </default-item>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiToggle } from "@light-town/ui";
import DefaultItem from "../default/index.vue";

export default Vue.extend({
  name: "ToggleItem",
  components: {
    UiGrid,
    UiToggle,
    DefaultItem,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
