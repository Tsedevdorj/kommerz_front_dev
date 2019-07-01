import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import { authenticate, userRegister, newPassword } from "@/api";
import { isValidJwt, isAdmin, isSuperAdmin } from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("auth_token") || "",
    role: localStorage.getItem("role") || ""
  },
  actions: {
    login(context, userData) {
      return new Promise((resolve, reject) => {
        authenticate(userData)
          .then(response => {
            localStorage.setItem("auth_token", response.data.access_token);
            localStorage.setItem("role", response.data.role);
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
    },
    register(context, userData) {
      return new Promise((resolve, reject) => {
        userRegister(userData)
          .then(response => {
            context.commit("clientRegister", { register: response.data });
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    newPassword(context, userData) {
      return new Promise((resolve, reject) => {
        newPassword(userData)
          .then(response => {
            context.commit("clientNewPassword", { newpassword: response.data });
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  mutations: {
    clientLogin(state, payload) {
      state.token = payload.login.access_token;
      state.role = payload.login.role;
    },
    clientLogout(state) {
      state.token = null;
    },
    clientRegister(state, payload) {
      state.register = payload.register;
    },
    clientNewPassword(state, payload) {
      state.newPassword = payload.newpassword;
    }
  },
  getters: {
    isAuthenticated: state => {
      return isValidJwt(state.token);
    },
    authToken: state => {
      return state.token;
    },
    isAdmin: state => {
      return isAdmin(state.role);
    },
    isSuperAdmin: state => {
      return isSuperAdmin(state.role);
    }
  }
});

export default store;
