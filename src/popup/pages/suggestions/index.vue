<template>
  <default-page-layout />
</template>

<script lang="ts">
import Vue from "vue";
import DefaultPageLayout from "~/popup/layouts/default.vue";

export default Vue.extend({
  name: "SuggestionPage",
  components: {
    DefaultPageLayout,
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
