<template>
  <portal to="modals-location">
    <popup :is-open="isOpen" @close="close">
      <sidebar-menu>
        <sidebar-menu-item :title="$t('Lock')" @click="lockApp">
          <template #icon-template>
            <lock-icon />
          </template>
        </sidebar-menu-item>
        <sidebar-menu-item
          :title="$t('Settings')"
          @click="openSettingsPage"
        ></sidebar-menu-item>
      </sidebar-menu>
    </popup>
  </portal>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { UiGrid } from "@light-town/ui";
import Popup from "./popup.vue";
/// @ts-ignore
import LockIcon from "~/assets/lock.svg";
import * as authActionTypes from "~/popup/store/account/types";
import SidebarMenu from "~/popup/components/sidebar/menu/index.vue";
import SidebarMenuItem from "~/popup/components/sidebar/menu/item.vue";

export default Vue.extend({
  name: "Sidebar",
  components: {
    UiGrid,
    Popup,
    LockIcon,
    SidebarMenu,
    SidebarMenuItem,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    ...mapActions({
      lockApp: authActionTypes.LOCK_APP,
    }),
    close() {
      this.$emit("close");
    },
    handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        this.close();
      }
    },
    openSettingsPage() {
      chrome.tabs.create({ url: "/options/index.html", active: true });
    },
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
