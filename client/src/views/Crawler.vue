<template>
  <div class="crawler">
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
      <a-col :span="8">
        <label>Account: </label>
        <a-select
          name="select_account"
          v-validate="{ required: true }"
          style="width: 250px"
          v-model="crawler.selectedProfileId"
          placeholder="Select Account"
          @change="handleChange"
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
      <a-col :span="8">
        <label>Ranking Report Type: </label>
        <a-select
          name="report_type"
          v-validate="{ required: true }"
          style="width: 250px"
          v-model="crawler.selectedReportType"
          placeholder="Select Report Type"
        >
          <a-select-option value="brand_products">
            My Brand Products
          </a-select-option>
          <a-select-option value="brand_competition">
            Brand vs Competition
          </a-select-option>
          <a-select-option value="overall_ranking">
            Overall Ranking
          </a-select-option>
        </a-select>
        <span style="color: red">{{ errors.first("report_type") }}</span>
      </a-col>
    </a-row>
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
      <a-col :span="8">
        <label>Choose a Keyword: </label>
        <a-select
          name="keyword"
          v-validate="{ required: true }"
          style="width: 250px"
          v-model="crawler.selectedSearchKeywordId"
          placeholder="Select Keyword"
        >
          <a-select-option
            v-for="item in availableKeywords"
            :key="item.id"
            :value="item.id"
            >{{ item.keywordText }}</a-select-option
          >
        </a-select>

        <span style="color: red">{{ errors.first("keyword") }}</span>
      </a-col>

      <a-col :span="8">
        <label> Date range: </label>
        <a-range-picker
          name="target_date"
          v-validate="{ required: true }"
          v-model="crawler.selectedDateRange"
          :format="targetDateFormat"
          style="width: 250px"
        >
        </a-range-picker>
        <span style="color: red">{{ errors.first("target_date") }}</span>
      </a-col>
      <a-col :span="8">
        <label>Choose Period Of The Day: </label>
        <a-select
          v-model="crawler.selectedPeriod"
          placeholder="Choose Period"
          style="width: 250px"
        >
          <a-select-option value="overnight">Overnight</a-select-option>
          <a-select-option value="early_morning">Early Morning</a-select-option>
          <a-select-option value="morning">Morning</a-select-option>
          <a-select-option value="afternoon">Afternoon</a-select-option>
          <a-select-option value="evening">Evening</a-select-option>
          <a-select-option value="late_evening">Late Evening</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
      <a-col :span="8">
        <a-button
          type="primary"
          style="margin-top: 20px; width: 150px"
          @click="getCrawlerReport"
          :loading="confirmSend"
          >Crawler Report</a-button
        >
      </a-col>
    </a-row>
    <a-row>
      <a-table
        class="table"
        size="middle"
        :loading="tableLoading"
        :columns="table.columns"
        :dataSource="table.data"
        :pagination="false"
        :scroll="{ x: 1500, y: 400 }"
      >
        <span slot="paid" slot-scope="text">
          <a-tag v-if="text" color="red"> paid </a-tag>
          <a-tag v-else color="blue"> organic </a-tag>
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import {
  list_basic_profiles,
  crawler_report_get,
  get_search_keywords
} from "@/api";
import moment from "moment";
moment.locale("ja");

export default {
  name: "crawler",
  data() {
    return {
      availableKeywords: [],
      availableProfiles: [],
      loading: false,
      selectPortfolio: "",
      crawler: {
        selectedProfileId: "",
        selectedReportType: "",
        selectedSearchKeywordId: "",
        selectedDateRange: [],
        selectedPeriod: ""
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
        columns: [],
        data: []
      }
    };
  },

  methods: {
    bool_to_str(value) {
      if (value) return "paid";
      else if (value) return "organic";
    },
    truncate_float(value) {
      if (value == null) return "N/A";
      else return value.toFixed(0);
    },
    handleChange(value) {
      this.crawler.selectedSearchKeywordId = "";
      this.crawler.selectedReportType = "";
      this.crawler.selectedPeriod = "";
      this.crawler.targetDateRange = [];
      this.crawler.selectedProfileId = value;
      this.confirmSend = true;
      // this.loading = true;
      get_search_keywords({
        profileId: this.crawler.selectedProfileId
      }).then(response => {
        this.availableKeywords = response.data.data;
        this.loading = false;
        this.confirmSend = false;
      });
    },
    getCrawlerReport() {
      if (this.errors.items.length === 0) {
        this.tableLoading = true;
        crawler_report_get({
          profileId: this.crawler.selectedProfileId,
          reportType: this.crawler.selectedReportType,
          searchKeywordId: this.crawler.selectedSearchKeywordId,
          startDate: this.crawler.selectedDateRange[0].format("YYYY-MM-DD"),
          endDate: this.crawler.selectedDateRange[1].format("YYYY-MM-DD"),
          period: this.crawler.selectedPeriod
        })
          .then(response => {
            // console.log(response.data.msg)
            this.tableLoading = false;
            this.table.columns = response.data.data.table_columns.map(
              (value, index) => {
                // if (index === 0 || index === 1){
                //   return {
                //     width: 200,
                //     title: value,
                //     dataIndex: value,
                //     key: index,
                //     ellipsis: true,
                //     fixed: 'left'
                //   }
                // }
                if (value === "label" || value === "keywordText") {
                  return {
                    width: 150,
                    title: value,
                    dataIndex: value,
                    key: index,
                    ellipsis: true
                  };
                } else if (value === "paid") {
                  return {
                    width: 150,
                    title: value,
                    dataIndex: value,
                    key: index,
                    scopedSlots: { customRender: "paid" }
                  };
                } else {
                  return {
                    width: 150,
                    title: value,
                    dataIndex: value,
                    key: index
                  };
                }
              }
            );
            this.table.data = response.data.data.table_data;
          })
          .catch(error => {
            this.responseError = error.response.data.msg;
            this.$message.error("Error: " + this.responseError);
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
