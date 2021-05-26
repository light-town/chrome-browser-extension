<template>
  <default-page-layout>
    <template #sidebar>
      <sidebar>
        <template #menu-template>
          <sidebar-menu
            :items="items"
            :loading="loading"
            :active-item-uuid="currentVaultItemUuid"
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
import * as MessageTypesEnum from "~/enums/message-types.enum";

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
      searchQuery: (state: Store) => state.vaultItems.searchQuery,
      items(state: Store) {
        return Object.values(state.vaultItems.all)
          .filter((i) => {
            return new RegExp(`^${this.searchQuery.toLowerCase()}`).test(
              i.overview.name.toLowerCase()
            );
          })
          .map((i: any) => ({
            uuid: i.uuid,
            name: i.overview.fields.find((f) => f.fieldName === "Avatar").value,
            desc: i.overview.fields.find((f) => f.fieldName === "Username")
              .value,
          }));
      },
    }),
  },
  watch: {
    searchQuery() {
      if (this.items.length) {
        this.setCurrentVaultItemUuid({ uuid: this.items[0].uuid });
      }
    },
  },
  created() {
    this.loading = true;

    this.setCurrentVaultItemUuid({ uuid: null });

    this.getVaultItems().then((response) => {
      if (response?.type === MessageTypesEnum.LOCK_UP) {
        this.$router.push("/sign-in");
        return;
      }

      this.setCurrentVaultItemUuid({ uuid: this.items[0].uuid });

      this.loading = false;
    });
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
