<template>
  <div class="keywordcampaigndetail">
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <h2>Campaign Name: {{ campaignInformation.campaignName }} </h2>
        <h5>Campaign ID: {{ campaignID }} </h5>
      </a-col>
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <div style="float:right; margin-bottom: 0.5em;">
          <a-button type="dashed">
          <router-link :to="{ name: 'keywordchurnerin' }"
              ><a-icon type="rollback" />Back</router-link>
          </a-button>
        </div>
      </a-col>
    </a-row>
    <a-row style="padding-bottom: 10px;">
      <a-col :span="4">
      
          <a-button type="primary" @click="showCampaignTargetEvent"
            >Show Campaign Targets</a-button
          >
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
          <a-select-option value="ROAS">ROAS</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1">
        <a-button shape="circle" icon="reload" @click="getCampaignDetail" />
      </a-col>
    </a-row>
    <a-row style="padding-bottom: 10px;">
      <a-col :span="12">
        <a-button type="dashed"
          >Recommended Action: {{ optimizeMsg }}</a-button
        >
      </a-col>
    </a-row>
    <a-row style="padding-bottom: 10px;">
      <a-col :span="12">
        <a-button type="dashed"
          >CPA Historically: {{ CPAMsg }}</a-button
        >
      </a-col>
    </a-row>
    <a-row style="padding-bottom: 10px;">
      <a-col :span="12">
        <a-button type="dashed"
          >Volume Historically: {{ VolumeMsg }}</a-button
        >
      </a-col>
    </a-row>
    
    <a-row v-if="campaignCPASelect==='ROAS'" style="padding-bottom: 10px;">
      <a-col :span="12">
        <a-button type="dashed"
          >ROAS Historically: {{ ROASMsg }}</a-button
        >
      </a-col>
    </a-row>
    <template v-if="showCampaignTarget">
    <label>Target </label>  
    <a-row
      :gutter="32"
      style="padding: 0 16px 16px 16px"
    >
      <a-col :span="4">
        <label>Target Volume: </label>
        <a-input name="target_volume" v-validate.initial="{required: true, regex: /^[0-9]*$/}" placeholder="volume" v-model="campaignTargetDetail.targetOrder"></a-input>
        <span style="color: red">{{ errors.first("target_volume") }}</span>
      </a-col>
      <a-col :span="4">
        <label>Target CPA: </label>
        <a-input name="target_cpa" v-validate.initial="{required: true, regex: /^[0-9]*$/}" placeholder="Target CPO" v-model="campaignTargetDetail.targetCPO"></a-input>
        <span style="color: red">{{ errors.first("target_cpa") }}</span>
      </a-col>
      <a-col :span="4">
        <label>Target Budget: </label>
        <a-input name="target_budget" v-validate.initial="{required: true, regex: /^[0-9]*$/, min_value:campaignTargetDetail.targetOrder*campaignTargetDetail.targetCPO}" placeholder="Budget" v-model="campaignTargetDetail.targetBudget"></a-input>
        <span style="color: red">{{ errors.first("target_budget") }}</span>
      </a-col>
      <a-col :span="4">
        <label>Target ROAS: </label>
        <a-input name="target_roas" v-validate.initial="{required: campaignCPASelect==='ROAS'? true:false, regex: /^[0-9]*$/}" placeholder="ROAS" v-model="campaignTargetDetail.targetROAS" :disabled="campaignCPASelect!=='ROAS'"></a-input>
        <span style="color: red">{{ errors.first("target_roas") }}</span>
      </a-col>
      <a-col :span="8">
        <label>Target Date range: </label>
        <a-range-picker
        name="target_date"
        v-validate.initial="{required: true}"
        v-model="campaignTargetDetail.targetDateRange"
        :disabledDate="disabledDate"
        :format="campaignTargetDetail.targetDateFormat"
        >
        <span style="color: red">{{ errors.first("target_date") }}</span>
          <template slot="renderExtraFooter">
            extra footer
          </template>
        </a-range-picker>
      </a-col>
      
    </a-row>
    <label>Month </label>
      <a-button
          type="primary"
          size="small"
          @click="toggleSameAs"
      >
      {{!checkedsame ? 'Same as target' : 'Fill by myself'}}
      </a-button>
    <a-row
        :gutter="32"
        style="padding: 0 16px 16px 16px"
      >
        <a-col :span="4">
          <label>Month's Volume: </label>
          <a-input name="month_volume" v-validate.initial="{required: month_required? true:false, regex: /^[0-9]*$/}" placeholder="volume" v-model="campaignTargetDetailO.targetOrder" :disabled="checkedsame"></a-input>
          <span style="color: red">{{ errors.first("month_volume") }}</span>
          
        </a-col>
        <a-col :span="4">
          <label>Month's CPA: </label>
          <a-input name="month_cpa" v-validate.initial="{required: month_required? true:false, regex: /^[0-9]*$/}" placeholder="Target CPA" v-model="campaignTargetDetailO.targetCPO" :disabled="checkedsame"></a-input>
          <span style="color: red">{{ errors.first("month_cpa") }}</span>
        </a-col>
        <a-col :span="4">
          <label>Month's Budget: </label>
          <a-input name="month_budget" v-validate.initial="{required: month_required? true:false, regex: /^[0-9]*$/, min_value:campaignTargetDetailO.targetOrder*campaignTargetDetailO.targetCPO}" placeholder="Budget" v-model="campaignTargetDetailO.targetBudget" :disabled="checkedsame"></a-input>
          <span style="color: red">{{ errors.first("month_budget") }}</span>
        </a-col>
        <a-col :span="4">
          <label>Month's ROAS: </label>
          <a-input name="month_roas" v-validate.initial="{required: campaignCPASelect==='ROAS' && month_required? true:false, regex: /^[0-9]*$/}" placeholder="ROAS" v-model="campaignTargetDetailO.targetROAS" :disabled="checkedsame || campaignCPASelect!=='ROAS'"></a-input>
          <span style="color: red">{{ errors.first("month_roas") }}</span>
        </a-col>
        <a-col :span="8">
          <label> Month's Date range: </label>
          <a-range-picker
          name="moth_date"
          v-validate.initial="{required: month_required? true:false}"
          v-model="campaignTargetDetailO.targetDateRange"
          :format="campaignTargetDetailO.targetDateFormat"
          :disabled="checkedsame"
          >
          <span style="color: red">{{ errors.first("month_date") }}</span>
            <template slot="renderExtraFooter">
              extra footer
            </template>
          </a-range-picker>
        </a-col>
        
      </a-row>

    <a-collapse v-model="collapseActiveKey2">
      <a-collapse-panel header="For internal use" key="1">
        <a-row
          :gutter="32"
          style="padding: 0 16px 16px 16px"
        >
      

          <a-col :span="5">
            <label>Target Daily Volume: </label>
            <a-input v-model="campaignTargetDetail.dailyVolume" placeholder="Not found" disabled />

          </a-col>
          <a-col :span="5">
            <label>Required Vol: </label>
            <a-input v-model="campaignTargetDetail.reqVol" placeholder="Not found" disabled ></a-input>
          </a-col>
          <a-col :span="5">
            <label>Threshold Vol: </label>
            <a-input v-model="campaignTargetDetail.thresholdVol" placeholder="Not found" disabled />

          </a-col>

          


          <a-col :span="5">
            <label>Algo Order volume: </label>
            <a-input v-model="campaignTargetDetail.algoVolume" placeholder="Not found" disabled />

          </a-col>

          <a-col :span="4">
            <label>Cost runrate: </label>
            <a-input v-model="campaignTargetDetail.costRunrate" placeholder="Not found" disabled />

          </a-col>

          
        </a-row>
        <a-row
          :gutter="32"
          style="padding: 0 16px 16px 16px"
        >

          <a-col :span="5">
            <label>Target Daily CPA: </label>
            <a-input v-model="campaignTargetDetail.dailyCPA" placeholder="Not found" disabled />

          </a-col>
          
          <a-col :span="5">
            <label>Required CPA: </label>
            <a-input v-model="campaignTargetDetail.reqCPA" placeholder="Not found" disabled />

          </a-col>
          
          <a-col :span="5">
            <label>Threshold CPA: </label>
            <a-input v-model="campaignTargetDetail.thresholdCPA" placeholder="Not found" disabled />

          </a-col>

          <a-col :span="5">
            <label>Algo CPO: </label>
            <a-input v-model="campaignTargetDetail.algoCPO" placeholder="Not found" disabled />

          </a-col>

          <a-col :span="4">
            <label>CPA STD: </label>
            <a-input v-model="campaignTargetDetail.CPAstd" placeholder="Not found" disabled />

          </a-col>
          
          
        </a-row>
      </a-collapse-panel>
    </a-collapse>
    
      
      
    <a-row
      :gutter="32"
      style="padding: 0 16px 16px 16px"
    >
      <a-col :span="8">
        <a-button v-if="campaignTargetAvail"
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
      <a-col :span="8">
        <a-button v-if="campaignTargetAvail" type="danger" @click="deleteTarget" style="margin-top: 20px; width: 150px"
          ><a-icon type="close"
        />Delete</a-button>
      </a-col>
    </a-row>
    </template>
    <a-collapse
      v-model="collapseActiveKey" 
      :bordered="false"
      style="padding-bottom: 40px;"
    >
      <a-collapse-panel key="1">
        <template slot="header" >
          <h3 style="font-weight: bold; color:red;">
          Unfavourable
          </h3>
        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Unfavourable"
          size="small"
          :loading="loading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=120
          >
            <template slot-scope="text,record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{truncate_str(text, 10)}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost" :width=80>
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions" :width=80>
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks" :width=80>
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
            :width=80
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO" :width=80>
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
            :width=80
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROAS" key="ROAS" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Trend" dataIndex="trend" key="trend" :width=80>
            <template slot-scope="text">
              <a-tag v-if="text === null" >
                N/A
              </a-tag>
              <template v-else>
                <a-icon v-if="text > 0" type="caret-up" style="color:red"/>
                <a-icon v-else type="caret-down" style="color:green"/>
                {{ text.toFixed(1) }}
              </template>
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          <a-table-column
            title="Flag"
            dataIndex="recommendPause"
            key="recommendPause"
            :width=80
          >
            <template slot-scope="text, record">
              <a-tag v-if="showPause && record.pause">
                Pause
              </a-tag>
              <a-tag v-if="showReduce && (!record.pause || !showPause)">
                Reduce
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            v-if="showReduce"
            title="suggestedBid"
            dataIndex="suggestedBid"
            key="suggestedBid"
            :width=80
          >
            <template slot-scope="text, record">
              <template v-if="showReduce && !record.pause">
                <a-tag v-if="text === undefined || text === null">
                  N/A
                </a-tag>


                <a-input-number v-else :min="1" :max="100000" :defaultValue="text" @change="handleChange" />
              </template>
            </template>
          </a-table-column>
          <a-table-column
            title="Manual bid"
            dataIndex="keywordId"
            :width=140
          >
            <template slot-scope="text, record">
              <a-input-number :min="1" />
            </template>
          </a-table-column>
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
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
      <a-collapse-panel key="2">
        <template slot="header" >
          <h3 style="font-weight: bold; color:orange;">
          Watchlist
          </h3>
        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Watchlist"
          size="small"
          :loading="loading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=120
          >
            <template slot-scope="text, record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{truncate_str(text, 10)}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost" :width=80>
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions" :width=80>
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks" :width=80>
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
            :width=80
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO" :width=80>
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
            :width=80
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROAS" key="ROAS" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Trend" dataIndex="trend" key="trend" :width=80>
            <template slot-scope="text">
              <a-tag v-if="text === null" >
                N/A
              </a-tag>
              <template v-else>
                <a-icon v-if="text > 0" type="caret-up" style="color:red"/>
                <a-icon v-else type="caret-down" style="color:green"/>
                {{ text.toFixed(1) }}
              </template>
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          <a-table-column
            title="Flag"
            dataIndex="coefficientVariance"
            key="coefficientVariance"
            :width=80
          >
            <template slot-scope="text, record">
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
            :width=80
          >
            <template slot-scope="text">
              <a-tag v-if="text === undefined || text.length == 0">
                N/A
              </a-tag>

              <a-select v-else style="width: 100px" @change="handleChange">
                <a-select-option v-for="item in text" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </template>
          </a-table-column>
          <a-table-column
            title="Manual bid"
            dataIndex="keywordId"
            :width=140
          >
            <template slot-scope="text, record">
              <a-input-number :min="1" />
            </template>
          </a-table-column>
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
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
      <a-collapse-panel key="3">
        <template slot="header" >
          <h3 style="font-weight: bold; color:green;">
          Favourable
          </h3>
        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Favourable"
          size="small"
          :loading="loading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=120
          >
            <template slot-scope="text, record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{truncate_str(text, 10)}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost" :width=80>
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions" :width=80>
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks" :width=80>
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
            :width=80
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO" :width=80>
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
            :width=80
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROAS" key="ROAS" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Trend" dataIndex="trend" key="trend" :width=80>
            <template slot-scope="text">
              <a-tag v-if="text === null" >
                N/A
              </a-tag>
              <template v-else>
                <a-icon v-if="text > 0" type="caret-up" style="color:red"/>
                <a-icon v-else type="caret-down" style="color:green"/>
                {{ text.toFixed(1) }}
              </template>
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          <a-table-column
            title="Flag"
            dataIndex="flag"
            key="flag"
            :width=80
          >
             <template slot-scope="text, record">
              <a-tag v-if="showIncrease">
                  Increase
                </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            v-if="showIncrease"
            title="suggestedBid"
            dataIndex="suggestedBid"
            key="suggestedBid"
            :width=80
          >
            <template slot-scope="text">
              <template  v-if="showIncrease">
                <a-tag v-if="text === undefined || text === null">
                  N/A
                </a-tag>

                <a-input-number v-else :min="1" :max="100000" :defaultValue="text"  @change="handleChange" />
              </template>
            </template>
          </a-table-column>
          <a-table-column
            title="Manual bid"
            dataIndex="keywordId"
            :width=140
          >
            <template slot-scope="text, record">
              <a-input-number :min="1" />
            </template>
          </a-table-column>
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
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
      <a-collapse-panel key="4">
        <template slot="header" >
          <h3 style="font-weight: bold; color:blue;">
          Immature
          </h3>
        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.Immature"
          size="small"
          :loading="loading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=150
          >
            <template slot-scope="text, record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{truncate_str(text, 10)}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column title="Cost" dataIndex="cost" key="cost" :width=80>
          </a-table-column>
          <a-table-column title="Imp" dataIndex="impressions" key="impressions" :width=80>
          </a-table-column>
          <a-table-column title="CPM" dataIndex="CPM" key="CPM" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Clicks" dataIndex="clicks" key="clicks" :width=80>
          </a-table-column>
          <a-table-column title="CPC" dataIndex="CPC" key="CPC" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column
            title="Order"
            dataIndex="attributedUnitsOrdered1d"
            key="attributedUnitsOrdered1d"
            :width=80
          >
          </a-table-column>
          <a-table-column title="CPO" dataIndex="CPO" key="CPO" :width=80>
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
            :width=80
          >
          </a-table-column>
          <a-table-column title="ROAS" dataIndex="ROAS" key="ROAS" :width=80>
            <template slot-scope="text">
              {{ truncate_float(text) }}
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
          >
            <template>
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
      <a-collapse-panel key="5">
        <template slot="header" >
          <h3 >
          Recommended Keywords
          <a-tag v-if="showAdd" >
                Add
              </a-tag>
          </h3>
          
        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.recommendedKeywords"
          size="small"
          :loading="recommendedloading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=150
          >
            <template slot-scope="text, record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{text}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
            :width=80
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
          >
            <template slot-scope="text, record">
              <div>
                <a-button
                  type="primary"
                  size="small"
                  ghost
                  icon="plus-square"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel  key="6">
        <template slot="header" >
          <h3 >
          Recommended Keywords from similar campaigns
          <a-tag v-if="showAdd" >
                Add
              </a-tag>
          </h3>
          
        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.recommendedKeywordsFromSimilarCampaign"
          size="small"
          :loading="recommendedloading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=150
          >
            <template slot-scope="text, record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{text}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
            :width=80
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
          >
            <template slot-scope="text, record">
              <div>
                <a-button
                  type="primary"
                  size="small"
                  ghost
                  icon="plus-square"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="7">
        <template slot="header" >
          <h3 >
          Relevant keywords
          <a-tag v-if="showAdd" >
                Add
              </a-tag>
          </h3>

        </template>
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.competitorKeywords"
          size="small"
          :loading="competitorloading"
          :scroll="{ y: 300, x: 1000}"
          :pagination="false"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
            :width=150
          >
            <template slot-scope="text,record" style="width: 60px">
              <a-popover title="Keyword more info">
                <template slot="content">
                  <p>{{text}}</p>
                  <p>Match type: {{record.matchType}}</p>
                </template>
                <a> 
                {{text}}</a
              
                >
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
            :width=80
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid" :width=80>
          </a-table-column>
          <a-table-column
            title="Actions"
            dataIndex="actions"
            key="actions"
            align="center"
            :width=100
          >
            <template slot-scope="text, record">
              <div>
                <a-button
                  type="primary"
                  size="small"
                  ghost
                  icon="plus-square"
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
// Danish provided tracking script START
window.__lo_site_id = 162488;

    (function() {
        var wa = document.createElement('script'); wa.type = 'text/javascript'; wa.async = true;
        wa.src = 'https://d10lpsik1i8c69.cloudfront.net/w.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(wa, s);
      })();
// Danish provided tracking script END

import {campaignInfo, keywordReport, recommendedKeyword, recommendObjective, recommendedKeywordFromSimilarCampaign, allRecommendedKeyword, competitorKeyword, requestOptimization , campaignTargetGet, campaignTargetCreate, campaignTargetEdit, campaignTargetDelete, campaignTargetGetO, campaignTargetCreateO, campaignTargetEditO, campaignTargetDeleteO} from "@/api";
import moment from 'moment';
moment.locale('ja')


export default {
  name: "keywordcampaigndetail",
  data() {
    return {
      campaignInformation: {
        campaignName: "",
        campaignYesterdayVolume : "",
        campaignYesterdayCPO: "",
      },
      
      campaignID: "",
      campaignCPA: "",
      campaignCPASelect: "CPO",
      dateRange: "7",
      campaignTargetDetail:{
        targetBudget:"",
        targetOrder: "",
        targetCPO: "",
        targetDateRange: [],
        targetDateFormat: "YYYY-MM-DD",
        dailyVolume:"",
        reqVol: "",
        reqCPA: "",
        thresholdCPA: "",
        thresholdVol:"",
        costRunrate: "",
        CPAstd:"",
        targetROAS:"",
        algoCPO:"",
        algoVolume: "",
        dailyCPA:""
 
      },
      campaignTargetDetailO:{
        targetBudget:"",
        targetOrder: "",
        targetCPO: "",
        targetDateRange: moment().date() < 4  ? [moment().subtract(1, 'month').set('date',15), moment().set('date',15)] : [moment().startOf('month'), moment().endOf('month')],
        targetDateFormat: "YYYY-MM-DD",
        targetROAS:""

 
      },
      campaignTargetAvail: false,
      campaignTargetMonthAvail: false,
      showCampaignTarget: false,
      confirmSend: false,
      campaignDetail: {
        Favourable: [],
        Immature: [],
        Unfavourable: [],
        Watchlist: [],
        recommendedKeywords: [],
        recommendedKeywordsFromSimilarCampaign: [],
        competitorKeywords: []
      },
      loading: true,
      responseError: {},
      competitorloading: true,
      objectiveloading:false,
      recommendedloading:true,
      optimizeaction: 0,
      optimizeRecommend:[],
      recommendActionMessage:"",
      collapseActiveKey:["1","2","3"],
      showPause: false,
      showReduce: false,
      showAdd: true,
      showIncrease: false,
      optimizeMsg: "",
      CPAMsg: "",
      VolumeMsg: "",
      collapseActiveKey2:[],
      checkedsame:false,
      ROASMsg:"",
    };
  },
  computed: {
    month_required: function(){
      return this.campaignTargetDetail.targetDateRange.length > 0 &&  moment().diff(this.campaignTargetDetail.targetDateRange[0], 'days') < 3 
    }

  },

  methods: {
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },

    handleChange(){

    },
    toggleSameAs(){

      this.checkedsame = !this.checkedsame;
      if(this.checkedsame){
        this.campaignTargetDetailO.targetBudget = this.campaignTargetDetail.targetBudget;
        this.campaignTargetDetailO.targetOrder = this.campaignTargetDetail.targetOrder;
        this.campaignTargetDetailO.targetCPO = this.campaignTargetDetail.targetCPO;
        this.campaignTargetDetailO.targetCPO = this.campaignTargetDetail.targetCPO;
        this.campaignTargetDetailO.targetROAS = this.campaignTargetDetail.targetROAS;
        
      }

    },
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
      else
        return value.toFixed(1);
    },
    truncate_float2(value) {
      if (value == null) return "N/A";
      else
        return value.toFixed(1);
    },
    getRecommendedKeyword() {
      this.recommendedloading = true;
      recommendedKeyword({
        
        campaignId: this.campaignID
      }).then(response => {
        this.campaignDetail.recommendedKeywords = response;
        this.recommendedloading = false;
      });
    },
    getCompetitorKeyword(){
      this.competitorloading = true;
      competitorKeyword({
        campaignId: this.campaignID,
      }).then(response => {
        this.campaignDetail.competitorKeywords =response;
        this.competitorloading = false;
      })
    },
    getRecommendedKeywordFromSimilarCampaigns(){
      this.recommendedloading = true;
      recommendedKeywordFromSimilarCampaign({
        campaignId: this.campaignID,
        CPA: this.campaignCPASelect,
        dateRange: this.dateRange || 7
      }).then(response => {
        this.campaignDetail.recommendedKeywordsFromSimilarCampaign = response;
        this.recommendedloading = false;
      });
    },
    getAllRecommendedKeywords(){
      this.recommendedloading = true;
      this.competitorloading = true;

      allRecommendedKeyword({
        campaignId: this.campaignID,
        CPA: this.campaignCPASelect,
        dateRange: this.dateRange || 7
      }).then(response => {
        this.campaignDetail.competitorKeywords =response.data.relative_keywords;
        this.campaignDetail.recommendedKeywordsFromSimilarCampaign = response.data.similar_camp_keywords;
        this.campaignDetail.recommendedKeywords = response.data.api_keywords;
        this.competitorloading = false;
        this.recommendedloading = false;
      });
    },
    showCampaignTargetEvent() {
      this.showCampaignTarget = !this.showCampaignTarget;
    },

    requestRecommenendObjective() {
      this.confirmSend = true;
      this.objectiveloading = true;
      recommendObjective({
        campaignId: this.campaignID,
        dateRange: this.dateRange || 7
      }).then(response => {
        this.confirmSend = false;
        this.objectiveloading = false;
        this.showCampaignTarget = false;
        this.campaignCPA = response.data;
      
      });
      requestOptimization({
        campaignId: this.campaignID,
        CPA: this.campaignCPASelect,
        
      }).then((response) => {
        
        this.optimizeMsg = response.data.msg
        this.CPAMsg = response.data.CPA_msg
        this.VolumeMsg = response.data.volume_msg
        this.ROASMsg = response.data.ROAS_msg
        this.showPause = response.data.showPause
        this.showReduce = response.data.showReduce
        this.showAdd = response.data.showAdd
        this.showIncrease = response.data.showIncrease
        this.campaignTargetDetail.costRunrate = this.truncate_float2(response.data.cost_runrate)
        this.campaignTargetDetail.dailyVolume = this.truncate_float2(response.data.daily_vol)
        this.campaignTargetDetail.dailyCPA = this.truncate_float2(response.data.daily_CPA)
        this.campaignTargetDetail.reqVol = this.truncate_float2(response.data.req_vol)
        this.campaignTargetDetail.reqCPA = this.truncate_float2(response.data.req_CPA)
        this.campaignTargetDetail.thresholdCPA = this.truncate_float2(response.data.threshold_CPA)
        this.campaignTargetDetail.thresholdVol = this.truncate_float2(response.data.threshold_vol)
        this.campaignTargetDetail.CPAstd = this.truncate_float2(response.data.CPA_std)
        this.campaignTargetDetail.algoCPO = this.truncate_float2(response.data.algo_CPO)
        this.campaignTargetDetail.algoVolume = this.truncate_float2(response.data.algo_vol)
      });
    },
    setCampaignCPA(value) {
      if (value !== ""){
      this.campaignCPASelect = value;
      }
    },
    getCampaignInfo(){
      
      campaignInfo({
        campaignId: this.campaignID,
      }).then(response => {
        this.campaignInformation.campaignName = response.data.campaign_name;
        this.campaignInformation.campaignYesterdayVolume = response.data.campaign_yesterday_volume;
        this.campaignInformation.campaignYesterdayCPA = response.data.campaign_yesterday_cpa;
      
      });
    },
    createNewTarget(){
      if(this.errors.items.length === 0) {
        campaignTargetCreate({
          campaignId: this.campaignID,
          campaignTargetVolume: this.campaignTargetDetail.targetOrder,
          campaignTargetBudget: this.campaignTargetDetail.targetBudget,
          campaignTargetCPO: this.campaignTargetDetail.targetCPO,
          campaignTargetROAS: this.campaignTargetDetail.targetROAS,
          campaignTargetStartDate: this.campaignTargetDetail.targetDateRange[0].format('YYYY-MM-DD'),
          campaignTargetEndDate: this.campaignTargetDetail.targetDateRange[1].format('YYYY-MM-DD'),
        }).then(response =>{
          console.log(response.data.msg)
        }).catch(error => {
            this.responseError = error.response.data.message;
            this.$message.error("Error: " + this.responseError);
        });
        if(this.campaignTargetDetailO.targetDateRange.constructor === Array && this.campaignTargetDetailO.targetDateRange.length === 2)
          if(this.campaignTargetMonthAvail){
            campaignTargetEditO({
              campaignId: this.campaignID,
              campaignTargetVolume_o: this.campaignTargetDetailO.targetOrder,
              campaignTargetBudget_o: this.campaignTargetDetailO.targetBudget,
              campaignTargetCPO_o: this.campaignTargetDetailO.targetCPO,
              campaignTargetROAS_o: this.campaignTargetDetailO.targetROAS,
              campaignTargetStartDate_o: this.campaignTargetDetailO.targetDateRange[0].format('YYYY-MM-DD'),
              campaignTargetEndDate_o: this.campaignTargetDetailO.targetDateRange[1].format('YYYY-MM-DD'),
            }).then(response =>{}).catch(error => {
              this.responseError = error.response.data.message;
              this.$message.error("Error: " + this.responseError);
            });
          }
          else{
            campaignTargetCreateO({
              campaignId: this.campaignID,
              campaignTargetVolume_o: this.campaignTargetDetailO.targetOrder,
              campaignTargetBudget_o: this.campaignTargetDetailO.targetBudget,
              campaignTargetCPO_o: this.campaignTargetDetailO.targetCPO,
              campaignTargetROAS_o: this.campaignTargetDetailO.targetROAS,
              campaignTargetStartDate_o: this.campaignTargetDetailO.targetDateRange[0].format('YYYY-MM-DD'),
              campaignTargetEndDate_o: this.campaignTargetDetailO.targetDateRange[1].format('YYYY-MM-DD'),
            }).then(response =>{}).catch(error => {
                this.responseError = error.response.data.message;
                this.$message.error("Error: " + this.responseError);
            });;
          }
        this.getCampaignTarget();
        this.getCampaignDetail();
        this.requestRecommenendObjective();
      } else {
        this.$message.error("Please fill required fields of the form. " )

      }
      

    },
    modifyTarget(){
      if(this.errors.items.length === 0) {
        campaignTargetEdit({
          campaignId: this.campaignID,
          campaignTargetVolume: this.campaignTargetDetail.targetOrder,
          campaignTargetBudget: this.campaignTargetDetail.targetBudget,
          campaignTargetCPO: this.campaignTargetDetail.targetCPO,
          campaignTargetROAS: this.campaignTargetDetail.targetROAS,
          campaignTargetStartDate: this.campaignTargetDetail.targetDateRange[0].format('YYYY-MM-DD'),
          campaignTargetEndDate: this.campaignTargetDetail.targetDateRange[1].format('YYYY-MM-DD'),
        }).then(response => {
          
          
        }).catch(error => {
            this.responseError = error.response.data.message;
            this.$message.error("Error: " + this.responseError);
        });
        if(this.campaignTargetDetailO.targetDateRange.constructor === Array && this.campaignTargetDetailO.targetDateRange.length === 2)
          if(this.campaignTargetMonthAvail){
            campaignTargetEditO({
              campaignId: this.campaignID,
              campaignTargetVolume_o: this.campaignTargetDetailO.targetOrder,
              campaignTargetBudget_o: this.campaignTargetDetailO.targetBudget,
              campaignTargetCPO_o: this.campaignTargetDetailO.targetCPO,
              campaignTargetROAS_o: this.campaignTargetDetailO.targetROAS,
              campaignTargetStartDate_o: this.campaignTargetDetailO.targetDateRange[0].format('YYYY-MM-DD'),
              campaignTargetEndDate_o: this.campaignTargetDetailO.targetDateRange[1].format('YYYY-MM-DD'),
            }).then(response =>{}).catch(error => {
              this.responseError = error.response.data.message;
              this.$message.error("Error: " + this.responseError);
            });
          }
          else{
            campaignTargetCreateO({
              campaignId: this.campaignID,
              campaignTargetVolume_o: this.campaignTargetDetailO.targetOrder,
              campaignTargetBudget_o: this.campaignTargetDetailO.targetBudget,
              campaignTargetCPO_o: this.campaignTargetDetailO.targetCPO,
              campaignTargetROAS_o: this.campaignTargetDetailO.targetROAS,
              campaignTargetStartDate_o: this.campaignTargetDetailO.targetDateRange[0].format('YYYY-MM-DD'),
              campaignTargetEndDate_o: this.campaignTargetDetailO.targetDateRange[1].format('YYYY-MM-DD'),
            }).then(response =>{}).catch(error => {
                this.responseError = error.response.data.message;
                this.$message.error("Error: " + this.responseError);
            });;
          }
        this.getCampaignTarget();
        this.getCampaignDetail();
        this.requestRecommenendObjective();
      } else {
        this.$message.error("Please fill required fields of the form. ");

        
      }
    },
    deleteTarget(){
      campaignTargetDelete(this.campaignID
      ).then(response => {
        
      });
      campaignTargetDeleteO(this.campaignID).then(response => {});
      this.getCampaignTarget();
    },
    getCampaignTarget(){
      campaignTargetGet(this.campaignID
      ).then(response => {
        console.log(response)
        if (response.data != null && response.data !== undefined){

          this.campaignTargetDetail.targetOrder = response.data.targetVolume;
          this.campaignTargetDetail.targetCPO = response.data.targetCPO;
          this.campaignTargetDetail.targetDateRange = [moment(response.data.targetStartDate, "YYYY-MM-DD"), moment(response.data.targetEndDate, "YYYY-MM-DD")];
          this.campaignTargetDetail.targetBudget = response.data.targetBudget;
          this.campaignTargetDetail.targetROAS = response.data.targetROAS;
          
          this.campaignTargetAvail = true;
        }
        else{
          this.campaignTargetAvail = false;
          this.campaignTargetDetail.targetOrder = '';
          this.campaignTargetDetail.targetCPO = '';
          this.campaignTargetDetail.targetDateRange = [];
          this.campaignTargetDetail.targetBudget = '';
          this.campaignTargetDetail.targetROAS = '';
        }
        console.log(this.campaignTargetDetail.targetDateRange)
        
      });
      campaignTargetGetO(this.campaignID
      ).then(response => {
        console.log(response)
        if (response.data != null && response.data !== undefined){

          this.campaignTargetDetailO.targetOrder = response.data.targetVolume;
          this.campaignTargetDetailO.targetCPO = response.data.targetCPO;
          this.campaignTargetDetailO.targetDateRange = [moment(response.data.targetStartDate, "YYYY-MM-DD"), moment(response.data.targetEndDate, "YYYY-MM-DD")];
          this.campaignTargetDetailO.targetBudget = response.data.targetBudget;
          this.campaignTargetDetailO.targetROAS = response.data.targetROAS;
          this.campaignTargetMonthAvail = true;
        }
        else{
          this.campaignTargetMonthAvail = false;
          this.campaignTargetDetailO.targetOrder = ''; 
          this.campaignTargetDetailO.targetCPO = '';
          this.campaignTargetDetailO.targetROAS = '';
          if(moment().date() < 4)
            this.campaignTargetDetailO.targetDateRange = [moment().subtract(1, 'month').set('date',15), moment().set('date',15)];
          else
            this.campaignTargetDetailO.targetDateRange = [moment().startOf('month'), moment().endOf('month')];

          this.campaignTargetDetailO.targetBudget = '';
        }
        console.log(this.campaignTargetDetailO.targetDateRange)
        
      });
    }
  },

  mounted() {
    this.campaignID = this.$route.params.id;
    this.getCampaignInfo();
    this.getCampaignDetail();
    this.getCampaignTarget();
    this.getAllRecommendedKeywords();
    this.requestRecommenendObjective();
    console.log(moment().date());
    
    
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
