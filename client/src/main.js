import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VeeValidate from "vee-validate";

import VueLodash from "vue-lodash";

const options = { name: "lodash" }; // customize the way you want to call it

Vue.use(VueLodash, options); // options is optional
Vue.use(VeeValidate);
Vue.use(Antd);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
