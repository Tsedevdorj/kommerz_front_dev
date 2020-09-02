<template>
  <div class="asinchurner">
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :span="9">
        <label>Account: </label>
        <a-select
          style="width: 300px"
          placeholder="Select Account"
          @change="handleChangeProfile"
          v-model="selectedProfile"
        >
          <a-select-option
            v-for="(item, index) in availableProfiles"
            :key="index"
            :value="item.profileId"
            >{{ item.accountName }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="9">
        <label>Portfolio: </label>
        <a-select
          style="width: 300px"
          placeholder="Select Portfolio"
          @change="handleChangePortfolio"
          v-model="selectedPortfolio"
        >
          <a-select-option
            v-for="(item, index) in availablePortfolios"
            :key="index"
            :value="item.portfolioId"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="9">
        <label>Campaign: </label>
        <a-select
          style="width: 300px"
          placeholder="Select Campaign"
          @change="handleChangeCampaign"
          v-model="selectedCampaign"
        >
          <a-select-option
            v-for="(item, index) in availableCampaigns"
            :key="index"
            :value="item.campaignId"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </a-col>
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-table
        :rowKey="record => record.campaignId"
        :dataSource="asinChurnerData"
        :loading="loading"
        style="padding-bottom: 20px;"
      >
        <a-table-column
          title="AdGroup ID"
          dataIndex="adGroupId"
          key="adGroupId"
        >
        </a-table-column>
        <a-table-column title="Asin" dataIndex="asin" key="asin" width="200px">
        </a-table-column>
        <a-table-column
          title="Recommend Action"
          dataIndex="recommendAction"
          key="recommendAction"
        >
        </a-table-column>
        <!-- <a-table-column title="State" dataIndex="state" key="state">
          <template slot-scope="text">
            <div>
              <a-tag v-if="text == 'archived'">{{ text }}</a-tag>
              <a-tag v-if="text == 'enabled'" color="green">{{ text }}</a-tag>
              <a-tag v-if="text == 'paused'" color="orange">{{ text }}</a-tag>
            </div>
          </template>
        </a-table-column> -->
        <!-- <a-table-column
          title="Targeting Type"
          dataIndex="targetingType"
          key="targetingType"
        >
          <template slot-scope="text">
            <div>
              <a-tag v-if="text == 'manual'" color="orange">{{ text }}</a-tag>
              <a-tag v-if="text == 'auto'" color="green">{{ text }}</a-tag>
            </div>
          </template>
        </a-table-column> -->

        <a-table-column
          title="Actions"
          dataIndex="actions"
          key="actions"
          align="center"
        >
          <template slot-scope="text, record">
            <div>
              <a-button
                type="primary"
                ghost
                icon="eye"
              ></a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-row>
  </div>
</template>

<script>
// Danish provided tracking script START
window.__lo_site_id = 162488;

(function() {
  var wa = document.createElement("script");
  wa.type = "text/javascript";
  wa.async = true;
  wa.src = "https://d10lpsik1i8c69.cloudfront.net/w.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wa, s);
})();
// Danish provided tracking script END

import { list_basic_portfolios, list_basic_profiles, list_basic_campaigns, keywordReport } from "@/api";

export default {
  name: "asinchurner",
  data() {
    return {
      availableCampaigns: [],
      loading: true,
      responseError: {},
      selectProfile: "",
      availableProfiles: [],
      availablePortfolios: [],
      selectedProfile: "",
      selectedPortfolio: "",
      selectedCampaign: "",
      asinChurnerData: []
    };
  },
  methods: {
    getProfilesList() {
      list_basic_profiles()
        .then(response => {
          this.availableProfiles = response.data.data;
          this.loading = false;
          console.log(this.availableProfiles);
        })
        .catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          // this.$router.push({ name: "keywordchurner"});
        });
    },
    handleChangeProfile(value) {
      this.loading = true;
      console.log(value);
      this.selectedPortfolio = "";
      this.availablePortfolios = [];
      this.selectedCampaign = "";
      this.availableCampaigns = [];
      list_basic_portfolios({ profileId: value })
        .then(response => {
          this.availablePortfolios = response.data.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner" });
        });
    },
    handleChangePortfolio(value) {
      this.loading = true;
      console.log(value);
      this.selectedCampaign = "";
      this.availableCampaigns = [];
      list_basic_campaigns({ portfolioId: value })
        .then(response => {
          this.availableCampaigns = response.data.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner" });
        });
    },
    handleChangeCampaign(value) {
      this.loading = true;
      console.log(value);
      this.asinChurnerData = [];
      keywordReport({ 
        campaignId: value,
        isKeywordTargeting: false,
        isAsinChurner: true
       })
        .then(response => {
          this.asinChurnerData = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner" });
        });
    },

    goCampaignRecord(id) {
      this.$router.push({ name: "keywordcampaigndetails", params: { id } });
    }
  },
  mounted() {
    this.getProfilesList();
  }
};
</script>
