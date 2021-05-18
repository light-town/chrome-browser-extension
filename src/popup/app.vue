<template>
  <ui-grid id="app" data-theme-mode="light" class="app-page">
    <ui-grid id="app-page-layout" class="w-full h-full">
      <router-view></router-view>
    </ui-grid>
    <portal-target name="modals-location" multiple> </portal-target>
  </ui-grid>
</template>

<script>
import { UiGrid } from "@light-town/ui";

export default {
  name: "App",
  components: {
    UiGrid,
  },
  created() {
    this.$router.push("/sign-in");
    // this.$router.push("/items");
    // this.$router.push("/items/fdsf0ds-fsdsf-ds-fsd-f-sdf");
  },
};
</script>

<style lang="scss">
@import url("@light-town/ui/assets/css/main.scss");
@import url("@light-town/ui/dist/lib.css");

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

* {
  user-select: none !important;

  &:focus {
    outline-style: none !important;
  }
}

.app-page {
  width: 600px;
  height: 450px;

  flex-shrink: 0;
  flex-grow: 0;

  overflow: hidden;
}
</style>
