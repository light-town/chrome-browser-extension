import Vue from "vue";
import VueI18n from "vue-i18n";

import enUS from "./en-US.json";
import ruRU from "./ru-RU.json";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "en-US",
  fallbackLocale: "en-US",
  messages: {
    "en-US": enUS,
    "ru-RU": ruRU,
  },
});

export default i18n;
