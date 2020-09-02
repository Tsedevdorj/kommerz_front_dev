<template>
  <div class="dashboard">
    <!-- <a-row :gutter="32">
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
      <a-col :span="6">
        <a-card hoverable @click="goSeasonal">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="table" />
          </template>
          <a-card-meta
            title="Seasonal Analysis"
            description="This is the description"
          >
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row> -->
    <a-row :gutter="32">
      <a-col :span="6">
        <a-card hoverable @click="goSearchKeyword">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="plus" />
          </template>
          <a-card-meta
            title="Search Keyword Manage"
            description="Search keyword manage"
          >
          </a-card-meta>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card hoverable @click="goCrawler">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="plus" />
          </template>
          <a-card-meta
            title="Crawler"
            description="Crawler report feature"
          >
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="32">
      <a-col :span="6">
        <a-card hoverable @click="goAsinChurner">
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            slot="cover"
          />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="plus" />
          </template>
          <a-card-meta
            title="Asin Churner"
            description="Asin Churner feature"
          >
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// Danish provided tracking script START
window.__lo_site_id = 162488;

    (function() {
        var wa = document.createElement('script'); wa.type = 'text/javascript'; wa.async = true;
        wa.src = 'https://d10lpsik1i8c69.cloudfront.net/w.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wa, s);
      })();
// Danish provided tracking script END

export default {
  name: "dashboard",
  methods: {
    goAsinChurner() {
      this.$router.push({ name: "asinchurner" });
    },
    goKeyword() {
      this.$router.push({ name: "keywordchurner" });
    },
    goPlanner() {
      this.$router.push({ name: "googleplanner" });
    },
    goSeasonal() {
      this.$router.push({ name: "seasonalanalysis"});
    },
    goJuggler() {
      this.$router.push({ name: "juggler"});
    },
    goCrawler() {
      this.$router.push({ name: "crawler"});
    },
    goSearchKeyword() {
      this.$router.push({ name: "searchkeyword"});
    }
  }
};
</script> 
