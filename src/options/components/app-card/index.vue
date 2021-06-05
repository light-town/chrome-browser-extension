<template>
  <ui-grid
    class="app-card"
    direction="column"
    align-items="center"
    justify="center"
  >
    <ui-grid class="app-card__logo" direction="column" align-items="center">
      <logo-icon class="app-card__logo-icon" />
      <p class="app-card__logo-title">LightTown</p>
    </ui-grid>
    <p class="app-card__version">{{ $t("version") }} {{ version }}</p>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid } from "@light-town/ui";
/// @ts-ignore
import LogoIcon from "~/assets/logo.svg";
import { version } from "~/manifest.json";

export default Vue.extend({
  name: "AppCard",
  components: {
    UiGrid,
    LogoIcon,
  },
  data() {
    return {
      version,
    };
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
