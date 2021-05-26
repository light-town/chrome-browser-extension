import Vue from "vue";
import VueRouter from "vue-router";

import App from "../app.vue";
import SignInPage from "../pages/sign-in/index.vue";
import ItemsPage from "../pages/items/index.vue";
import SuggestionsPage from "../pages/suggestions/index.vue";
import SearchPage from "../pages/search/index.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/popup/index.html", component: App },
  { path: "/index.html", component: App },
  { path: "/", component: App },
  { path: "/sign-in", component: SignInPage },
  { path: "/items", component: ItemsPage },
  { path: "/suggestions", component: SuggestionsPage },
  { path: "/search", component: SearchPage },
];

const router = new VueRouter({
  base: "/popup/index.html",
  routes,
});

export default router;
