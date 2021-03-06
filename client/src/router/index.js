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
import domainManagement from "@/views/Admin/AddDomain";
import SeasonalAnalysis from "@/views/SeasonalAnalysis";
import Juggler from "@/views/Juggler";
import Crawler from "@/views/Crawler";
import SearchKeyword from "@/views/SearchKeyword";
import AsinChurner from "@/views/AsinChurner";
import Drift from "@/views/Drift";
import Heatmap from "@/views/Heatmap";



Vue.use(Router);

const router = new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: "history",
  base: __dirname,
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
      // eslint-disable-next-line no-unused-vars
      beforeEnter(to, from, next) {
        window.location =
          "https://www.amazon.com/ap/oa?client_id=amzn1.application-oa2-client.5ea9783915b54e3284277593abed4e14&scope=cpc_advertising:campaign_management&response_type=code&redirect_uri=https://test.kommerz.digidon.net/api/keyword_churner/callback";
      },
    },
    {
      path: "/keywordin",
      name: "keywordchurnerin",
      meta: {
        isAuthenticated: true
      },
      // eslint-disable-next-line no-unused-vars
      component: KeywordChurner
    },
    {
      path: "/asinchurner",
      name: "asinchurner",
      meta: {
        isAuthenticated: true
      },
      // eslint-disable-next-line no-unused-vars
      component: AsinChurner
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
    {
      path: "/seasonal",
      name: "seasonalanalysis",
      meta: {
        isAuthenticated: true
      },
      component: SeasonalAnalysis
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
      name: "usermanagement",
      meta: {
        isAdmin: true
      },
      component: UserManagement
    },
    {
      path: "/admin/domain",
      name: "domainmanagement",
      meta: {
        isSuperAdmin: true
      },
      component: domainManagement
    },
    {
      path: "/juggler",
      name: "juggler",
      meta: {
        isAuthenticated: true
      },
      component: Juggler
    },
    {
      path: "/crawler",
      name: "crawler",
      meta: {
        isAuthenticated: true
      },
      component: Crawler
    },
    {
      path: "/drift",
      name: "drift",
      meta: {
        isAuthenticated: true
      },
      component: Drift
    },
    {
      path: "/search_keyword",
      name: "searchkeyword",
      meta: {
        isAuthenticated: true
      },
      component: SearchKeyword
    },
    {
      path: "/heatmap",
      name: "heatmap",
      meta: {
        isAuthenticated: true
      },
      component: Heatmap
    },
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
    }
    else {
      next({ name: "login" });
    }
  }
  // if (store.getters.isAuthenticated) {
  //   if (to.name == 'login') {
  //     next("/dashboard");
  //   } else {
  //     next();
  //   }
  // }
  next();
});

export default router;
