<template>
  <ui-grid>
    <input type="text" placeholder="Enter Master Password" />
    <button @click="login">Login</button>
  </ui-grid>
</template>

<script>
// import UiGrid from "@light-town/ui/src/grid/index.vue";
import { UiGrid } from "@light-town/ui";

export default {
  name: "App",
  components: {
    UiGrid,
  },
  methods: {
    login() {
      console.log("logining...");

      /* chrome.runtime.sendMessage({ command: "login" }, (response) => {
        console.log(response);
      }); */

      /*  chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.sendMessage(tab.id, { type: "getText" }, function(
          response
        ) {
          alert(response);
          $("#text").text(response);
        });
      }); */

      const port = chrome.extension.connect({
        name: "Sample Communication",
      });
      port.postMessage({ command: "login" });
      /* port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
      }); */
    },
  },
};
</script>

<style lang="sass"></style>
