<template>
  <ui-grid
    direction="column"
    align-items="center"
    justify="center"
    class="h-full px-32"
  >
    <ui-grid direction="column" align-items="center" class="mb-8">
      <logo-icon class="sign-in-page__logo mb-3" />
      <p class="sign-in-page__title">Light Town</p>
    </ui-grid>
    <ui-grid
      align-items="center"
      class="sign-in-page__input-field"
      :class="{ 'sign-in-page__input-field_focused': focused }"
    >
      <ui-input
        ref="input"
        v-model="password"
        type="password"
        :placeholder="$t('Enter your Master Password')"
        class="sign-in-page__input"
        :readonly="loading"
        @focus.native="setInputFieldFocus"
        @blur.native="setInputFieldBlur"
        @keydown.enter.native="signIn"
      />
      <ui-button
        variant="contained"
        class="sign-in-page__btn"
        :class="{ 'sign-in-page__btn_danger': error }"
        :loading="loading"
        @click="signIn"
      >
        <unlock-icon v-if="!loading" class="sign-in-page__btn-icon" />
      </ui-button>
    </ui-grid>
    <ui-grid direction="column" align-items="center" class="mt-4 h-11">
      <p v-if="error" class="sign-in-page__error-title">{{ error.message }}</p>
      <p v-if="error" class="sign-in-page__error-desc">{{ error.desc }}</p>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { UiGrid, UiInput, UiButton } from "@light-town/ui";
/// @ts-ignore
import LogoIcon from "~/assets/logo.svg";
/// @ts-ignore
import UnlockIcon from "~/assets/unlock.svg";
import * as accountActionTypes from "~/popup/store/account/types";
import * as vaultItemsActionTypes from "~/popup/store/vault-items/types";
import { Store } from "~/popup/store";

export default Vue.extend({
  name: "SignInPage",
  components: {
    UiGrid,
    UiInput,
    UiButton,
    LogoIcon,
    UnlockIcon,
  },
  data() {
    return {
      password: "",
      loading: false,
      focused: false,
      error: null,
    };
  },
  computed: {
    ...mapState({
      suggestions: (state: Store) =>
        Object.values(state.vaultItems.suggestions),
    }),
  },
  created() {
    this.clearVaultItems();
  },
  mounted() {
    this.$nextTick(() => {
      this.setInputFieldFocus();
    });
  },
  methods: {
    ...mapActions({
      signInAction: accountActionTypes.SIGN_IN,
      clearVaultItems: vaultItemsActionTypes.CLEAR,
      getSuggestions: vaultItemsActionTypes.GET_SUGGESTIONS,
    }),
    async signIn() {
      this.loading = true;

      const response = await this.signInAction({ password: this.password });

      if (response?.error) {
        switch (response?.error?.type ?? response?.error?.message) {
          case "Unauthorized": {
            this.error = {
              message: this.$t("Incorrect Password"),
              desc: this.$t(
                "Please make sure Caps Lock is turned off and try again."
              ),
            };
            break;
          }
          default: {
            this.error = {
              message: this.$t("Oops, something went wrong"),
              desc: this.$t("Please try again later."),
            };
          }
        }

        this.loading = false;
        return;
      }

      await this.getSuggestions();

      if (this.suggestions.length) {
        this.$router.push("/suggestions");
      } else {
        this.$router.push("/items");
      }

      this.loading = false;
    },
    setInputFieldFocus() {
      this.focused = true;
      this.$refs.input.$el.focus();
    },
    setInputFieldBlur() {
      this.focused = false;
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
