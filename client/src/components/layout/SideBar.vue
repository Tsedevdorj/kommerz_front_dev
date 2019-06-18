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
        <a-menu-item
          ><router-link :to="{ name: 'dashboard' }"
            ><a-icon type="dashboard" />Dashboard</router-link
          ></a-menu-item
        >
      </a-menu>
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
