import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Dashboard from "@/views/Dashboard";
import KeywordChurner from "@/views/KeywordChurner";
import keywordCampaignDetails from "@/views/KeywordCampaignDetails";
import GooglePlanner from "@/views/GooglePlanner";
import Login from "@/views/Auth/Login";
import NotFound from "@/views/Error/404";
import AccessDenied from "@/views/Error/403";

Vue.use(Router);

const router = new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: "history",
  base: "/",
  routes: [
    // 404 redirects
    {
      path: "*",
      redirect: {
        path: "/404"
      }
    },
    {
      path: "/404",
      meta: {
        public: true
      },
      name: "404",
      component: NotFound
    },
    {
      path: "/403",
      meta: {
        public: true
      },
      name: "403",
      component: AccessDenied
    },
    // dashboard redirects
    {
      path: "/",
      meta: {
        isAuthenticated: true
      },
      name: "root",
      redirect: {
        name: "dashboard"
      }
    },
    {
      path: "/dashboard",
      name: "dashboard",
      meta: {
        isAuthenticated: true
      },
      component: Dashboard
    },
    {
      path: "/keyword",
      name: "keywordchurner",
      meta: {
        isAuthenticated: true
      },
      component: KeywordChurner
    },
    {
      path: "/keyword/detail/:id",
      name: "keywordCampaignDetails",
      meta: {
        isAuthenticated: true
      },
      component: keywordCampaignDetails
    },
    {
      path: "/planner",
      name: "googleplanner",
      meta: {
        isAuthenticated: true
      },
      component: GooglePlanner
    },
    // auth page
    {
      path: "/login",
      name: "login",
      meta: {
        public: true
      },
      component: Login
    }
  ]
});

// global router guard
router.beforeEach((to, from, next) => {
  if (to.meta.isAuthenticated) {
    if (store.getters.isAuthenticated == true) {
      next();
    } else {
      next("/login");
    }
  }
  next();
});

export default router;
