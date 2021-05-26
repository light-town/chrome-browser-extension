<template>
  <default-page-layout>
    <template #sidebar>
      <sidebar>
        <template #menu-template>
          <sidebar-menu
            :items="items"
            :loading="loading"
            @menu-item-click="setCurrentVaultItem"
          />
        </template>
      </sidebar>
    </template>
    <template #body>
      <item-model />
    </template>
  </default-page-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import DefaultPageLayout from "~/popup/layouts/default.vue";
import ItemModel from "~/popup/components/item-model/index.vue";
import * as vaultItemActionTypes from "~/popup/store/vault-items/types";
import Sidebar from "~/popup/components/list-bar/index.vue";
import SidebarMenu from "~/popup/components/list-bar/menu/index.vue";
import { Store } from "~/popup/store";

export default Vue.extend({
  name: "SearchPage",
  components: {
    DefaultPageLayout,
    ItemModel,
    Sidebar,
    SidebarMenu,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState({
      currentVaultItemUuid: (state: Store) =>
        state.vaultItems.currentVaultItemUuid,
      items(state: Store) {
        return Object.values(state.vaultItems.all)
          .map((i: any) => ({
            uuid: i.uuid,
            name: i.overview.fields.find((f) => f.fieldName === "Avatar").value,
            desc: i.overview.fields.find((f) => f.fieldName === "Username")
              .value,
            isActive: this.currentVaultItemUuid === i.uuid,
          }))
          .filter((i) => {
            console.log(state);
            return new RegExp(
              `^${state.vaultItems.searchQuery.toLowerCase()}`
            ).test(i.name.toLowerCase());
          });
      },
    }),
  },
  watch: {
    items() {
      if (this.items.length /* && !this.currentVaultItemUuid */) {
        this.setCurrentVaultItemUuid({ uuid: this.items[0].uuid });
      }
    },
    loading() {
      if (this.loading) return;

      if (this.items.length /* && !this.currentVaultItemUuid */) {
        this.setCurrentVaultItemUuid({ uuid: this.items[0].uuid });
      }
    },
  },
  created() {
    this.loading = true;

    this.setCurrentVaultItemUuid({ uuid: null });

    this.getVaultItems().then(() => (this.loading = false));
  },
  methods: {
    ...mapActions({
      setCurrentVaultItemUuid: vaultItemActionTypes.SET_CURRENT_VAULT_ITEM_UUID,
      getVaultItems: vaultItemActionTypes.GET_VAULT_ITEMS,
    }),
    setCurrentVaultItem(_, item) {
      this.setCurrentVaultItemUuid({ uuid: item.uuid });
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
