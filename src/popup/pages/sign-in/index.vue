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
        placeholder="Enter your Master Password"
        class="sign-in-page__input"
        :readonly="loading"
        @focus.native="setInputFieldBlur"
        @blur.native="setInputFieldBlur"
        @keydown.enter.native="signIn"
      />
      <ui-button
        variant="contained"
        class="sign-in-page__btn"
        :loading="loading"
        @click="signIn"
      >
        <unlock-icon v-if="!loading" class="sign-in-page__btn-icon" />
      </ui-button>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiInput, UiButton } from "@light-town/ui";
/// @ts-ignore
import LogoIcon from "~/assets/logo.svg";
/// @ts-ignore
import UnlockIcon from "~/assets/unlock.svg";
import * as MessageTypesEnum from "~/enums/message-types.enum";

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
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.setInputFieldFocus();
    });
  },
  methods: {
    signIn() {
      this.loading = true;

      chrome.runtime.sendMessage({
        type: MessageTypesEnum.CREATE_SESSION_REQUEST,
        data: {
          password: this.password,
        },
      });
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
