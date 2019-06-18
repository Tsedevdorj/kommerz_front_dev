<template>
  <div class="keywordcampaigndetail">
    <a-collapse
      defaultActiveKey="1"
      :bordered="false"
      style="padding-bottom: 40px;"
    >
      <a-collapse-panel header="Unfavourable" key="1">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Unfavourable"
          size="small"
          :loading="loading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
          >
            <template slot-scope="text">
              {{ truncate_str(text, 6) }}
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost">
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions">
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks">
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO">
            <template slot-scope="text">
              <div v-if="text == null">
                Infinite
              </div>
              <div else>
                {{ text }}
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="Sales"
            dataIndex="attributedSales1d"
            key="attributedSales1d"
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROS" key="ROS">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column
            title="Flag"
            dataIndex="recommendPause"
            key="recommendPause"
          >
            <template slot-scope="text">
              <a-tag v-if="text == true">
                RP
              </a-tag>
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
                  size="small"
                  @click="goCampaignRecord(record.campaignId)"
                  ghost
                  icon="forward"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Watchlist" key="2">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Watchlist"
          size="small"
          :loading="loading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
          >
            <template slot-scope="text">
              {{ truncate_str(text, 6) }}
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost">
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions">
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks">
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO">
            <template slot-scope="text">
              <div v-if="text == null">
                Infinite
              </div>
              <div else>
                {{ text }}
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="Sales"
            dataIndex="attributedSales1d"
            key="attributedSales1d"
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROS" key="ROS">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column
            title="Flag"
            dataIndex="coefficientVariance"
            key="coefficientVariance"
          >
            <template slot-scope="text">
              <a-tag v-if="text > 1" color="red">
                A
              </a-tag>
              <a-tag v-else>
                P
              </a-tag>
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
                  size="small"
                  @click="goCampaignRecord(record.campaignId)"
                  ghost
                  icon="forward"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Favourable" key="3">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Favourable"
          size="small"
          :loading="loading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
          >
            <template slot-scope="text">
              {{ truncate_str(text, 6) }}
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost">
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions">
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks">
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO">
            <template slot-scope="text">
              <div v-if="text == null">
                Infinite
              </div>
              <div else>
                {{ text }}
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="Sales"
            dataIndex="attributedSales1d"
            key="attributedSales1d"
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROS" key="ROS">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
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
                  size="small"
                  @click="goCampaignRecord(record.campaignId)"
                  ghost
                  icon="forward"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Immature" key="4">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Immature"
          size="small"
          :loading="loading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
          >
            <template slot-scope="text">
              {{ truncate_str(text, 6) }}
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost">
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions">
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks">
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO">
            <template slot-scope="text">
              <div v-if="text == null">
                Infinite
              </div>
              <div else>
                {{ text }}
              </div>
            </template>
          </a-table-column>
          <a-table-column
            title="Sales"
            dataIndex="attributedSales1d"
            key="attributedSales1d"
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROS" key="ROS">
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
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
                  size="small"
                  @click="goCampaignRecord(record.campaignId)"
                  ghost
                  icon="forward"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
// @ is an alias to /src

import { keywordReport } from "@/api";

export default {
  name: "keywordcampaigndetail",
  data() {
    return {
      campaignID: "",
      campaignCPA: "",
      dateRange: "",
      campaignDetail: {
        Favourable: [],
        Immature: [],
        Unfavourable: [],
        Watchlist: []
      },
      loading: true,
      responseError: {}
    };
  },
  methods: {
    getCampaignDetail() {
      keywordReport({
        campaignId: this.campaignID,
        CPA: this.campaignCPA || "CPO",
        dateRange: this.dateRange || 7
      })
        .then(response => {
          this.loading = false;
          this.campaignDetail.Favourable = response.data.Favourable;
          this.campaignDetail.Immature = response.data.Immature;
          this.campaignDetail.Unfavourable = response.data.Unfavourable;
          this.campaignDetail.Watchlist = response.data.Watchlist;
        })
        .catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
        });
    },
    truncate_str(value, length) {
      return value.length > length ? value.substr(0, length) + "..." : value;
    },
    truncate_float(value) {
      if (value == null) return "INF";
      else return value.toFixed(2);
    }
  },
  mounted() {
    this.campaignID = this.$route.params.id;
    this.getCampaignDetail();
  }
};
</script>

<style>
.arrow {
  line-height: 0 !important;
}
.ant-table-body {
  margin: 0 !important;
}
</style>
