<template>
  <ui-grid direction="column" class="list-bar">
    <ui-select
      v-if="!isSearchPage"
      v-model="selectedItemCategory"
      :items="itemCategories"
    >
      <template #anchor="{ selectedItem, open  }">
        <ui-button variant="text" class="list-bar__header" @click="open">
          <p class="list-bar__header-title">{{ selectedItem.name }}</p>
        </ui-button>
      </template>
    </ui-select>
    <ui-grid v-else align-items="center" class="list-bar__header">
      <p class="list-bar__header-title">{{ $t("Search Results") }}</p>
    </ui-grid>
    <slot name="menu-template"> </slot>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
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
    isItemPage() {
      return /^\/items\/?/.test(this.$route.path);
    },
    isSuggestionPage() {
      return /^\/suggestions\/?/.test(this.$route.path);
    },
    isSearchPage() {
      return /^\/search\/?/.test(this.$route.path);
    },
  },
  data() {
    return {
      selectedItemCategory: null,
      itemCategories: [
        {
          uuid: "all_items",
          name: this.$t("All Items"),
        },
        {
          uuid: "suggestions",
          name: this.$t("Suggestions"),
        },
      ],
    };
  },
  created() {
    if (this.isItemPage) this.selectedItemCategory = this.itemCategories[0];
    else if (this.isSuggestionPage) {
      this.selectedItemCategory = this.itemCategories[1];
    }
  },
  watch: {
    selectedItemCategory() {
      if (this.selectedItemCategory?.uuid === "all_items" && !this.isItemPage) {
        this.$router.push("/items");
      } else if (
        this.selectedItemCategory?.uuid === "suggestions" &&
        !this.isSuggestionPage
      ) {
        this.$router.push("/suggestions");
      }
    },
  },
  methods: {
    ...mapActions({
      getSuggestion: vaultItemActionTypes.GET_SUGGESTIONS,
      getVaultItems: vaultItemActionTypes.GET_VAULT_ITEMS,
    }),
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
