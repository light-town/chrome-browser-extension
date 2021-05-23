<template>
  <ui-grid align-items="center" justify="space-between" class="search-bar">
    <ui-grid align-items="center">
      <loupe-icon class="search-bar__input-icon" />
      <ui-input placeholder="Search passwords" class="search-bar__input" />
    </ui-grid>
    <ui-grid align-items="center" class="search-bar__tools">
      <ui-button variant="text" class="search-bar__settings-btn">
        <settings-icon class="search-bar__settings-btn-icon" />
      </ui-button>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiInput, UiButton } from "@light-town/ui";
/// @ts-ignore
import LoupeIcon from "~/assets/loupe.svg";
/// @ts-ignore
import SettingsIcon from "~/assets/settings.svg";

export default Vue.extend({
  name: "SearchBar",
  components: {
    UiGrid,
    UiInput,
    UiButton,
    LoupeIcon,
    SettingsIcon,
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
