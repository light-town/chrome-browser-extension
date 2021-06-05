<template>
  <ui-theme-provider class="app-page">
    <router-view></router-view>
  </ui-theme-provider>
</template>

<script lang="ts">
import Vue from "vue";
import { UiThemeProvider } from "@light-town/ui";

export default Vue.extend({
  name: "App",
  components: {
    UiThemeProvider,
  },
  created() {
    this.$i18n.locale = window.navigator.language;
  },
});
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

* {
  user-select: none !important;

  &:focus {
    outline-style: none !important;
  }
}

.app-page {
  width: 600px;
  height: 450px;

  @include ui-flex-fixed;
  @include ui-overflow-hidden;
}
</style>
