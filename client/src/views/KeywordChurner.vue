<template>
  <div class="keywordchurner">
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
      <a-table-column title="Name" dataIndex="name" key="name">
      </a-table-column>
      <a-table-column title="Start Date" dataIndex="startDate" key="startDate">
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
  </div>
</template>

<script>
// @ is an alias to /src

import { keywordChurner } from "@/api";

export default {
  name: "keywordchurner",
  data() {
    return {
      campaignList: [],
      loading: true,
      responseError: {}
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
        });
    },
    goCampaignRecord(id) {
      this.$router.push({ name: "keywordcampaigndetails", params: { id } });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
