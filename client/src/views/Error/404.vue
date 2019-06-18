<template>
  <div class="home">
    <a-row
      type="flex"
      justify="space-between"
      align="bottom"
      style="vertical-align: middle; align-items:center; text-align: center; height: 80vh"
    >
      <a-col :span="24">
        <h1>Not Found!</h1>
        <p style="padding-bottom: 10px;">
          Page you're looking for cannot be found
        </p>
        <a-button type="primary" @click="goBack">Go Back</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.back();
    }
  }
};
</script>
