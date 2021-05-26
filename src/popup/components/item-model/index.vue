<template>
  <ui-grid direction="column" class="h-full p-5">
    <ui-grid
      v-if="!loading && currentVaultItem"
      direction="column"
      class="h-full"
    >
      <ui-grid
        align-items="center"
        justify="space-between"
        class="item-model__header"
      >
        <ui-grid align-items="center">
          <ui-avatar
            :name="currentVaultItem.overview.name"
            :size="64"
            class="item-model__header-icon"
          />
          <ui-grid direction="column" class="w-auto inline-flex">
            <p class="item-model__header-title">
              {{ currentVaultItem.overview.name }}
            </p>
          </ui-grid>
        </ui-grid>
        <ui-button variant="contained" class="item-model__header-btn">
          Open & Fill
        </ui-button>
      </ui-grid>
      <ui-grid direction="column" class="item-model__body">
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
    <ui-grid
      v-else-if="loading && currentVaultItemUuid"
      align-items="center"
      justify="center"
      class="mt-5"
    >
      <ui-loading :size="24" />
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { UiGrid, UiAvatar, UiButton, UiLoading } from "@light-town/ui";
import * as vaultItemActionTypes from "~/popup/store/vault-items/types";
import TextItemField from "~/popup/components/item-fields/text/index.vue";
import PasswordItemField from "~/popup/components/item-fields/password/index.vue";
import UrlItemField from "~/popup/components/item-fields/url/index.vue";
import * as MessageTypesEnum from "~/enums/message-types.enum";

export default Vue.extend({
  name: "ItemModel",
  components: {
    UiGrid,
    UiAvatar,
    UiButton,
    UiLoading,
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
    currentVaultItemUuid() {
      this.loadVaultItem();
    },
  },
  created() {
    this.loadVaultItem();
  },
  methods: {
    ...mapActions({
      getVaultItem: vaultItemActionTypes.GET_VAULT_ITEM,
    }),
    loadVaultItem() {
      if (!this.currentVaultItemUuid) return;

      this.loading = true;

      this.getVaultItem({ uuid: this.currentVaultItemUuid }).then(
        (response) => {
          if (response?.type === MessageTypesEnum.LOCK_UP) {
            this.$router.push("/sign-in");
            return;
          }

          this.loading = false;
        }
      );
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
