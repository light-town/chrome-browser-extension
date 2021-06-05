<template>
  <ui-grid direction="column" class="ui-h-full">
    <search-bar />
    <ui-grid class="ui-h-full ui-overflow-auto">
      <slot name="sidebar">
        <list-bar />
      </slot>
      <ui-grid direction="column" class="ui-h-full default-page-layout__body">
        <slot name="body"></slot>
      </ui-grid>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid } from "@light-town/ui";
import SearchBar from "~/popup/components/search-bar/index.vue";
import ListBar from "~/popup/components/list-bar/index.vue";

export default Vue.extend({
  name: "DefaultLayout",
  components: {
    UiGrid,
    SearchBar,
    ListBar,
  },
});
</script>

<style lang="scss">
$default-page-layout-body-bg: $gray-75;

.default-page-layout__body {
  @include ui-w-full;
  @include ui-overflow-auto;

  background-color: $default-page-layout-body-bg;
}
</style>
