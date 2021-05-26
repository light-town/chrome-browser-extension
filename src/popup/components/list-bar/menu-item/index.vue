<template>
  <ui-grid
    align-items="center"
    class="list-bar__list-item"
    :class="{ 'list-bar__list-item_active': active }"
  >
    <ui-avatar :name="name" :size="32" class="list-bar__list-item-icon" />
    <ui-grid direction="column">
      <p class="list-bar__list-item-text">{{ name }}</p>
      <p class="list-bar__list-item-desc">{{ desc }}</p>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiAvatar } from "@light-town/ui";

export default Vue.extend({
  name: "MenuItem",
  components: {
    UiGrid,
    UiAvatar,
  },
  props: {
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" src="../index.scss"></style>
