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
      <template v-if="items.length">
        <ui-grid
          v-for="item in items"
          :key="item.uuid"
          align-items="center"
          class="list-bar__list-item"
          :class="{ 'list-bar__list-item_active': item.isActive }"
          @click.native="selectItem(item.uuid)"
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
      </template>
      <template v-else>
        <ui-grid align-items="center" justify="center" class="mt-5">
          <p class="list-bar_empty">No items found</p>
        </ui-grid>
      </template>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { UiGrid, UiAvatar, UiSelect, UiButton } from "@light-town/ui";
import * as vaultItemActionTypes from "~/popup/store/vault-items/types";

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
      currentVaultItemUuid: (state: any) =>
        state.vaultItems.currentVaultItemUuid,
      items(state: any) {
        return Object.values(state.vaultItems.all).map((i: any) => ({
          uuid: i.uuid,
          name: i.overview.fields.find((f) => f.fieldName === "Avatar").value,
          desc: i.overview.fields.find((f) => f.fieldName === "Username").value,
          isActive: this.currentVaultItemUuid === i.uuid,
        }));
      },
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
    if (this.isItemPage()) this.selectedItemCategory = this.itemCategories[0];
    else if (this.isSuggestionPage()) {
      this.selectedItemCategory = this.itemCategories[1];
    }
  },
  watch: {
    selectedItemCategory() {
      if (
        this.selectedItemCategory?.name === "All Items" &&
        !this.isItemPage()
      ) {
        this.getVaultItems();
      } else if (
        this.selectedItemCategory?.name === "Suggestions" &&
        !this.isSuggestionPage()
      ) {
        this.getSuggestion();
      }
    },
  },
  methods: {
    ...mapActions({
      setCurrentVaultItemUuid: vaultItemActionTypes.SET_CURRENT_VAULT_ITEM_UUID,
      getVaultItem: vaultItemActionTypes.GET_VAULT_ITEM,
      getSuggestion: vaultItemActionTypes.GET_SUGGESTIONS,
      getVaultItems: vaultItemActionTypes.GET_VAULT_ITEMS,
    }),
    selectItem(uuid: string) {
      this.setCurrentVaultItemUuid({ uuid });
      this.getVaultItem({ uuid });
    },
    isItemPage() {
      return /^\/items\/?/.test(this.$route.path);
    },
    isSuggestionPage() {
      return /^\/suggestions\/?/.test(this.$route.path);
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
