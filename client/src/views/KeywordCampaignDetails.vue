<template>
  <div class="keywordcampaigndetail">
    <a-row style="padding: 16px">
      <h2>Campaign ID: {{ campaignID }}</h2>
      <a-col :span="4">
        <a-popover title="Title">
          <template slot="content">
            <p>Content</p>
          </template>
          <a-button type="primary" @click="addCampaignTargetEvent"
            >Add Campaign Targets</a-button
          >
        </a-popover>
      </a-col>
      <a-col :span="6">
        <a-button type="dashed" @click="setCampaignCPA(campaignCPA)"
          >Recommended Objective: {{ campaignCPA }}</a-button
        >
      </a-col>
      <a-col :span="13">
        <label>Select Period: </label>
        <a-select
          placeholder="Select Period"
          style="width: 30%; padding-right: 10px;"
          v-model="dateRange"
        >
          <a-select-option value="7">7 days</a-select-option>
          <a-select-option value="14">14 days</a-select-option>
          <a-select-option value="30">30 days</a-select-option>
        </a-select>
        <label>Choose Objectives: </label>
        <a-select
          v-model="campaignCPASelect"
          placeholder="Choose Objectives"
          style="width: 30%;"
        >
          <a-select-option value="CPM">CPM</a-select-option>
          <a-select-option value="CPC">CPC</a-select-option>
          <a-select-option value="CPO">CPO</a-select-option>
          <a-select-option value="ROS">ROAS</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1">
        <a-button shape="circle" icon="reload" @click="getCampaignDetail" />
      </a-col>
    </a-row>
    <a-row
      v-if="addCampaignTarget"
      :gutter="32"
      style="padding: 0 16px 16px 16px"
    >
      <a-col :span="12">
        <a-input placeholder="Target Order" v-model="targetOrder"></a-input>
        <a-button
          type="primary"
          style="margin-top: 16px;"
          @click="requestRecommenendObjective"
          :loading="confirmSend"
          >Send</a-button
        >
      </a-col>
      <a-col :span="12">
        <a-button type="dashed" color="red" @click="closeCampaignTargetEvent"
          ><a-icon type="close"
        /></a-button>
      </a-col>
    </a-row>
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
              <div else>
                {{ truncate_float(text) }}
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
          <a-table-column title="Trend" dataIndex="trend" key="trend">
            <template slot-scope="text">
              <a-tag v-if="text === null" >
                N/A
              </a-tag>
              <template v-else>
                <a-icon v-if="text > 0" type="caret-up" style="color:green"/>
                <a-icon v-else type="caret-down" style="color:red"/>
                {{ text.toFixed(1) }}
              </template>
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
            title="suggestedBid"
            dataIndex="suggestedBid"
            key="suggestedBid"
          >
            <template slot-scope="text">
              <a-tag v-if="text === undefined || text.length == 0">
                No suggestion
              </a-tag>

              <a-select v-else style="width: 100px" @change="handleChange">
                <a-select-option v-for="item in text" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
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
                <a-button
                  type="danger"
                  size="small"
                  ghost
                  icon="delete"
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
              <div else>
                {{ truncate_float(text) }}
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
          <a-table-column title="Trend" dataIndex="trend" key="trend">
            <template slot-scope="text">
              <a-tag v-if="text === null" >
                N/A
              </a-tag>
              <template v-else>
                <a-icon v-if="text > 0" type="caret-up" style="color:green"/>
                <a-icon v-else type="caret-down" style="color:red"/>
                {{ text.toFixed(1) }}
              </template>
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
            title="suggestedBid"
            dataIndex="suggestedBid"
            key="suggestedBid"
          >
            <template slot-scope="text">
              <a-tag v-if="text === undefined || text.length == 0">
                No suggestion
              </a-tag>

              <a-select v-else style="width: 100px" @change="handleChange">
                <a-select-option v-for="item in text" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
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
                <a-button
                  type="danger"
                  size="small"
                  ghost
                  icon="delete"
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
              <div else>
                {{ truncate_float(text) }}
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
          <a-table-column title="Trend" dataIndex="trend" key="trend">
            <template slot-scope="text">
              <a-tag v-if="text === null" >
                N/A
              </a-tag>
              <template v-else>
                <a-icon v-if="text > 0" type="caret-up" style="color:green"/>
                <a-icon v-else type="caret-down" style="color:red"/>
                {{ text.toFixed(1) }}
              </template>
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column
            title="suggestedBid"
            dataIndex="suggestedBid"
            key="suggestedBid"
          >
            <template slot-scope="text">
              <a-tag v-if="text === undefined || text.length == 0">
                No suggestion
              </a-tag>

              <a-select v-else style="width: 100px" @change="handleChange">
                <a-select-option v-for="item in text" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
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
                <a-button
                  type="danger"
                  size="small"
                  ghost
                  icon="delete"
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
              <div else>
                {{ truncate_float(text) }}
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
                  type="danger"
                  size="small"
                  ghost
                  icon="delete"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Recommended Keywords" key="5">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.recommendedKeywords.data"
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
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Recommended Keywords from similar campaigns" key="6">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.recommendedKeywordsFromSimilarCampaign.data"
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
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="suggestedBid.suggested" key="suggestedBid.suggested">
          </a-table-column>
        </a-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
// @ is an alias to /src

import { keywordReport, recommendedKeyword, recommendObjective, recommendedKeywordFromSimilarCampaign } from "@/api";

export default {
  name: "keywordcampaigndetail",
  data() {
    return {
      campaignID: "",
      campaignCPA: "CPO",
      campaignCPASelect: "CPO",
      dateRange: "7",
      targetOrder: "",
      addCampaignTarget: false,
      confirmSend: false,
      campaignDetail: {
        Favourable: [],
        Immature: [],
        Unfavourable: [],
        Watchlist: [],
        recommendedKeywords: [],
        recommendedKeywordsFromSimilarCampaign: []
      },
      loading: true,
      responseError: {}
    };
  },
  methods: {
    getCampaignDetail() {
      this.loading = true;
      keywordReport({
        campaignId: this.campaignID,
        CPA: this.campaignCPASelect || "CPO",
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
    },
    getRecommendedKeyword() {
      recommendedKeyword({
        campaignId: this.campaignID
      }).then(response => {
        this.campaignDetail.recommendedKeywords = response;
      });
    },
    getRecommendedKeywordFromSimilarCampaigns(){
      recommendedKeywordFromSimilarCampaign({
        campaignId: this.campaignID,
        CPA: this.campaignCPA,
        dateRange: this.dateRange || 7
      }).then(response => {
        this.campaignDetail.recommendedKeywordsFromSimilarCampaign = response;
      });
    },
    addCampaignTargetEvent() {
      this.addCampaignTarget = true;
    },
    closeCampaignTargetEvent() {
      this.addCampaignTarget = false;
    },
    requestRecommenendObjective() {
      this.confirmSend = true;
      recommendObjective({
        campaignId: this.campaignID,
        targetOrder: this.targetOrder
      }).then(response => {
        this.confirmSend = false;
        this.loading = true;
        this.addCampaignTarget = false;
        this.campaignCPA = response.data;
        keywordReport({
          campaignId: this.campaignID,
          CPA: this.campaignCPA,
          dateRange: this.dateRange || 7
        }).then(() => {
          this.loading = false;
          this.$message.success(
            "Successfully set recommended objective to: " + this.campaignCPA
          );
        });
      });
    },
    setCampaignCPA(value) {
      this.campaignCPASelect = value;
    }
  },
  mounted() {
    this.campaignID = this.$route.params.id;
    this.getCampaignDetail();
    this.getRecommendedKeyword();
    this.getRecommendedKeywordFromSimilarCampaigns();
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
