import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import { authenticate } from "@/api";
import { isValidJwt } from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("auth_token") || ""
  },
  actions: {
    login(context, userData) {
      return new Promise((resolve, reject) => {
        authenticate(userData)
          .then(response => {
            localStorage.setItem("auth_token", response.data.auth_token);
            context.commit("clientLogin", { login: response.data });
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    logout(context) {
      if (context.getters.isAuthenticated) {
        localStorage.removeItem("auth_token");
        router.go({ name: "login" });
        context.commit("clientLogout");
      }
    }
  },
  mutations: {
    clientLogin(state, payload) {
      state.token = payload.login.auth_token;
    },
    clientLogout(state) {
      state.token = null;
    }
  },
  getters: {
    isAuthenticated: state => {
      return isValidJwt(state.token);
    },
    authToken: state => {
      return state.token;
    }
  }
});

export default store;
