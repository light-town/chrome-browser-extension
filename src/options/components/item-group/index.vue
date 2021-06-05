<template>
  <ui-grid direction="column" class="item-group">
    <p class="item-group__title">{{ title }}</p>
    <ui-grid class="item-group__items" direction="column">
      <slot></slot>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid } from "@light-town/ui";

export default Vue.extend({
  name: "ItemGroups",
  components: {
    UiGrid,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
