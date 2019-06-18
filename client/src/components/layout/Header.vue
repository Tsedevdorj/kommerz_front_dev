<template>
  <a-layout-header class="header">
    <router-link :to="{ name: 'dashboard' }">
      <div class="logo_wrapper">
        <div class="logo">
          <div class="logo_text">
            <span>Logo</span>
          </div>
        </div>
      </div>
    </router-link>
    <div style="float:right">
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item><a-icon type="user" />Profile</a-menu-item>
          <a-menu-item><a-icon type="logout" />Logout</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          Username <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>

<style>
.ant-layout-header {
  padding: 0 24px;
}
.ant-menu-item .anticon {
  padding: 5px;
  margin-right: 0;
}

.logo_wrapper {
  float: left;
  height: 100%;
}

.logo {
  display: inline-block;
  vertical-align: middle;
  background: #ffffff;
  border-radius: 4px;
  width: 160px;
  height: 35px;
}
.logo_text {
  font-size: 16px;
  text-align: center;
  color: #444444;
  line-height: 2.3;
}
</style>
