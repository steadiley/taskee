import "reflect-metadata";
import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
require("@/assets/scss/styles.scss");

import { getResolvedContext } from "./context_factory";

Vue.config.productionTip = false;
Vue.use(VueCompositionApi);

const context = getResolvedContext();

new Vue({
  router,
  store: createStore(context),
  render: (h) => h(App),
}).$mount("#app");
