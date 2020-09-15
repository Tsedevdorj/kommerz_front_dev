<template>
  <div class="drift">
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
      <a-col :span="8">
        <label>Brand: </label>
        <a-input
          name="brand"
          v-validate="{ required: true }"
          style="width: 200px"
          v-model="drift.brand"
          placeholder="Enter Brand"
        >
        </a-input>
        <span style="color: red">{{ errors.first("brand") }}</span>
      </a-col>
      <a-col :span="8">
        <label>Product: </label>
        <a-input
          name="product"
          v-validate="{ required: true }"
          style="width: 200px"
          v-model="drift.product"
          placeholder="Enter Product"
        >
        </a-input>
        <span style="color: red">{{ errors.first("product") }}</span>
      </a-col>
      <a-col :span="8">
        <label>Market: </label>
        <a-select
          name="select_market"
          v-validate="{ required: true }"
          style="width: 250px"
          v-model="drift.market"
          placeholder="Select Market"
        >
          <a-select-option value="jp">Japan</a-select-option>
          <a-select-option value="in">India</a-select-option>
          <a-select-option value="au">Australia</a-select-option>
        </a-select>
        <span style="color: red">{{ errors.first("select_market") }}</span>
      </a-col>
    </a-row>
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
      <a-col :span="8">
        <a-button
          type="primary"
          style="margin-top: 20px; width: 150px"
          @click="runDrift"
          :loading="confirmSend"
          >Run Drift</a-button
        >
      </a-col>
    </a-row>

    <a-row>
      <vue-word-cloud
        style="
    height: 480px;
    width: 640px;
  "
        :words="driftData"
        :color="
          ([, weight]) =>
            weight > 10 ? 'DeepPink' : weight > 5 ? 'RoyalBlue' : 'Indigo'
        "
        font-family="Roboto"
      >
        <template slot-scope="{ text, weight, word }">
          <div
            :title="weight"
            style="cursor: pointer;"
            @click="onWordClick(word)"
          >
            {{ text }}
          </div>
        </template>
      </vue-word-cloud>
    </a-row>
    <a-row>
      <a-descriptions title="Topic representative review" bordered>
        <a-descriptions-item label="Title" :span="3">
          {{ representative_sent.review_title }}
        </a-descriptions-item>
        <a-descriptions-item label="Text">
          {{ representative_sent.review_text }}
        </a-descriptions-item>
      </a-descriptions>
    </a-row>
  </div>
</template>

<script>
import {
  list_basic_profiles,
  get_search_keywords,
  post_search_keywords,
  review_crawler_get
} from "@/api";
// import driftData from "@/assets/data/drift_data.json";
import VueWordCloud from "vuewordcloud";
import moment from "moment";
moment.locale("ja");

export default {
  name: "drift",
  components: {
    [VueWordCloud.name]: VueWordCloud
  },
  data() {
    return {
      driftData: [],
      representative_sent: { review_title: "", review_text: "" },
      addKeywordToggle: false,
      availableGroupingIds: [],
      availableGroupingJson: [],
      availableProfiles: [],
      loading: false,
      selectPortfolio: "",
      drift: {
        brand: "",
        product: "",
        market: ""
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
    runDrift() {
      if (this.errors.items.length === 0) {
        this.confirmSend = true;
        review_crawler_get(this.drift)
          .then(response => {
            console.log(response);
            this.driftData = response.data;
            this.confirmSend = false;
          })
          .catch(error => {
            this.confirmSend = false;
            this.responseError = error.response.msg;
            this.$message.error("Error: " + this.responseError);
            // this.confirmSend = false;
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
    },
    onWordClick(word) {
      this.representative_sent = word[2];
      console.log(word);
    }
  }
  //   mounted() {
  //     this.list_profiles();
  //   }
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
