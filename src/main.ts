import { createApp } from "vue";
import "@/assets/theme-color.css";
import "@/assets/tailwind.css";
import { createI18n } from "vue-i18n";
import en from "@/i18n/en.json";
import zh from "@/i18n/zh.json";
import router from "@/router";
import App from "./App.vue";

const savedLocale = localStorage.getItem("locale") || "en";

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  messages: {
    en,
    zh,
  },
});

createApp(App).use(router).use(i18n).mount("#app");
