<template>
  <ui-button
    variant="text"
    class="sidebar__menu-item"
    @click="$emit('click', $event)"
  >
    <slot name="text-template" :title="title">
      <p class="sidebar__menu-item__text">{{ title }}</p>
    </slot>
    <ui-grid class="sidebar__menu-item__icon">
      <slot name="icon-template"></slot>
    </ui-grid>
  </ui-button>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiButton } from "@light-town/ui";

export default Vue.extend({
  name: "SidebarMenuItem",
  components: {
    UiGrid,
    UiButton,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
