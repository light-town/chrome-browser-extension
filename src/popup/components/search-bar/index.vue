<template>
  <ui-grid align-items="center" justify="space-between" class="search-bar">
    <ui-grid align-items="center">
      <loupe-icon class="search-bar__input-icon" />
      <ui-input
        ref="input"
        v-model="query"
        placeholder="Search passwords"
        class="search-bar__input"
        :value="query"
        tabindex="-1"
      />
    </ui-grid>
    <ui-grid align-items="center" class="search-bar__tools">
      <ui-button
        variant="text"
        class="search-bar__settings-btn"
        @click="toggleSidebarShowing"
      >
        <settings-icon class="search-bar__settings-btn-icon" />
      </ui-button>
      <sidebar :is-open="isSidebarShow" @close="isSidebarShow = false" />
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import { UiGrid, UiInput, UiButton } from "@light-town/ui";
/// @ts-ignore
import LoupeIcon from "~/assets/loupe.svg";
/// @ts-ignore
import SettingsIcon from "~/assets/settings.svg";
import * as vaultItemsActionTypes from "~/popup/store/vault-items/types";
import { Store } from "~/popup/store";
import Sidebar from "~/popup/components/sidebar/index.vue";

export default Vue.extend({
  name: "SearchBar",
  components: {
    UiGrid,
    UiInput,
    UiButton,
    Sidebar,
    LoupeIcon,
    SettingsIcon,
  },
  data() {
    return {
      query: "",
      isSidebarShow: false,
    };
  },
  computed: {
    ...mapState({
      searchQuery: (state: Store) => state.vaultItems.searchQuery,
    }),
  },
  watch: {
    query() {
      if (!this.query.trim().length) {
        this.setSearchQuery({ query: "" });
        this.$router.push("/items");
        return;
      }

      this.setSearchQuery({ query: this.query });

      if (this.$route.fullPath === `/search`) return;

      this.$router.push(`/search`);
    },
  },
  created() {
    this.query = this.searchQuery;
  },
  mounted() {
    this.$refs.input.$el.focus();
  },
  methods: {
    ...mapActions({
      setSearchQuery: vaultItemsActionTypes.SET_SEARCH_QUERY,
    }),
    toggleSidebarShowing() {
      this.isSidebarShow = !this.isSidebarShow;
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
