<template>
  <ui-grid class="lt_ext_modal" v-if="show">
    <ui-grid class="lt_ext_modal__background"> </ui-grid>
    <ui-grid class="lt_ext_modal__content">
      <ui-grid direction="column" class="lt_ext_notification">
        <ui-grid align-items="center" class="lt_ext_notification__header">
          <p class="lt_ext_notification__title">
            {{ $t("Add account to Light Town Extension") }}
          </p>
        </ui-grid>
        <ui-grid align-items="center" class="lt_ext_notification__body">
          <p class="lt_ext_notification__desc">
            {{
              $t(
                "You can add and remove accounts later from Light Town > Account Settings"
              )
            }}
          </p>
        </ui-grid>
        <ui-grid
          align-items="center"
          justify="flex-end"
          class="lt_ext_notification__bottom"
        >
          <ui-button
            variant="text"
            class="lt_ext_notification__btn"
            :disabled="loading"
            @click="close"
          >
            {{ $t("Cancel") }}
          </ui-button>
          <ui-button
            variant="contained"
            class="lt_ext_notification__btn"
            :loading="loading"
            @click="acceptProposal"
          >
            {{ $t("Add") }}
          </ui-button>
        </ui-grid>
      </ui-grid>
    </ui-grid>
  </ui-grid>
</template>

<script lang="ts">
import Vue from "vue";
/// @ts-ignore
import { UiThemeProvider, UiGrid, UiButton } from "@light-town/ui";
import acceptProposalHelper from "~/content/proposal/helpers/accept-proposal.helper";

export default Vue.extend({
  name: "ProposalNotification",
  components: {
    UiThemeProvider,
    UiGrid,
    UiButton,
  },
  data() {
    return {
      show: true,
      loading: false,
    };
  },
  methods: {
    acceptProposal() {
      this.loading = true;

      acceptProposalHelper()
        .then(() => this.close())
        .finally(() => (this.loading = false));
    },
    close() {
      window.postMessage({ type: "LT_EXT_AUTH_END" });

      this.show = false;
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
