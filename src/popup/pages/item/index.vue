<template>
  <default-page-layout>
    <template #body>
      <ui-grid v-if="!loading" direction="column" class="p-5">
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
        <ui-grid direction="column" class="item-page-body__body">
          <template v-for="field in fields">
            <component
              :is="field.component"
              :key="field.id"
              :title="field.name"
              :value="field.value"
              :primary="field.isPrimary"
            />
          </template>
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
import TextItemField from "~/popup/components/item-fields/text/index.vue";
import PasswordItemField from "~/popup/components/item-fields/password/index.vue";
import UrlItemField from "~/popup/components/item-fields/url/index.vue";

export default Vue.extend({
  name: "ItemPage",
  components: {
    UiGrid,
    UiAvatar,
    UiButton,
    DefaultPageLayout,
    TextItemField,
    PasswordItemField,
    UrlItemField,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState({
      currentVaultItem: (state: any) =>
        state.vaultItems.all[state.vaultItems.currentVaultItemUuid],
      currentVaultItemUuid: (state: any) =>
        state.vaultItems.currentVaultItemUuid,
    }),
    fields() {
      const components = {
        Username: "text-item-field",
        Password: "password-item-field",
        "Website URL": "url-item-field",
      };

      return [
        ...(this.currentVaultItem?.overview?.fields ?? []),
        ...(this.currentVaultItem?.details?.fields ?? []),
      ]
        .filter((f) => f.fieldName !== "Avatar")
        .map((f) => {
          return {
            ...f,
            component: components[f.fieldName],
            isPrimary: f.fieldName === "Username" || f.fieldName === "Password",
          };
        })
        .sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });
    },
  },
  watch: {
    currentVaultItem() {
      if (this.loading && this.currentVaultItem?.details) this.loading = false;
    },
  },
  created() {
    this.setCurrentVaultItemUuid({ uuid: this.$route.params.itemUuid });

    this.loading = true;

    this.getVaultItem({ uuid: this.currentVaultItemUuid });
  },
  methods: {
    ...mapActions({
      setCurrentVaultItemUuid: vaultItemActionTypes.SET_CURRENT_VAULT_ITEM_UUID,
      getVaultItem: vaultItemActionTypes.GET_VAULT_ITEM,
    }),
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
