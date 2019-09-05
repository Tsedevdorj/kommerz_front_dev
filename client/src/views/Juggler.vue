<template>
  <div class="juggler">
    <a-row :gutter="48" style="padding-bottom: 10px;">
    <a-col :span="7">
        <label>Account: </label>
        <a-select style="width: 250px" placeholder="Select Account" @change="handleChange">
            <a-select-option v-for="item in availableProfiles" :key="item.profileId" :value="item.profileId">{{item.accountName}}</a-select-option>
        </a-select>
    </a-col>
    <a-col :span="7">
    <label>Portfolios: </label>
    <a-select style="width: 250px" placeholder="Select Portfolio" @change="handleChange2">
        <a-select-option v-for="item in availablePortfolios" :key="item.portfolioId" :value="item.portfolioId">{{item.name}}</a-select-option>
        </a-select>
    </a-col>
 
    </a-row>
    <a-row
          :gutter="32"
          style="padding: 0 16px 16px 16px"
        >
        
        <a-col :span="5">
        <label>Target Budget CPA: </label>
        <a-input v-model="portfolioTarget.targetBudget" placeholder="Not found" />

        </a-col>

        <a-col :span="8">
          <label> Target start date: </label>
          <a-range-picker
                name="target_date"
                v-validate.initial="{required: true}"
                v-model="portfolioTarget.targetDateRange"
                :format="targetDateFormat"
                >
                <span style="color: red">{{ errors.first("target_date") }}</span>
                <template slot="renderExtraFooter">
                    extra footer
                </template>
            </a-range-picker>
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
            :scroll="{ y: 240 }"
        >
            <a-table-column
            title="Campaign"
            dataIndex="Campaign"
            key="Campaign"
            :width=200
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
            title="CPO"
            dataIndex="CPO"
            key="CPO"
            :width=200
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
            <a-table-column
            title="Vol"
            dataIndex="Vol"
            key="Vol"
            :width=200
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
            <a-table-column
            title="Recommended Budget"
            dataIndex="remaining_budget_allocation"
            key="remaining_budget_allocation"
            :width=200
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
            <a-table-column
            title="Initial Budget"
            dataIndex="init_budget_allocation"
            key="init_budget_allocation"
            :width=200
            >
            <template slot-scope="text">
                {{ truncate_float(text) }}
            </template>
            </a-table-column>
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
            targetDateFormat:"YYYY-MM-DD",
            TargetAvail: false,
            confirmSend: false,
            responseError:"",
            selectPortfolioId:"",
            portfolioTable: [],
            tableLoading: false,
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
            
            Juggler_list_portfolios(value)
                .then(response => {
                this.availablePortfolios = response.data;
                this.selectPortfolioId = "";
                this.loading = false;
                })

        },
        createNewTarget(){
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
                }).then(response =>{
                    console.log('test', response.data)
                    this.portfolioTable = response.data.response;
                    this.tableLoading=false;
        
                    }).catch(error => {
                        this.responseError = error.response.data.msg;
                        this.$message.error("Error: " + this.responseError);
                        this.tableLoading=false;
                    });
                }).catch(error => {
                    this.responseError = error.response.data.msg;
                    this.$message.error("Error: " + this.responseError);
                });
            
        },
        handleChange2(value){
            this.portfolioTarget= {};
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
            //     .catch(error => {
            //   this.responseError = error.response.data.msg;
            //   this.$message.error("Error: " + this.responseError);
            //   this.confirmSend = false;
            // });

        },
        modifyTarget(){
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
                }).then(response =>{
                    console.log('test', typeof(response.data))
                    this.portfolioTable = response.data.response;
                    this.tableLoading=false;
        
                    }).catch(error => {
                        this.responseError = error.response.data.msg;
                        this.$message.error("Error: " + this.responseError);
                        this.tableLoading=false;
                    });
                }).catch(error => {
                    this.responseError = error.response.data.msg;
                    this.$message.error("Error: " + this.responseError);
                });
            this.tableLoading=true;
            
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

</style>