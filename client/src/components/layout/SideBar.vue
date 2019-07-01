<template>
  <div>
    <!-- sidebar menu -->
    <a-layout-sider
      width="200"
      style="background: #fff; height: 100%"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <a-menu mode="inline" :style="{ borderRight: 0 }">
        <a-divider>Pages</a-divider>
        <a-menu-item
          ><router-link :to="{ name: 'dashboard' }"
            ><a-icon type="dashboard" />Dashboard</router-link
          ></a-menu-item
        >
        <a-menu-item
          ><router-link :to="{ name: 'keywordchurner' }"
            ><a-icon type="arrows-alt" />Keyword Churner</router-link
          ></a-menu-item
        >
        <a-menu-item
          ><router-link :to="{ name: 'googleplanner' }"
            ><a-icon type="layout" />Google Planner</router-link
          ></a-menu-item
        >
      </a-menu>
      <a-divider v-if="this.$store.getters.isAdmin == true"
        >Administrator</a-divider
      >
      <a-divider v-if="this.$store.getters.isSuperAdmin == true"
        >Super Admin</a-divider
      >
    </a-layout-sider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // side menu collapse
      collapsed: false
    };
  }
};
</script>
