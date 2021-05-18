<template>
  <default-page-layout>
    <template #body>
      <ui-grid direction="column" class="p-5">
        <ui-grid>
          <ui-avatar name="Google" :size="64" class="item-page-body__header" />
          <ui-grid direction="column">
            <p>{{ item }}</p>
          </ui-grid>
        </ui-grid>
        <ui-grid direction="column"> </ui-grid>
      </ui-grid>
    </template>
  </default-page-layout>
</template>

<script>
import { UiGrid, UiAvatar } from "@light-town/ui";
import DefaultPageLayout from "~/popup/layouts/default.vue";

export default {
  name: "ItemPage",
  components: {
    UiGrid,
    UiAvatar,
    DefaultPageLayout,
  },
  computed: {
    currentVaultUuid() {
      return this.$route.params.itemUuid;
    },
  },
};
</script>

<style lang="scss" src="./index.scss"></style>
