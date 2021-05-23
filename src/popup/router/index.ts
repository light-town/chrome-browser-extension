import Vue from "vue";
import VueRouter from "vue-router";

import App from "../app.vue";
import SignInPage from "../pages/sign-in/index.vue";
import ItemsPage from "../pages/items/index.vue";
import ItemPage from "../pages/item/index.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/popup/index.html", component: App },
  { path: "/index.html", component: App },
  { path: "/", component: App },
  { path: "/sign-in", component: SignInPage },
  { path: "/items", component: ItemsPage },
  { path: "/items/:itemUuid", component: ItemPage },
];

const router = new VueRouter({
  base: "/popup/index.html",
  mode: "history",
  routes,
});

export default router;
