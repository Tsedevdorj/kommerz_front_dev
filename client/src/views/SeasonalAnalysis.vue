<template>
  <div class="seasonalanalysis">
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :span="7">
      <label>Account: </label>
      <a-select style="width: 250px" placeholder="Select Account" @change="handleChange">
          <a-select-option v-for="item in availableProfiles" :key="item.profileId" :value="item.profileId">{{item.accountName}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8">
      <label>Campaign: </label>
      <a-select style="width: 300px" placeholder="Select Campaign" @change="handleChange2">
          <a-select-option v-for="(item, index) in availableCampaigns" :key="item.campaignId" :value="index">{{item.name}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="7">
        <label>Monthly budget: </label>
            <a-input style="width: 200px" name="month_budget"  placeholder="Budget" addonBefore="¥" v-model="monthBudget"></a-input>
            <span style="color: red">{{ errors.first("month_budget") }}</span>
      </a-col>
      <a-col :span="1">
        <a-button shape="circle" icon="reload" @click="getSeasonalAnalysis" />
      </a-col>
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 10px;"> 
      <a-col :span="5">

            
            <a-tag color="#108ee9">Period: {{periodRange}}</a-tag>
      </a-col>
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 10px;">
        <a-calendar>
            <template slot="dateCellRender" slot-scope="value">

                <section>{{getDaysData(value)}}</section>

            </template>

            
        </a-calendar>
    </a-row>
  </div>
</template>

<script>

import { SA_profiles, SA_campaigns, SA_get_seasonal } from "@/api";
import moment from 'moment';
moment.locale('ja')

export default {
  name: "seasonalanalysis",
  data() {
    return {
      campaignList: [],
      loading: true,
      responseError: {},
      selectProfile:"",
      availableProfiles:[],
      availableCampaigns:[],
      selectCampaign:"",
      monthBudget: "",
      calendarData:[],
      periodRange:"",
    };
  },
  methods: {
    getSeasonalAnalysis(){
        SA_get_seasonal({
            campaignId: this.selectCampaign,
            monthBudget: this.monthBudget,
        }).then(response => {
        console.log(response.data);
        if(response.status === 200){
          this.calendarData = response.data.days_data;
          this.periodRange = response.data.period;
          this.loading = false;
        }else{
          this.calendarData = [];
          this.$message.warning(response.data.msg);
        }
    })

    },
    getDaysData(value){
        let showdata;
        let day_num = value.date() - 1
        if(value.month() === moment().month())
        if(this.calendarData && this.calendarData.length){
            if(this.calendarData[day_num].cost)
                showdata = 'Cost:' + this.calendarData[day_num].cost.toFixed(1);
            else if(this.calendarData[day_num].allocate_budget)
                showdata = 'Allocate budget:' + this.calendarData[day_num].allocate_budget.toFixed(1);
        }
        return showdata || ''
    },
    getProfilesList(){
    SA_profiles()
    .then(response => {
        console.log(response.data);
        
          this.availableProfiles = response.data;
          this.loading = false;
        
    })
    .catch(error => {
        this.responseError = error.response.data.message;
        this.$message.error("Error: " + this.responseError);
        // this.$router.push({ name: "keywordchurner"});
    });
  },
  handleChange(value){
      console.log(value)
      SA_campaigns(value)
        .then(response => {
          this.availableCampaigns = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.availableCampaigns = [];
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner"});

        });
    },
    handleChange2(value){
        console.log(this.availableCampaigns[value])
        this.selectCampaign = this.availableCampaigns[value].campaignId;
        this.monthBudget = this.availableCampaigns[value].monthly_budget;
    }
  },
  mounted() {
    this.getProfilesList();
  }
}
</script>
