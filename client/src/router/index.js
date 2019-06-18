import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard";

Vue.use(Router);

const router = new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      meta: {
        isAuthenticated: true
      },
      component: Dashboard
    }
  ]
});

export default router;
