<template>
  <div class="juggler">
    <a-row :gutter="32" style="padding: 0 16px 16px 16px">
    <a-col :span="8">
        <label>Account: </label>
        <a-select name="select_account" v-validate="{required: true}" style="width: 250px" v-model="selectProfileId" placeholder="Select Account" @change="handleChange">
            <a-select-option v-for="item in availableProfiles" :key="item.profileId" :value="item.profileId">{{item.accountName}}</a-select-option>
        </a-select>
        <span style="color: red">{{ errors.first("select_account") }}</span>
    </a-col>
    <a-col :span="8">
    <label>Portfolios: </label>
    <a-select name="select_portfolio" v-validate="{required: true}" style="width: 250px" v-model="selectPortfolioId" placeholder="Select Portfolio" @change="handleChange2">
        <a-select-opt-group >
          <span slot="label">Active</span>
          <a-select-option v-for="item in availablePortfolios" :key="item.portfolioId" v-if="item.active_camp" :value="item.portfolioId">{{item.name}}</a-select-option>
        </a-select-opt-group>
        <a-select-opt-group>
          <span slot="label">Inactive</span>
          <a-select-option v-for="item in availablePortfolios" :key="item.portfolioId" v-if="!item.active_camp" :value="item.portfolioId">{{item.name}}</a-select-option>
        </a-select-opt-group>
      </a-select>
      <span style="color: red">{{ errors.first("select_portfolio") }}</span>
    </a-col>
 
    </a-row>
    <a-row
          :gutter="32"
          style="padding: 0 16px 16px 16px"
        >
        
        <a-col :span="8">
        <label>Target Budget: </label>
        <a-input name="target_budget" v-validate="{required: true}" style="width: 250px" v-model="portfolioTarget.targetBudget" placeholder="Not found" />
        <span style="color: red">{{ errors.first("target_budget") }}</span>
        </a-col>

        <a-col :span="8">
          <label> Budget date range: </label>
          <a-range-picker
              name="target_date"
              v-validate="{required: true}"
              v-model="portfolioTarget.targetDateRange"
              :format="targetDateFormat"
              style="width: 250px"
              >
          </a-range-picker>
          <span style="color: red">{{ errors.first("target_date") }}</span>
        </a-col>
        <a-col :span="8">
          <label>Choose Objectives: </label>
          <a-select
            v-model="CPASelect"
            placeholder="Choose Objectives"
            style="width: 250px"
          >
            <a-select-option value="CPM">CPM</a-select-option>
            <a-select-option value="CPC">CPC</a-select-option>
            <a-select-option value="CPO">CPO</a-select-option>
          </a-select>
        </a-col>
    </a-row>
    <a-row
      :gutter="32"
      style="padding: 0 16px 16px 16px"
    >
      <a-col :span="8">
        <a-button v-if="TargetAvail"
          type="primary"
          style="margin-top: 20px; width: 150px"
          @click="modifyTarget"
          :loading="confirmSend"
          >Confirm edit</a-button
        >

        <a-button v-else
          type="primary"
          style="margin-top: 20px; width: 150px"
          @click="createNewTarget"
          :loading="confirmSend"
          >Create New</a-button
        >
      </a-col>
    </a-row>
    <a-row>
        <a-table
            :rowKey="record => record.Campaign"
            :dataSource="portfolioTable"
            size="small"
            :loading="tableLoading"
            :scroll="{ y: 0 }"
        >
            <a-table-column
            title="Campaign"
            dataIndex="Campaign"
            key="Campaign"
            :width=150
            >
            <template slot-scope="text">
                {{ text }}
            </template>
            </a-table-column>

            <a-table-column
            title="Campaign Name"
            dataIndex="campaignName"
            key="campaignName"
            :width=200
            >

            <template slot-scope="text">
                {{ text }}
            </template>
            </a-table-column>
            <a-table-column
            title="CPA"
            dataIndex="CPA"
            key="CPA"
            :width=150
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
            <a-table-column
            title="Vol"
            dataIndex="Vol"
            key="Vol"
            :width=150
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
            <a-table-column
            title="Recommended Budget"
            dataIndex="remaining_budget_allocation"
            key="remaining_budget_allocation"
            :width=150
            >
            <template slot-scope="text, record">
                <div>
                    
                    <a-tag color="blue">{{ record.assign_budget_ratio}} %</a-tag>
                    <p style="color:rgba(0, 0, 0, 0.40);font-size:10px">{{ truncate_float(text) }}</p>
                </div>
            </template>
            </a-table-column>
            <a-table-column
            title="Initial Budget"
            dataIndex="monthly_budget"
            key="monthly_budget"
            :width=200
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
        </a-table>
    </a-row>
    <a-row>
        <a-table class="historical_table" size="middle" :rowKey="record => record.campaignId" :loading="tableLoading" :columns="historical_table.columns" :dataSource="historical_table.data" :scroll="{ x: 1350 , y: 300 }">
          <span slot="dates" slot-scope="text">
            <a-tag color="blue">{{text}} %</a-tag>
          </span>
        </a-table>
    </a-row>

  </div>
</template>

<script>
import { Juggler_get_target, Juggler_create_target, Juggler_edit_target, Juggler_budget_optimization, Juggler_list_portfolios, Juggler_list_profiles } from "@/api";
import moment from 'moment';
moment.locale('ja')

export default {
    name: "juggler",
    data() {
        return {
            availablePortfolios: [],
            availableProfiles:[],
            loading:false,
            selectPortfolio: "",
            portfolioTarget:{ 
                targetBudget:"",
                targetDateRange: [],
                userId: "",
            },
            CPASelect: "CPO",
            targetDateFormat:"YYYY-MM-DD",
            TargetAvail: false,
            confirmSend: false,
            responseError:"",
            selectPortfolioId:"",
            selectProfileId:"",
            portfolioTable: [],
            tableLoading: false,
            historical_table:{
                columns:[],
                data:[],
            },
            };
    },

    methods: {
        truncate_float(value) {
        if (value == null) return "N/A";
        else
            return value.toFixed(0);
        },
        get_portfolio_target(portfolioId){
            Juggler_get_target(portfolioId)
            .then(response => {
            
            
            })
        },
        handleChange(value){
            // console.log(value)
            this.portfolioTarget.targetBudget = "";
            this.portfolioTarget.userId = "";
            this.portfolioTarget.targetDateRange = [];
            Juggler_list_portfolios(value)
                .then(response => {
                this.availablePortfolios = response.data;
                this.selectPortfolioId = "";
                this.loading = false;
                })

        },
        createNewTarget(){
          if(this.errors.items.length === 0) {
            this.tableLoading=true;
            Juggler_create_target({
                portfolioId: this.selectPortfolioId,
                targetBudget: this.portfolioTarget.targetBudget,
                targetStartDate: this.portfolioTarget.targetDateRange[0].format('YYYY-MM-DD'),
                targetEndDate: this.portfolioTarget.targetDateRange[1].format('YYYY-MM-DD'),
                }).then(response =>{
                // console.log(response.data.msg)
                this.portfolioTarget.targetBudget = response.data.response.targetBudget;
                this.portfolioTarget.userId = response.data.response.userId;
                this.portfolioTarget.targetDateRange =  [moment(response.data.response.targetStartDate, "YYYY-MM-DD"), moment(response.data.response.targetEndDate, "YYYY-MM-DD")];
                this.TargetAvail=true;
                Juggler_budget_optimization({
                portfolioId: this.selectPortfolioId,
                CPA: this.CPASelect,
                }).then(response =>{
                    console.log('test', response.data)
                    this.portfolioTable = response.data.response;
                    this.tableLoading=false;
                    this.historical_table.columns = response.data.historical_columns.map((value, index) =>{
                          if (value === 'campaignId'){
                            return { width: 150, title: value, 
                                dataIndex: value, 
                                key: index};
                          }
                          else{
                            return { width: 150, title: value, 
                                dataIndex: value, 
                                key: index,
                                scopedSlots: { customRender: 'dates' },};
                          }
                    });
                    this.historical_table.data = response.data.historical;
        
                    }).catch(error => {
                        this.responseError = error.response.data.msg;
                        this.$message.error("Error: " + this.responseError);
                        this.tableLoading=false;
                    });
                }).catch(error => {
                    this.responseError = error.response.data.msg;
                    this.$message.error("Error: " + this.responseError);
                });
          }
          else {
            this.$message.error("Please fill required fields of the form. " )

          }
        },
        handleChange2(value){
            this.portfolioTarget.targetBudget = "";
            this.portfolioTarget.userId = "";
            this.portfolioTarget.targetDateRange = [];
            this.TargetAvail =false;
            this.confirmSend = true;
            this.selectPortfolioId = value;
            Juggler_get_target(value)
            .then(response => {

                if (response.data != null){
                this.portfolioTarget.targetBudget = response.data.targetBudget;
                this.portfolioTarget.userId = response.data.userId;
                this.portfolioTarget.targetDateRange =  [moment(response.data.targetStartDate, "YYYY-MM-DD"),  moment(response.data.targetEndDate, "YYYY-MM-DD")];
                this.TargetAvail =true;
                }
                this.loading = false;
                this.confirmSend = false;
                
                // console.log(this.portfolioTarget)
                })
                .catch(error => {
              this.responseError = error.response.data.msg;
              this.$message.error("Error: " + this.responseError);
              this.confirmSend = false;
            });

        },
        modifyTarget(){
          if(this.errors.items.length === 0) {
            Juggler_edit_target({
                portfolioId: this.selectPortfolioId,
                targetBudget: this.portfolioTarget.targetBudget,
                targetStartDate: this.portfolioTarget.targetDateRange[0].format('YYYY-MM-DD'),
                targetEndDate: this.portfolioTarget.targetDateRange[1].format('YYYY-MM-DD'),
                }).then(response =>{
                // console.log(response.data.msg)
                this.portfolioTarget.targetBudget = response.data.response.targetBudget;
                this.portfolioTarget.userId = response.data.response.userId;
                this.portfolioTarget.targetDateRange=  [moment(response.data.response.targetStartDate, "YYYY-MM-DD"),moment(response.data.response.targetEndDate, "YYYY-MM-DD")];
                this.TargetAvail=true;
                Juggler_budget_optimization({
                    portfolioId: this.selectPortfolioId,
                    CPA: this.CPASelect,
                }).then(response =>{
                    console.log('test', typeof(response.data))
                    this.portfolioTable = response.data.response;
                    this.tableLoading=false;
                    this.historical_table.columns = response.data.historical_columns.map((value, index) =>{
                        if (value === 'campaignId'){
                            return { width: 150, title: value, 
                                dataIndex: value, 
                                key: index};
                          }
                          else{
                            return { width: 150, title: value, 
                                dataIndex: value, 
                                key: index,
                                scopedSlots: { customRender: 'dates' },};
                          }
                    });
                    this.historical_table.data = response.data.historical;
        
        
                    })
                    .catch(error => {
                        this.responseError = error.response.data.msg;
                        this.$message.error("Error: " + this.responseError);
                        this.tableLoading=false;
                    });
                })
                .catch(error => {
                    this.responseError = error.response.data.msg;
                    this.$message.error("Error: " + this.responseError);
                });
            this.tableLoading=true;
          }
          else {
            this.$message.error("Please fill required fields of the form. " )

          }
        },

        list_profiles(){
            Juggler_list_profiles()
            .then(response => {
                this.availableProfiles = response.data;
                this.loading = false;
                })
        }

    },
    mounted() {

        this.list_profiles();
    }

}
</script>

<style>
  .ant-table td { white-space: nowrap; }
  .historical_table td {
    width: 150px!important;
    padding-left: 10px!important;
  }
  .historical_table td:first {
    padding-left: 8px;
  }
</style>