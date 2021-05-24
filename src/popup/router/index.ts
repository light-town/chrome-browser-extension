import Vue from "vue";
import VueRouter from "vue-router";

import App from "../app.vue";
import SignInPage from "../pages/sign-in/index.vue";
import ItemsPage from "../pages/items/index.vue";
import ItemPage from "../pages/item/index.vue";
import SuggestionsPage from "../pages/suggestions/index.vue";
import SuggestionPage from "../pages/suggestion/index.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/popup/index.html", component: App },
  { path: "/index.html", component: App },
  { path: "/", component: App },
  { path: "/sign-in", component: SignInPage },
  { path: "/items", component: ItemsPage },
  { path: "/items/:itemUuid", component: ItemPage },
  { path: "/suggestions", component: SuggestionsPage },
  { path: "/suggestions/:itemUuid", component: SuggestionPage },
];

const router = new VueRouter({
  base: "/popup/index.html",
  mode: "history",
  routes,
});

export default router;
