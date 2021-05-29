<template>
  <ui-grid class="sidebar">
    <transition name="fade">
      <ui-grid
        v-if="isOpen"
        direction="column"
        class="sidebar__background"
        @click.native="$emit('close')"
      >
      </ui-grid>
    </transition>
    <transition name="slide">
      <ui-grid v-if="isOpen" direction="column" class="sidebar__popup">
        <slot></slot>
      </ui-grid>
    </transition>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid } from "@light-town/ui";

export default Vue.extend({
  name: "SidebarPopup",
  components: {
    UiGrid,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
