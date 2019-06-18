<template>
  <div class="dashboard">
    <a-row :gutter="32">
      <a-col :span="6">
        <a-card hoverable @click="goKeyword">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="plus" />
          </template>
          <a-card-meta
            title="Keyword Churner"
            description="This is the description"
          >
          </a-card-meta>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable @click="goPlanner">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="plus" />
          </template>
          <a-card-meta
            title="Google Planner"
            description="This is the description"
          >
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "dashboard",
  methods: {
    goKeyword() {
      this.$router.push({ name: "keywordchurner" });
    },
    goPlanner() {
      this.$router.push({ name: "googleplanner" });
    }
  }
};
</script>
