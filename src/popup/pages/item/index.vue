<template>
  <default-page-layout>
    <template #body>
      <ui-grid direction="column" class="p-5">
        <ui-grid
          align-items="center"
          justify="space-between"
          class="item-page-body__header"
        >
          <ui-grid align-items="center">
            <ui-avatar
              :name="currentVaultItem.overview.name"
              :size="64"
              class="item-page-body__header-icon"
            />
            <ui-grid direction="column" class="w-auto inline-flex">
              <p class="item-page-body__header-title">
                {{ currentVaultItem.overview.name }}
              </p>
            </ui-grid>
          </ui-grid>
          <ui-button variant="contained" class="item-page-body__header-btn">
            Open & Fill
          </ui-button>
        </ui-grid>
        <ui-grid direction="column">
          <ui-grid align-items="center" class="item-field">
            <ui-grid direction="column">
              <p class="item-field__title">Password</p>
              <p class="item-field__value">••••••••••••••••••••••••••••••</p>
            </ui-grid>
          </ui-grid>
        </ui-grid>
      </ui-grid>
    </template>
  </default-page-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { UiGrid, UiAvatar, UiButton } from "@light-town/ui";
import DefaultPageLayout from "~/popup/layouts/default.vue";
import * as vaultItemActionTypes from "~/popup/store/vault-items/types";

const f = (data: string) => {
  return data;
};

export default Vue.extend({
  name: "ItemPage",
  components: {
    UiGrid,
    UiAvatar,
    UiButton,
    DefaultPageLayout,
  },
  computed: {
    ...mapState({
      currentVaultItem: (state: any) =>
        state.vaultItems.all[state.vaultItems.currentVaultItemUuid],
    }),
  },
  created() {
    this.setCurrentVaultItemUuid({ uuid: this.$route.params.itemUuid });

    console.log(this.currentVaultItem);
  },
  methods: {
    ...mapActions({
      setCurrentVaultItemUuid: vaultItemActionTypes.SET_CURRENT_VAULT_ITEM_UUID,
    }),
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
