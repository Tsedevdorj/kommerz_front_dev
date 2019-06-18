<template>
  <div class="home">
    <a-row
      type="flex"
      justify="space-between"
      align="bottom"
      style="vertical-align: middle; align-items:center; text-align: center; height: 80vh"
    >
      <a-col :span="24">
        <h1>Forbidden</h1>
        <p style="padding-bottom: 10px;">
          You're not authorized to access this page
        </p>
        <a-button type="primary" @click="goHome"> Go Home</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ name: "dashboard" });
    }
  }
};
</script>
