<template>
  <ui-grid direction="column" class="list-bar">
    <ui-select v-model="selectedItemCategory" :items="itemCategories">
      <template #anchor="{ selectedItem, open,  }">
        <ui-button variant="text" class="list-bar__header" @click="open">
          <p class="list-bar__header-title">{{ selectedItem.name }}</p>
        </ui-button>
      </template>
    </ui-select>
    <ui-grid direction="column" class="list-bar__list">
      <ui-grid
        v-for="item in items"
        :key="item.uuid"
        align-items="center"
        class="list-bar__list-item"
        :class="{ 'list-bar__list-item_active': item.active }"
      >
        <ui-avatar
          :name="item.name"
          :size="32"
          class="list-bar__list-item-icon"
        />
        <ui-grid direction="column">
          <p class="list-bar__list-item-text">{{ item.name }}</p>
          <p class="list-bar__list-item-desc">{{ item.desc }}</p>
        </ui-grid>
      </ui-grid>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { UiGrid, UiAvatar, UiSelect, UiButton } from "@light-town/ui";

export default Vue.extend({
  name: "ListBar",
  components: {
    UiGrid,
    UiAvatar,
    UiSelect,
    UiButton,
  },
  computed: {
    ...mapState({
      items: (state: any) =>
        Object.values(state.vaultItems.all).map((i: any) => ({
          uuid: i.uuid,
          name: i.overview.fields.find((f) => f.fieldName === "Avatar").value,
          desc: i.overview.fields.find((f) => f.fieldName === "Username").value,
        })),
    }),
  },
  data() {
    return {
      selectedItemCategory: null,
      itemCategories: [
        {
          uuid: "1",
          name: "All Items",
        },
        {
          uuid: "2",
          name: "Suggestions",
        },
      ],
    };
  },
  created() {
    this.selectedItemCategory = this.itemCategories[0];

    console.log(this.items);
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
