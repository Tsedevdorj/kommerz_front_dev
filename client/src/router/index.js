import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Dashboard from "@/views/Dashboard";
import KeywordChurner from "@/views/KeywordChurner";
import keywordCampaignDetails from "@/views/KeywordCampaignDetails";
import GooglePlanner from "@/views/GooglePlanner";
import Login from "@/views/Auth/Login";
import Register from "@/views/Auth/Register";
import NewPassword from "@/views/Auth/NewPassword";
import NotFound from "@/views/Error/404";
import AccessDenied from "@/views/Error/403";
import UserManagement from "@/views/Admin/User";

Vue.use(Router);

const router = new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: "hash",
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
      name: "keywordcampaigndetails",
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
    },
    {
      path: "/register",
      name: "register",
      meta: {
        public: true
      },
      component: Register
    },
    {
      path: "/newpassword",
      name: "newpassword",
      meta: {
        public: true
      },
      component: NewPassword
    },
    // admin pages
    {
      path: "/admin/users",
      name: "UserManagement",
      meta: {
        isAdmin: true,
        isSuperAdmin: true
      },
      component: UserManagement
    }
  ]
});

// global router guard
router.beforeEach((to, from, next) => {
  if (to.meta.isAdmin) {
    if (store.getters.isAdmin == true) {
      next();
    } else {
      next("/dashboard");
    }
  }
  if (to.meta.isSuperAdmin) {
    if (store.getters.isSuperAdmin == true) {
      next();
    } else {
      next("/dashboard");
    }
  }
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
