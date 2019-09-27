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
      <a-select style="width: 300px" placeholder="Select Campaign" v-model="selectCampaign" @change="handleChange2">
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

      <div id="c_1"></div>
      <!-- <a-col :span="5">

            
            <a-tag color="#108ee9">Period: {{periodRange}}</a-tag>
      </a-col> -->
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 10px;"> 
      <div style="width: 300px">
        <label>Real data: </label>
          <a-progress :percent="interpolatedInfo.true *100" size="small" />
      </div>

    </a-row>
    <a-row :gutter="48" style="padding-bottom: 10px;">
        <a-calendar @change="changeCallback" v-model="selectedMonth">
            <ul class="events" style="list-style-type:none;padding-left:10px;" slot="dateCellRender" slot-scope="value" >
              <li v-for="item in getDaysData(value)" :key="item.content">
                <a-badge :status="item.type" :text="item.content" />
              </li>
              
            </ul>
            
            
        </a-calendar>
    </a-row>
  </div>
</template>

<script>

import { SA_profiles, SA_campaigns, SA_get_seasonal } from "@/api";
import moment from 'moment';
import G2 from "@antv/g2";
import { DataSet } from "@antv/data-set";
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
      selectCampaignId:"",
      monthBudget: "",
      calendarData:[],
      calendarMonth: moment().month(),
      periodData:[],
      chart1: null,
      interpolatedInfo: "",
      selectedMonth: moment(),
      c_1Data: [{
        item: '事例一',
        count: 40,
        percent: 0.4
      }, {
        item: '事例二',
        count: 21,
        percent: 0.21
      }, {
        item: '事例三',
        count: 17,
        percent: 0.17
      }, {
        item: '事例四',
        count: 13,
        percent: 0.13
      }, {
        item: '事例五',
        count: 9,
        percent: 0.09
      }],
    };
  },
  methods: {
    ChartFunction(data) {
      console.log(data)
      this.chart1 && this.chart1.destroy();
      this.chart1 = new G2.Chart({
        container: "c_1",
        height: 350,
        padding: "auto",
        forceFit: true,
        animate: false
      });
      this.chart1.source(data);
      this.chart1.coord('theta', {
        radius: 0.8,
        innerRadius: 0.6  
      });
      this.chart1.tooltip({
        showTitle: false,
      });
      this.chart1.guide().html({
        position: ['50%', '50%'],
        html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">Period<br><span style="color:#8c8c8c;font-size:20px">'+ data.length +'</span></div>',
        alignX: 'middle',
        alignY: 'middle'
      });
      var interval = this.chart1.intervalStack().position('percent').color('periodic_num').label('percent', {
        formatter: function formatter(val, item) {
          return item.point.periodic_num + ': ' + val +'%';
        }
      }).tooltip('allocate_budget*percent', function(allocate_budget, percent) {
        return {
          name: allocate_budget,
          value: percent
        };
      }).style({
        lineWidth: 1,
        stroke: '#fff'
      });
      this.chart1.render();
      interval.setSelected(data[0]);
    },
    changeCallback(date){
      console.log(this.selectedMonth.month())
    },
    getSeasonalAnalysis(){
        
        SA_get_seasonal({
            campaignId: this.selectCampaignId,
            monthBudget: this.monthBudget,
            month: this.selectedMonth.format('YYYY-MM-DD'),
        }).then(response => {
          console.log(response.data);
          if(response.status === 200){
            this.calendarData = response.data.days_data;
            this.calendarMonth = parseInt(response.data.month, 10);
            this.periodData = response.data.period_data;
            this.interpolatedInfo = response.data.interpolated_info;
            this.loading = false;
            this.ChartFunction(this.periodData);
          }else{
            this.calendarData = [];
            this.$message.warning(response.data.msg);
          }
      })

    },
    getDaysData(value){
        let showdata = Array();
        let day_num = value.date() - 1
        console.log(value.month())
        if(value.month() === this.calendarMonth-1)
        if(this.calendarData && this.calendarData.length){
            if(this.calendarData[day_num].cost)
                showdata.push({ type: 'warning', content: 'Cost:' + this.calendarData[day_num].cost.toFixed(1)});
            else if(this.calendarData[day_num].allocate_budget)
                showdata.push({ type: 'processing', content:'Allocate budget:' + this.calendarData[day_num].allocate_budget.toFixed(1)});
            if(this.calendarData[day_num].predicted_percent)
              showdata.push({ type: 'success', content: 'Predicted percent:' + this.calendarData[day_num].predicted_percent.toFixed(1) + '%'});
            if(this.calendarData[day_num].actual_percent)
              showdata.push({ type: 'default', content: 'Actual percent:' + this.calendarData[day_num].actual_percent.toFixed(1) + '%'});
        }
        return showdata || []
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
          this.selectCampaign = "";
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
        this.periodData = [];
        console.log(this.selectCampaign)
        this.selectCampaignId = this.availableCampaigns[this.selectCampaign].campaignId;
        this.monthBudget = this.availableCampaigns[this.selectCampaign].monthly_budget;
        // if(!this.periodData) {
        //   const chartElement = document.getElementById('c_1');
        //   chartElement.remove();
        // }
    }
  },
  mounted() {
    this.getProfilesList();
  }
}
</script>
