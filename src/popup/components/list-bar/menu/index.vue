<template>
  <ui-grid direction="column" class="list-bar__list">
    <template v-if="items.length">
      <menu-item
        v-for="item in items"
        :key="item.uuid"
        :name="item.name"
        :desc="item.desc"
        :active="item.isActive"
        @click.native="(e) => $emit('menu-item-click', e, item)"
      />
    </template>
    <template v-else-if="loading">
      <slot name="loading-menu-template">
        <ui-grid align-items="center" justify="center" class="mt-5">
          <ui-loading :size="20" />
        </ui-grid>
      </slot>
    </template>
    <template v-else>
      <slot name="empty-menu-template">
        <ui-grid align-items="center" justify="center" class="mt-5">
          <p class="list-bar_empty">No items found</p>
        </ui-grid>
      </slot>
    </template>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiLoading } from "@light-town/ui";
import MenuItem from "../menu-item/index.vue";

export default Vue.extend({
  name: "Menu",
  components: {
    UiGrid,
    UiLoading,
    MenuItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>

<style lang="scss" src="../index.scss"></style>
