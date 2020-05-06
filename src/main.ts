import "reflect-metadata";
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import createStore from "./store";
import "firebaseui/dist/firebaseui.css";

require("@/assets/scss/styles.scss");

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

new Vue({
  router,
  store: createStore(),
  render: (h) => h(App),
}).$mount("#app");
