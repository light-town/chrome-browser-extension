<template>
  <default-page-layout />
</template>

<script lang="ts">
import Vue from "vue";
import DefaultPageLayout from "~/popup/layouts/default.vue";

export default Vue.extend({
  name: "ItemsPage",
  components: {
    DefaultPageLayout,
  },
});
</script>
