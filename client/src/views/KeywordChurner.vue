<template>
  <div class="keywordchurner">
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :span="13">
      <label>Account: </label>
      <a-select style="width: 600px" placeholder="Select Account" @change="handleChange">
          <a-select-option v-for="(item, index) in availableProfiles" :key="index" :value="item.profileId">{{item.accountName}}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-table
        :rowKey="record => record.campaignId"
        :dataSource="campaignList"
        :loading="loading"
        style="padding-bottom: 20px;"
      >
        <a-table-column
          title="Campaign ID"
          dataIndex="campaignId"
          key="campaignId"
        >
        </a-table-column>
        <a-table-column title="Name" dataIndex="name" key="name" width="200px">
        </a-table-column>
        <a-table-column title="Start Date" dataIndex="startDate" key="startDate" width="100px">
        </a-table-column>
        <a-table-column title="State" dataIndex="state" key="state">
          <template slot-scope="text">
            <div>
              <a-tag v-if="text == 'archived'">{{ text }}</a-tag>
              <a-tag v-if="text == 'enabled'" color="green">{{ text }}</a-tag>
              <a-tag v-if="text == 'paused'" color="orange">{{ text }}</a-tag>
            </div>
          </template>
        </a-table-column>
        <a-table-column
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
        </a-table-column>
        <a-table-column title="Active keywords count" dataIndex="inactionkw" key="inactionkw">
        </a-table-column>
      
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
                @click="goCampaignRecord(record.campaignId)"
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
        var wa = document.createElement('script'); wa.type = 'text/javascript'; wa.async = true;
        wa.src = 'https://d10lpsik1i8c69.cloudfront.net/w.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wa, s);
      })();
// Danish provided tracking script END

import { keywordChurner, keywordChurnerProfile } from "@/api";

export default {
  name: "keywordchurner",
  data() {
    return {
      campaignList: [],
      loading: true,
      responseError: {},
      selectProfile:"",
      availableProfiles:[],
    };
  },
  methods: {
    getList() {
      keywordChurner()
        .then(response => {
          this.campaignList = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner"});
        });
    },
    getProfilesList(){
      keywordChurnerProfile()
      .then(response => {
          
          this.availableProfiles = response.data;
          this.loading = false;
          console.log(this.availableProfiles);
        })
        .catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          // this.$router.push({ name: "keywordchurner"});
        });
    },
    handleChange(value){
      console.log(value)
      keywordChurner(value)
        .then(response => {
          this.campaignList = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner"});
        });
    },

    goCampaignRecord(id) {
      this.$router.push({ name: "keywordcampaigndetails", params: { id } });
    }
  },
  mounted() {
    this.getList();
    this.getProfilesList();
  }
};
</script>
