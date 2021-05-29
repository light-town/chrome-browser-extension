<template>
  <ui-grid
    align-items="center"
    class="item-field"
    :class="{ 'item-field_primary': primary }"
    @mouseover.native="showToolBtns"
    @mouseleave.native="hideToolBtns"
  >
    <ui-grid direction="column">
      <p class="item-field__title" :title="title">{{ title }}</p>
      <slot name="value-template">
        <p class="item-field__value" :title="value">
          {{ value }}
        </p>
      </slot>
    </ui-grid>
    <ui-grid align-items="center" class="item-field__tool-btns">
      <slot name="tools-template"> </slot>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiButton } from "@light-town/ui";

export default Vue.extend({
  name: "TemplateItemField",
  components: {
    UiGrid,
    UiButton,
  },
  props: {
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showingToolBtns: false,
    };
  },
  methods: {
    showToolBtns() {
      this.showingToolBtns = true;
    },
    hideToolBtns() {
      this.showingToolBtns = false;
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
