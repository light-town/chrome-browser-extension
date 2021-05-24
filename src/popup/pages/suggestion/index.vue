<template>
  <default-page-layout>
    <template #body>
      <item-model />
    </template>
  </default-page-layout>
</template>

<script lang="ts">
import Vue from "vue";
import DefaultPageLayout from "~/popup/layouts/default.vue";
import ItemModel from "~/popup/components/item-model/index.vue";

export default Vue.extend({
  name: "ItemPage",
  components: {
    DefaultPageLayout,
    ItemModel,
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
