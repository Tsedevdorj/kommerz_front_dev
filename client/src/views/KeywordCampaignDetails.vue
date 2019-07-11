<template>
  <div class="keywordcampaigndetail">
    <h2>Campaign Name: {{ campaignName }} </h2>
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <h5>Campaign ID: {{ campaignID }} </h5>
      </a-col>
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <div style="float:right; margin-bottom: 0.5em;">
          <a-button type="dashed" style="margin-top: 20px;"
          >
          <router-link :to="{ name: 'keywordchurnerin' }"
              ><a-icon type="rollback" />Back</router-link>
          </a-button
          >
          
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
          <a-select-option value="ROS">ROAS</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1">
        <a-button shape="circle" icon="reload" @click="getCampaignDetail" />
      </a-col>
    </a-row>
    <template v-if="showCampaignTarget">
    <a-row
      :gutter="32"
      style="padding: 0 16px 16px 16px"
    >
      <a-col :span="8">
        <label>Target Volume: </label>
        <a-input placeholder="Order volumne" v-model="campaignTargetDetail.targetOrder"></a-input>
        
      </a-col>
      <a-col :span="8">
        <label>Target CPA: </label>
        <a-input placeholder="Target CPO" v-model="campaignTargetDetail.targetCPO"></a-input>
      </a-col>
      <a-col :span="8">
        <label>Target Date range: </label>
        <a-range-picker
        v-model="campaignTargetDetail.targetDateRange"
        :format="campaignTargetDetail.targetDateFormat"
        >
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
        <label>Budget: </label>
        <a-input placeholder="Budget" v-model="campaignTargetDetail.targetBudget"></a-input>
        
      </a-col>
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
                <a-icon v-if="text > 0" type="caret-up" style="color:red"/>
                <a-icon v-else type="caret-down" style="color:green"/>
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
            <template slot-scope="text, record">
              <a-tag v-if="text == true">
                RP
              </a-tag>
                <a-icon v-if="(optimizeaction==2 || optimizeaction==3) && record.flag==true" type="frown" style="color:red"/>
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
                <a-icon v-if="text > 0" type="caret-up" style="color:red"/>
                <a-icon v-else type="caret-down" style="color:green"/>
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
            <template slot-scope="text, record">
              <a-tag v-if="text > 1" color="red">
                A
              </a-tag>
              <a-tag v-else>
                P
              </a-tag>
              <a-icon v-if="(optimizeaction==2 || optimizeaction==3) && record.flag==true" type="frown" style="color:red"/>
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
                <a-icon v-if="text > 0" type="caret-up" style="color:red"/>
                <a-icon v-else type="caret-down" style="color:green"/>
                {{ text.toFixed(1) }}
              </template>
            </template>
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column
          v-if="(optimizeaction==2 || optimizeaction==3)"
            title="Flag"
            dataIndex="flag"
            key="flag"
          >
            <template slot-scope="text, record">
                <a-icon v-if="(optimizeaction==2 || optimizeaction==3) && record.flag==true" type="frown" style="color:red"/>
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
          :loading="recommendedloading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
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
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column v-if="optimizeaction==1" title="Flag" dataIndex="flag" key="flag">
            <template slot-scope="text">
              <a-icon v-if="text !== undefined && text===true" type="smile" theme="outlined" />
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
                  ghost
                  icon="plus-square"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Recommended Keywords from similar campaigns" key="6">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.recommendedKeywordsFromSimilarCampaign.data"
          size="small"
          :loading="recommendedloading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
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
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column v-if="optimizeaction==1" title="Flag" dataIndex="flag" key="flag">
            <template slot-scope="text">
              <a-icon v-if="text !== undefined && text===true" type="smile" theme="outlined" />
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
                  ghost
                  icon="plus-square"
                ></a-button>
              </div>
            </template>
          </a-table-column>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel header="Relevant keywords" key="7">
        <a-table
          :rowKey="record => record.keywordId"
          :dataSource="campaignDetail.competitorKeywords.data"
          size="small"
          :loading="competitorloading"
        >
          <a-table-column
            title="Keyword Text"
            dataIndex="keywordText"
            key="keywordText"
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
          <a-table-column
            title="Match Type"
            dataIndex="matchType"
            key="matchType"
          >
          </a-table-column>
          <a-table-column title="Bid" dataIndex="bid" key="bid">
          </a-table-column>
          <a-table-column v-if="optimizeaction==1" title="Flag" dataIndex="flag" key="flag">
            <template slot-scope="text">
              <a-icon v-if="text !== undefined && text===true" type="smile" theme="outlined" />
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

import {campaignInfo, keywordReport, recommendedKeyword, recommendObjective, recommendedKeywordFromSimilarCampaign, competitorKeyword, requestOptimization , campaignTargetGet, campaignTargetCreate, campaignTargetEdit, campaignTargetDelete} from "@/api";
import moment from 'moment';
moment.locale('ja')


export default {
  name: "keywordcampaigndetail",
  data() {
    return {
      campaignName:"",
      campaignID: "",
      campaignCPA: "",
      campaignCPASelect: "CPO",
      dateRange: "7",
      campaignTargetDetail:{
        targetBudget:"",
        targetOrder: "",
        targetCPO: "",
        targetDateRange: "",
        targetDateFormat: "YYYY-MM-DD"
 
      },
      campaignTargetAvail: false,
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
    };
  },
  methods: {
    handleChange(){

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
      else return value.toFixed(2);
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
    showCampaignTargetEvent() {
      this.showCampaignTarget = !this.showCampaignTarget;
    },

    requestRecommenendObjective() {
      this.confirmSend = true;
      this.objectiveloading = true;
      recommendObjective({
        campaignId: this.campaignID,
        targetOrder: this.targetOrder
      }).then(response => {
        this.confirmSend = false;
        this.objectiveloading = false;
        this.showCampaignTarget = false;
        this.campaignCPA = response.data;
      
      });
      requestOptimization({
        campaignId: this.campaignID,
        targetOrder: this.targetOrder,
        targetCPO: this.targetCPO,
        targetDateRange: this.campaignTargetDetail.targetDateRange,
        CPA: this.campaignCPASelect

      }).then(response =>{
        console.log(response);
        let met_opt = response.data.metricOp;
        let obj_opt = response.data.objectiveOpt;
        if (met_opt && !obj_opt){
          this.optimizeaction = 1;
          this.optimizeRecommend = this.optimizeRecommend.concat(this.campaignDetail.recommendedKeywords.data, this.campaignDetail.recommendedKeywordsFromSimilarCampaign.data, this.campaignDetail.competitorKeywords.data);
          this.optimizeRecommend.sort(function(a,b) 
          {
            return a.bid - b.bid;
          });
          this.optimizeRecommend = this.optimizeRecommend.slice(0,10);
          this.campaignDetail.recommendedKeywords.data.forEach(element => {
            element.flag = false;
            if (this.optimizeRecommend.includes(element)) {
              element.flag=true;
            }
          });
          this.campaignDetail.recommendedKeywordsFromSimilarCampaign.data.forEach(element => {
            element.flag = false;
            if (this.optimizeRecommend.includes(element)) {
              element.flag=true;
            }
          });
          this.campaignDetail.competitorKeywords.data.forEach(element => {
            element.flag = false;
            if (this.optimizeRecommend.includes(element)) {
              element.flag=true;
            }
          });
        }
        else if(!met_opt && obj_opt){
          this.optimizeaction = 2;
          let optimizearray=[];
          optimizearray = optimizearray.concat(this.campaignDetail.Favourable, this.campaignDetail.Watchlist, this.campaignDetail.Unfavourable);
          optimizearray.sort(function(a,b) 
          {
            if(a.CPO === "" || a.CPO === null) return -1;
            if(b.CPO === "" || b.CPO === null) return 1;
            if(a.CPO === b.CPO) return 0;
            return a.CPO < b.CPO ? 1 : -1;
          });
          console.log(optimizearray)
          optimizearray = optimizearray.slice(0,10);

          this.campaignDetail.Favourable.forEach(element => {
            element.flag = false;
            if (optimizearray.includes(element) && (element.CPO > this.targetCPO || element.CPO === null)) {
              element.flag=true;
            }
          });
          this.campaignDetail.Watchlist.forEach(element => {
            element.flag = false;
            if (optimizearray.includes(element) && (element.CPO > this.targetCPO || element.CPO === null)) {
              element.flag=true;
            }
          });
          this.campaignDetail.Unfavourable.forEach(element => {
            element.flag = false;
            if (optimizearray.includes(element) && (element.CPO > this.targetCPO || element.CPO === null)) {
              element.flag=true;
            }
          });
        }
        else if(met_opt && obj_opt){
          this.optimizeaction = 3;
          let optimizearray=[];
          optimizearray = optimizearray.concat(this.campaignDetail.Favourable, this.campaignDetail.Watchlist, this.campaignDetail.Unfavourable);
          optimizearray.sort(function(a,b) 
          {
            if(a.CPO === "" || a.CPO === null) return -1;
            if(b.CPO === "" || b.CPO === null) return 1;
            if(a.CPO === b.CPO) return 0;
            return a.CPO < b.CPO ? 1 : -1;
          });
          optimizearray = optimizearray.slice(0,10);
          console.log(optimizearray)
          this.campaignDetail.Favourable.forEach(element => {
            element.flag = false;
            if (optimizearray.includes(element) && (element.CPO > this.targetCPO || element.CPO === null)) {
              element.flag=true;
            }
          });
          this.campaignDetail.Watchlist.forEach(element => {
            element.flag = false;
            if (optimizearray.includes(element) && (element.CPO > this.targetCPO || element.CPO === null)) {
              element.flag=true;
            }
          });
          this.campaignDetail.Unfavourable.forEach(element => {
            element.flag = false;
            if (optimizearray.includes(element) && (element.CPO > this.targetCPO || element.CPO === null)) {
              element.flag=true;
            }
            this.campaignDetail.Unfavourable.forEach(element => {
            if (element.attributedUnitsOrdered1d === 0) {
              element.flag=true;
            }
          });
          });
        }
        console.log(this.optimizeaction)
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
        this.campaignName = response.data;
      
      });
    },
    createNewTarget(){
      campaignTargetCreate({
        campaignId: this.campaignID,
        campaignTargetVolume: this.campaignTargetDetail.targetOrder,
        campaignTargetBudget: this.campaignTargetDetail.targetBudget,
        campaignTargetCPO: this.campaignTargetDetail.targetCPO,
        campaignTargetStartDate: this.campaignTargetDetail.targetDateRange[0].format('YYYY-MM-DD'),
        campaignTargetEndDate: this.campaignTargetDetail.targetDateRange[1].format('YYYY-MM-DD'),
      }).then(response =>{
        this.getCampaignTarget();
        this.requestRecommenendObjective();
      }).catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
        });

    },
    modifyTarget(){
      campaignTargetEdit({
        campaignId: this.campaignID,
        campaignTargetVolume: this.campaignTargetDetail.targetOrder,
        campaignTargetBudget: this.campaignTargetDetail.targetBudget,
        campaignTargetCPO: this.campaignTargetDetail.targetCPO,
        campaignTargetStartDate: this.campaignTargetDetail.targetDateRange[0].format('YYYY-MM-DD'),
        campaignTargetEndDate: this.campaignTargetDetail.targetDateRange[1].format('YYYY-MM-DD'),
      }).then(response => {
        this.getCampaignTarget();
        this.requestRecommenendObjective();
      }).catch(error =>{
        this.responseError = error.response.data.message;
        this.$message.error("Error: " + this.responseError);
      })
    },
    deleteTarget(){
      campaignTargetDelete(this.campaignID
      ).then(response => {
        this.getCampaignTarget();
      })
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
          this.campaignTargetAvail = true;
        }
        else{
          this.campaignTargetAvail = false;
          this.campaignTargetDetail.targetOrder = '';
          this.campaignTargetDetail.targetCPO = '';
          this.campaignTargetDetail.targetDateRange = null;
          this.campaignTargetDetail.targetBudget = '';
        }
        console.log(this.campaignTargetDetail.targetDateRange)
        
      })
    }
  },

  mounted() {
    this.campaignID = this.$route.params.id;
    this.getCampaignInfo();
    this.getCampaignDetail();
    this.getRecommendedKeyword();
    this.getRecommendedKeywordFromSimilarCampaigns();
    this.getCompetitorKeyword();
    this.getCampaignTarget()
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
