<template>
  <!-- Global user template -->
  <div v-if="!this.$route.meta.public">
    <a-layout id="app" style="min-height: 100vh">
      <AppHeader></AppHeader>
      <a-layout>
        <AppSidebar></AppSidebar>
        <a-layout-content
          :style="{
            background: '#fff',
            paddingTop: '24px',
            paddingLeft: '36px',
            paddingRight: '36px',
            margin: 0
          }"
        >
          <router-view :key="$route.fullpath" />
        </a-layout-content>
      </a-layout>
      <AppFooter></AppFooter>
    </a-layout>
  </div>
  <!-- Global public template -->
  <div v-else>
    <a-layout id="app" style="min-height: 100vh">
      <a-layout>
        <a-layout style="padding: 24px">
          <a-layout-content
            :style="{
              background: '#fff',
              padding: '24px',
              margin: 0
            }"
          >
            <router-view />
          </a-layout-content>
          <AppFooter></AppFooter>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
const AppSidebar = () => import("@/components/layout/SideBar");
const AppHeader = () => import("@/components/layout/Header");
const AppFooter = () => import("@/components/layout/Footer");
import { HTTP } from "@/api";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  created() {
    // global intercepter for error statuses
    HTTP.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (error.response.status) {
          if(error.response.status == 401)
            {
            router.push("/");
          }
          if (
            error.response.status == 400 ||
            error.response.status == 403 ||
            error.response.status == 422
          ) {
            router.push("/403");
          }
        } else {
          return error.response.status;
        }
        return Promise.reject(error);
      }
    );
  },
  computed: {
    // call auth token getters from store
    ...mapGetters(["authToken"])
  },
  watch: {
    // immediate token update on client side header
    authToken(token) {
      HTTP.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }
};
</script>
