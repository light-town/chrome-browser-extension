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
        <ui-grid align-items="center" class="item-model__header-avatar">
          <ui-avatar
            :name="currentVaultItem.overview.name"
            :alt="currentVaultItem.overview.name"
            :size="64"
            class="item-model__header-icon"
            :title="currentVaultItem.overview.name"
          />
          <ui-grid direction="column" class="overflow-hidden">
            <p
              class="item-model__header-title"
              :title="currentVaultItem.overview.name"
            >
              {{ currentVaultItem.overview.name }}
            </p>
          </ui-grid>
        </ui-grid>
        <ui-button
          v-if="isSuggestion"
          variant="contained"
          class="item-model__header-btn"
          @click="fill"
        >
          {{ $t("Fill") }}
        </ui-button>
        <ui-button
          v-else
          variant="contained"
          class="item-model__header-btn"
          @click="openAndFill"
        >
          {{ $t("Open & Fill") }}
        </ui-button>
      </ui-grid>
      <ui-grid direction="column" class="item-model__body">
        <template v-for="field in fields">
          <component
            :is="field.component"
            :key="field.id"
            :title="$t(field.name)"
            :value="field.value"
            :primary="field.isPrimary"
            @open-and-fill="openAndFill"
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
import { Store } from "~/popup/store";
import fillHelper from "./helpers/fill.helper";
import openAndFillHelper from "./helpers/open-and-fill.helper";

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
      currentVaultItem: (state: Store) =>
        state.vaultItems.all[state.vaultItems.currentVaultItemUuid],
      currentVaultItemUuid: (state: Store) =>
        state.vaultItems.currentVaultItemUuid,
      suggestions: (state: Store) => state.vaultItems.suggestions,
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
    isSuggestion() {
      return (
        Object.values(this.suggestions).find(
          (s: any) => s.uuid === this.currentVaultItemUuid
        ) !== undefined
      );
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
      getSuggestions: vaultItemActionTypes.GET_SUGGESTIONS,
    }),
    loadVaultItem() {
      if (!this.currentVaultItemUuid) return;

      this.loading = true;

      if (!Object.values(this.suggestions).length) {
        this.getSuggestions();
      }

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
    fill() {
      fillHelper([
        ...(this.currentVaultItem?.overview?.fields ?? []),
        ...(this.currentVaultItem?.details?.fields ?? []),
      ]);
    },
    openAndFill() {
      openAndFillHelper([
        ...(this.currentVaultItem?.overview?.fields ?? []),
        ...(this.currentVaultItem?.details?.fields ?? []),
      ]);
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
