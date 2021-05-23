<template>
  <ui-grid direction="column" class="h-full">
    <search-bar />
    <ui-grid align-items="center" class="h-full overflow-auto">
      <list-bar />
      <ui-grid direction="column" class="default-page-layout__body">
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
#app[data-theme-mode="light"] {
  --color-default-page-layout-body-bg: var(--color-gray-75);
}

.default-page-layout__body {
  background-color: var(--color-default-page-layout-body-bg);

  height: 100%;

  overflow: auto;
}
</style>
