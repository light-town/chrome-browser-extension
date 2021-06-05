<template>
  <ui-grid align-items="center" justify="space-between" class="item">
    <p class="item__title">{{ title }}</p>
    <slot></slot>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiToggle } from "@light-town/ui";

export default Vue.extend({
  name: "DefaultItem",
  components: {
    UiGrid,
    UiToggle,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
