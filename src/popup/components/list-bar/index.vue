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

<script>
import { UiGrid, UiAvatar, UiSelect, UiButton } from "@light-town/ui";

export default {
  name: "ListBar",
  components: {
    UiGrid,
    UiAvatar,
    UiSelect,
    UiButton,
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
      items: [
        {
          uuid: "1",
          name: "Google",
          desc: "some@gmail.com",
          active: true,
        },
        {
          uuid: "2",
          name: "Amazon",
          desc: "some@gmail.com",
          active: false,
        },
        {
          uuid: "3",
          name: "Yandex",
          desc: "some@gmail.com",
          active: false,
        },
        {
          uuid: "4",
          name: "Yandex",
          desc: "some@gmail.com",
          active: false,
        },
        {
          uuid: "5",
          name: "Yandex",
          desc: "some@gmail.com",
          active: false,
        },
        {
          uuid: "6",
          name: "Yandex",
          desc: "some@gmail.com",
          active: false,
        },
        {
          uuid: "7",
          name: "Yandex",
          desc: "some@gmail.com",
          active: false,
        },
        {
          uuid: "8",
          name: "Yandex",
          desc: "some@gmail.com",
          active: false,
        },
      ],
    };
  },
  created() {
    this.selectedItemCategory = this.itemCategories[0];
  },
};
</script>

<style lang="scss" src="./index.scss"></style>
