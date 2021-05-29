<template>
  <ui-grid direction="column">
    <slot></slot>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid } from "@light-town/ui";

export default Vue.extend({
  name: "SidebarMenu",
  components: {
    UiGrid,
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
