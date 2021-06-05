<template>
  <default-item :title="title">
    <ui-select
      :items="items"
      @input="(item) => $emit('input', item)"
      :value="value"
      class="select-item__select"
    >
      <template #anchor="{ selectedItem: item, open }">
        <ui-button variant="outlined" @click="open" class="select-item__btn">
          <p>{{ item.name }}</p>
        </ui-button>
      </template>
    </ui-select>
  </default-item>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiSelect, UiButton } from "@light-town/ui";
import DefaultItem from "../default/index.vue";

export default Vue.extend({
  name: "SelectItem",
  components: {
    UiGrid,
    UiSelect,
    UiButton,
    DefaultItem,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: "",
    },
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    value: {
      type: Object,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
