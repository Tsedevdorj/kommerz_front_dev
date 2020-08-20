<template>
  <div class="searchkeyword">
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
      <a-col :span="8">
        <label>Account: </label>
        <a-select
          name="select_account"
          v-validate="{ required: true }"
          style="width: 250px"
          v-model="searchKeyword.selectedProfileId"
          placeholder="Select Account"
          @change="fetchSeachKeywordsAndGrouping"
        >
          <a-select-option
            v-for="item in availableProfiles"
            :key="item.profileId"
            :value="item.profileId"
            >{{ item.accountName }}</a-select-option
          >
        </a-select>
        <span style="color: red">{{ errors.first("select_account") }}</span>
      </a-col>
    </a-row>
    <a-collapse >
      <a-collapse-panel key="1" header="Add Keyword">
      <a-row :gutter="32" style="padding: 0 16px 16px 16px">
        <a-col :span="8">
          <label>Enter Keyword Text: </label>
          <a-input
            name="report_type"
            v-validate="{ required: true }"
            style="width: 200px"
            v-model="searchKeyword.selectedKeywordText"
            placeholder="Select Report Type"
          >
          </a-input>
          <span style="color: red">{{ errors.first("report_type") }}</span>
        </a-col>

        <a-col :span="8">
          <label>Choose Match Type: </label>
          <a-select
            name="keyword"
            v-validate="{ required: true }"
            style="width: 200px"
            v-model="searchKeyword.selectedMatchType"
            placeholder="Select Keyword"
          >
            <a-select-option value="exact">Exact</a-select-option>
            <a-select-option value="phrase">Phrase</a-select-option>
            <a-select-option value="broad">Broad</a-select-option>
          </a-select>

          <span style="color: red">{{ errors.first("keyword") }}</span>
        </a-col>

        <a-col :span="8">
          <label> Expire Date: </label>
          <a-date-picker
            name="target_date"
            v-validate="{ required: true }"
            v-model="searchKeyword.selectedExpireDate"
            :format="targetDateFormat"
            style="width: 200px"
          >
          </a-date-picker>
          <span style="color: red">{{ errors.first("target_date") }}</span>
        </a-col>
      </a-row>
      <a-row :gutter="32" style="padding: 0 16px 16px 16px">
        <a-col :span="8">
          <label> Grouping level: </label>
          <a-select
            name="select_grouping"
            style="width: 200px"
            v-model="searchKeyword.selectedGroupingLevel"
            @change="groupingInstance"
            placeholder="Select Grouping Level"
          >
            <a-select-option value="brand">Brand</a-select-option>
            <a-select-option value="asinGroup">Asin Group</a-select-option>
            <a-select-option value="asin">Asin</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="8">
          <label> Grouping Instances: </label>
          <a-select
            mode="multiple"
            style="width: 200px"
            v-model="searchKeyword.selectedGroupingIds"
            placeholder="Please select grouping entries"
          >
            <a-select-option
              v-for="item in availableGroupingIds"
              :key="item.id"
              :value="item.id"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="8">
          <label> Select Market: </label>
          <a-select
            name="select_market"
            style="width: 200px"
            v-model="searchKeyword.selectedMarket"
            placeholder="Select Market"
          >
            <a-select-option value="jp">Japan</a-select-option>
            <a-select-option value="in">India</a-select-option>
            <a-select-option value="us">USA</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row :gutter="32" style="padding: 0 16px 16px 16px">
        <a-col :span="8">
          <a-button
            type="primary"
            style="margin-top: 20px; width: 150px"
            @click="confirmAddKeyword"
            :loading="confirmSend"
            >Confirm add</a-button
          >
        </a-col>
      </a-row>
    </a-collapse-panel>
    </a-collapse>
    <a-row>
      <a-table
        class="table"
        size="middle"
        :loading="tableLoading"
        :columns="table.columns"
        :dataSource="table.data"
        :pagination="false"
        :scroll="{ y: 400 }"
      >
        <span slot="paid" slot-scope="text">
          <a-tag color="blue">{{ text }}</a-tag>
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import {
  list_basic_profiles,
  get_search_keywords,
  post_search_keywords,
  fetch_grouping
} from "@/api";
import moment from "moment";
moment.locale("ja");

export default {
  name: "searchkeyword",
  data() {
    return {
      addKeywordToggle: false,
      availableGroupingIds: [],
      availableGroupingJson: [],
      availableProfiles: [],
      loading: false,
      selectPortfolio: "",
      searchKeyword: {
        selectedProfileId: "",
        selectedKeywordText: "",
        selectedMatchType: "",
        selectedExpireDate: "",
        selectedGroupingLevel: "",
        selectedGroupingIds: [],
        selectedMarket: ""
      },
      CPASelect: "CPO",
      targetDateFormat: "YYYY-MM-DD",
      TargetAvail: false,
      confirmSend: false,
      responseError: "",
      reportType: "",
      selectProfileId: "",
      portfolioTable: [],
      tableLoading: false,
      table: {
        columns: [
          {
            title: "Keyword Text",
            dataIndex: "keywordText",
            key: "keywordText",
            sorter: (a, b) => a.keywordText < b.keywordText
          },
          {
            title: "Match Type",
            dataIndex: "matchType",
            key: "matchType",
            filters: [
              { text: "Exact", value: "exact" },
              { text: "Phrase", value: "phrase" },
              { text: "Broad", value: "broad" }
            ],
            onFilter: (value, record) => record.matchType.includes(value)
          },
          {
            title: "Market",
            dataIndex: "market",
            key: "market"
          },
          {
            title: "expireDate",
            key: "expireDate",
            dataIndex: "expireDate"
          }
        ],
        data: []
      }
    };
  },

  methods: {
    truncate_float(value) {
      if (value == null) return "N/A";
      else return value.toFixed(0);
    },
    groupingInstance(value) {
      var i;
      var j;
      var k;
      this.availableGroupingIds = [];
      if (value === "brand") {
        for (i = 0; i < this.availableGroupingJson.length; i++) {
          this.availableGroupingIds.push(this.availableGroupingJson[i]);
        }
      } else if (value === "asinGroup") {
        for (i = 0; i < this.availableGroupingJson.length; i++) {
          for (j = 0; j < this.availableGroupingJson[i].asinGroups.length; j++)
            this.availableGroupingIds.push(
              this.availableGroupingJson[i].asinGroups[j]
            );
        }
      } else if (value === "asin") {
        for (i = 0; i < this.availableGroupingJson.length; i++) {
          for (j = 0; j < this.availableGroupingJson[i].asinGroups.length; j++)
            for (
              k = 0;
              k < this.availableGroupingJson[i].asinGroups[j].asins.length;
              k++
            )
              this.availableGroupingIds.push(
                this.availableGroupingJson[i].asinGroups[j].asins[k]
              );
        }
      }
    },
    fetchSeachKeywordsAndGrouping(value) {
      this.searchKeyword.selectedProfileId = value;
      this.tableLoading = true;
      // this.loading = true;
      get_search_keywords({
        profileId: this.searchKeyword.selectedProfileId
      }).then(response => {
        this.table.data = response.data.data;
        this.tableLoading = false;
      });
      this.confirmSend = true;
      fetch_grouping({
        profileId: this.searchKeyword.selectedProfileId,
        type: "client"
      }).then(response => {
        this.availableGroupingJson = response.data.data;
        this.confirmSend = false;
      });
    },
    confirmAddKeyword() {
      if (this.errors.items.length === 0) {
        this.confirmSend = true;
        post_search_keywords({
          profileId: this.searchKeyword.selectedProfileId,
          keywordText: this.searchKeyword.selectedKeywordText,
          matchType: this.searchKeyword.selectedMatchType,
          expireDate: this.searchKeyword.selectedExpireDate.format(
            "YYYY-MM-DD"
          ),
          groupingLevel: this.searchKeyword.selectedGroupingLevel,
          groupingIds: this.searchKeyword.selectedGroupingIds,
          market: this.searchKeyword.selectedMarket
        })
          .then(response => {
            console.log(response.data.msg);
            this.confirmSend = false;
          })
          .catch(error => {
            this.responseError = error.response.data.msg;
            this.$message.error("Error: " + this.responseError);
            this.confirmSend = false;
          });
      } else {
        this.$message.error("Please fill required fields of the form. ");
      }
    },

    list_profiles() {
      list_basic_profiles().then(response => {
        this.availableProfiles = response.data.data;
        this.loading = false;
      });
    }
  },
  mounted() {
    this.list_profiles();
  }
};
</script>

<style>
.ant-table td {
  white-space: nowrap;
}
.historical_table td {
  width: 150px !important;
  padding-left: 10px !important;
}
.historical_table td:first {
  padding-left: 8px;
}
</style>
