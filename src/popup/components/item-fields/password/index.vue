<template>
  <template-item-field :value="val" v-bind="$attrs" v-on="$listeners">
    <template #tools-template>
      <ui-button
        variant="text"
        class="item-field__tool-btn"
        @click.native="copyValue"
      >
        {{ $t("Copy") }}
      </ui-button>
      <ui-button
        v-if="!showedPassword"
        variant="text"
        class="item-field__tool-btn"
        @click.native="showPassword"
      >
        {{ $t("Reveal") }}
      </ui-button>
      <ui-button
        v-else
        variant="text"
        class="item-field__tool-btn"
        @click.native="hidePassword"
      >
        {{ $t("Conceal") }}
      </ui-button>
    </template>
  </template-item-field>
</template>

<script lang="ts">
import Vue from "vue";
import { UiGrid, UiButton } from "@light-town/ui";
import TemplateItemField from "../template/index.vue";

export default Vue.extend({
  name: "PasswordItemField",
  components: {
    UiGrid,
    UiButton,
    TemplateItemField,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      val: "***********************",
      showedPassword: false,
    };
  },
  methods: {
    copyValue() {
      navigator.clipboard.writeText(this.value);
    },
    showPassword() {
      this.val = this.value;
      this.showedPassword = true;
    },
    hidePassword() {
      this.val = "***********************";
      this.showedPassword = false;
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
