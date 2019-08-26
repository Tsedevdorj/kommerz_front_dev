<template>
  <div style="padding-bottom: 40px;">
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content" v-if="current == 0">
      <a-row :gutter="32">
        <a-col :span="12" class="padding-top__20">
          <div class="form-label">
            <label>Client Name</label>
          </div>
          <a-input
            name="client_name"
            v-validate.initial="{required: true}"
            v-model="CampaignInformation.brandName"
            placeholder="Client Name in Japanese"
          ></a-input>
          <span style="color: red">{{ errors.first("client_name") }}</span>
        </a-col>
        <a-col :span="12" class="padding-top__20">
          <div class="form-label">
            <label>Brand Name</label>
          </div>
          <a-input
            name="brand_name"
            v-validate.initial="{required: true}"
            v-model="CampaignInformation.productName"
            placeholder="Brand Name in Japanese"
          ></a-input>
          <span style="color: red">{{ errors.first("brand_name") }}</span>
        </a-col>
        <a-col :span="24" class="padding-top__20">
          <a-switch
            :checked="CampaignInformation.languageSwitch"
            checkedChildren="English Campaign"
            unCheckedChildren="Non English Campaign"
            @change="onLanguageSwitch"
          />
        </a-col>
        <div v-if="CampaignInformation.languageSwitch == true">
          <a-col :span="12" class="padding-top__20">
            <div class="form-label">
              <label>Client Name in English</label>
            </div>
            <a-input
              name="en_client_name"
              v-validate.initial="{required: CampaignInformation.brandNameEN}"
              v-model="CampaignInformation.brandNameEN"
              placeholder="Client Name in English"
            ></a-input>
            <span style="color: red">{{ errors.first("en_client_name") }}</span>
          </a-col>
          <a-col :span="12" class="padding-top__20">
            <div class="form-label">
              <label>Brand Name in English</label>
            </div>
            <a-input
              name="en_brand_name"
              v-validate.initial="{required: CampaignInformation.brandNameEN}"
              v-model="CampaignInformation.productNameEN"
              placeholder="Brand Name in English"
            ></a-input>
            <span style="color: red">{{ errors.first("en_brand_name") }}</span>
          </a-col>
        </div>
        <!-- level 1 -->
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 1</label>
          </div>
          <a-checkbox
            style="padding-right: 10px;"
            :value="categorySelected.level_1"
            @change="categoryChecked"
            :disabled="categorySelected.level_1 == ''"
          ></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            v-model="categorySelected.level_1"
            @change="categoryChange('1')"
          >
            <a-select-option
              v-for="(label, id) in categoryData"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <!-- level 2 -->
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 2</label>
          </div>
          <a-checkbox
            style="padding-right: 10px;"
            :value="categorySelected.level_2"
            @change="categoryChecked"
            :disabled="categorySelected.level_2 == ''"
          ></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            v-model="categorySelected.level_2"
            :disabled="categorySelected.level_1 == ''"
            @change="categoryChange('2')"
          >
            <a-select-option
              v-for="(label, id) in _.get(
                categoryData,
                categorySelected.level_1,
                []
              ).children"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <!-- level 3 -->
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 3</label>
          </div>
          <a-checkbox
            style="padding-right: 10px;"
            :value="categorySelected.level_3"
            @change="categoryChecked"
            :disabled="categorySelected.level_3 == ''"
          ></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            v-model="categorySelected.level_3"
            :disabled="categorySelected.level_2 == ''"
            @change="categoryChange('3')"
          >
            <a-select-option
              v-for="(label, id) in _.get(
                categoryData,
                [categorySelected.level_1, categorySelected.level_2].join(
                  '.children.'
                ),
                []
              ).children"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <!-- level 4 -->
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 4</label>
          </div>
          <a-checkbox
            style="padding-right: 10px;"
            :value="categorySelected.level_4"
            @change="categoryChecked"
            :disabled="categorySelected.level_4 == ''"
          ></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            v-model="categorySelected.level_4"
            :disabled="categorySelected.level_3 == ''"
            @change="categoryChange('4')"
          >
            <a-select-option
              v-for="(label, id) in _.get(
                categoryData,
                [
                  categorySelected.level_1,
                  categorySelected.level_2,
                  categorySelected.level_3
                ].join('.children.'),
                []
              ).children"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <!-- level 5 -->
        <a-col :span="4" class="padding-top__20">
          <div class="form-label">
            <label>Level 5</label>
          </div>
          <a-checkbox
            style="padding-right: 10px;"
            :value="categorySelected.level_5"
            @change="categoryChecked"
            :disabled="categorySelected.level_5 == ''"
          ></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            v-model="categorySelected.level_5"
            :disabled="categorySelected.level_4 == ''"
            @change="categoryChange('5')"
          >
            <a-select-option
              v-for="(label, id) in _.get(
                categoryData,
                [
                  categorySelected.level_1,
                  categorySelected.level_2,
                  categorySelected.level_3,
                  categorySelected.level_4
                ].join('.children.'),
                []
              ).children"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="24" class="padding-top__20">
          <div class="form-label">
            <label>Budget</label>
          </div>
          <a-input
            name="budget"
            v-validate.initial="{required: true}"
            v-model="CampaignInformation.budget"
            placeholder="Budget"
          ></a-input>
          <span style="color: red">{{ errors.first("budget") }}</span>
        </a-col>
        <a-col :span="24" class="padding-top__20">
          <div class="form-label">
            <label>Landing URL</label>
          </div>
          <a-input
            name="landing_url"
            v-validate.initial="{required: true}"
            v-model="CampaignInformation.landingURL"
            placeholder="Landing URL"
          ></a-input>
          <span style="color: red">{{ errors.first("landing_url") }}</span>
        </a-col>
      </a-row>
    </div>
    <div class="steps-content" v-if="current == 1">
      <a-row :gutter="32">
        <a-col :span="24" class="padding-top__20">
          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="Brand Keywords" key="1">
              <a-row :gutter="32">
                <a-col :span="12" style="padding: 0 16px">
                  <h3 style="margin-left: 5px">Brand Keywords (Japanese)</h3>
                  <a-input
                    style="margin: 5px"
                    placeholder="Insert additional keywords"
                    v-model="additionalKeyword.brandJA"
                  >
                    <a-icon
                      slot="addonAfter"
                      type="plus"
                      @click="additionalKeywordAdd('brandKeywordsJA')"
                    />
                  </a-input>
                  <template v-for="(tag, index) in keywords.brandKeywordsJA">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="
                        () =>
                          removeKeyword({ tag: tag, type: 'brandKeywordsJA' })
                      "
                    >
                      {{ tag }}
                    </a-tag>
                  </template>
                </a-col>
                <a-col :span="12" style="padding: 0 16px">
                  <h3 style="margin-left: 5px">Brand Keywords (English)</h3>
                  <a-input
                    style="margin: 5px"
                    placeholder="Insert additional keywords"
                    v-model="additionalKeyword.brandEN"
                  >
                    <a-icon
                      slot="addonAfter"
                      type="plus"
                      @click="additionalKeywordAdd('brandKeywordsEN')"
                    />
                  </a-input>
                  <template v-for="(tag, index) in keywords.brandKeywordsEN">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="
                        () =>
                          removeKeyword({ tag: tag, type: 'brandKeywordsEN' })
                      "
                    >
                      {{ tag }}
                    </a-tag>
                  </template>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <template
                    v-if="Object.entries(brandPlannerResult).length !== 0"
                  >
                    <a-tabs
                      defaultActiveKey="1"
                      style="padding-top: 15px; margin: 5px;"
                    >
                      <a-tab-pane tab="Campaigns" key="1">
                        <a-table
                          :rowKey="record => record.Campaign_Name"
                          :dataSource="brandPlannerResult.ja_campaign"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Allocation"
                            dataIndex="Allocation"
                            key="Allocation"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Volume"
                            dataIndex="Volume"
                            key="Volume"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                      <a-tab-pane tab="Keywords" key="2">
                        <a-table
                          :rowKey="record => record.Keyword"
                          :dataSource="brandPlannerResult.ja_keyword"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240, x: 380 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Ad Group"
                            dataIndex="adgroup"
                            key="adgroup"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Keyword"
                            dataIndex="Keyword"
                            key="Keyword"
                            :width=120
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column 
                          title="Bid" 
                          dataIndex="Bid" 
                          key="Bid"
                          :width=50>
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Traffic"
                            dataIndex="Traffic"
                            key="Traffic"
                            :width=50
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                    </a-tabs>
                  </template>
                </a-col>
                <a-col :span="12">
                  <template
                    v-if="Object.entries(brandPlannerResult).length !== 0"
                  >
                    <a-tabs
                      defaultActiveKey="1"
                      style="padding-top: 15px; margin: 5px;"
                    >
                      <a-tab-pane tab="Campaigns" key="1">
                        <a-table
                          :rowKey="record => record.Campaign_Name"
                          :dataSource="brandPlannerResult.en_campaign"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Allocation"
                            dataIndex="Allocation"
                            key="Allocation"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Volume"
                            dataIndex="Volume"
                            key="Volume"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                      <a-tab-pane tab="Keywords" key="2">
                        <a-table
                          :rowKey="record => record.Keyword"
                          :dataSource="brandPlannerResult.en_keyword"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240, x: 380 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Ad Group"
                            dataIndex="adgroup"
                            key="adgroup"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Keyword"
                            dataIndex="Keyword"
                            key="Keyword"
                            :width=120
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column 
                          title="Bid" 
                          dataIndex="Bid" 
                          key="Bid"
                          :width=50>
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Traffic"
                            dataIndex="Traffic"
                            key="Traffic"
                            :width=50
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                    </a-tabs>
                  </template>
                </a-col>
                <a-col
                  :span="24"
                  style="padding: 0 16px"
                  v-if="Object.entries(brandPlannerResult).length === 0"
                >
                  <div style="width: 100%">
                    <a-button
                      type="primary"
                      style="display: block; margin: 40px auto;"
                      :loading="sendRequestBrandLoading"
                      @click="sendRequestBrand"
                      >Send Request</a-button
                    >
                  </div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <!-- Core -->
            <a-tab-pane tab="Core Keywords" key="2">
              <a-row :gutter="32">
                <a-col :span="12" style="padding: 0 16px">
                  <h3 style="margin-left: 5px">Core Keywords (Japanese)</h3>
                  <a-input
                    style="margin: 5px"
                    placeholder="Insert additional keywords"
                    v-model="additionalKeyword.coreJA"
                  >
                    <a-icon
                      slot="addonAfter"
                      type="plus"
                      @click="additionalKeywordAdd('coreKeywordsJA')"
                    />
                  </a-input>
                  <template v-for="(tag, index) in keywords.coreKeywordsJA">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="
                        () =>
                          removeKeyword({ tag: tag, type: 'coreKeywordsJA' })
                      "
                    >
                      {{ tag }}
                    </a-tag>
                  </template>
                </a-col>
                <a-col :span="12" style="padding: 0 16px">
                  <h3 style="margin-left: 5px">Core Keywords (English)</h3>
                  <a-input
                    style="margin: 5px"
                    placeholder="Insert additional keywords"
                    v-model="additionalKeyword.coreEN"
                  >
                    <a-icon
                      slot="addonAfter"
                      type="plus"
                      @click="additionalKeywordAdd('coreKeywordsEN')"
                    />
                  </a-input>
                  <template v-for="(tag, index) in keywords.coreKeywordsEN">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="
                        () =>
                          removeKeyword({ tag: tag, type: 'coreKeywordsEN' })
                      "
                    >
                      {{ tag }}
                    </a-tag>
                  </template>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <template
                    v-if="Object.entries(corePlannerResult).length !== 0"
                  >
                    <a-tabs
                      defaultActiveKey="1"
                      style="padding-top: 15px; margin: 5px;"
                    >
                      <a-tab-pane tab="Campaigns" key="1">
                        <a-table
                          :rowKey="record => record.Campaign_Name"
                          :dataSource="corePlannerResult.ja_campaign"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Allocation"
                            dataIndex="Allocation"
                            key="Allocation"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Volume"
                            dataIndex="Volume"
                            key="Volume"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                      <a-tab-pane tab="Keywords" key="2">
                        <a-table
                          :rowKey="record => record.Keyword"
                          :dataSource="corePlannerResult.ja_keyword"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240, x: 380 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Ad Group"
                            dataIndex="adgroup"
                            key="adgroup"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Keyword"
                            dataIndex="Keyword"
                            key="Keyword"
                            :width=120
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column 
                          title="Bid" 
                          dataIndex="Bid" 
                          key="Bid"
                          :width=50>
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Traffic"
                            dataIndex="Traffic"
                            key="Traffic"
                            :width=50
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                    </a-tabs>
                  </template>
                </a-col>
                <a-col :span="12">
                  <template
                    v-if="Object.entries(corePlannerResult).length !== 0"
                  >
                    <a-tabs
                      defaultActiveKey="1"
                      style="padding-top: 15px; margin: 5px;"
                    >
                      <a-tab-pane tab="Campaigns" key="1">
                        <a-table
                          :rowKey="record => record.Campaign_Name"
                          :dataSource="corePlannerResult.en_campaign"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Allocation"
                            dataIndex="Allocation"
                            key="Allocation"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Volume"
                            dataIndex="Volume"
                            key="Volume"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                      <a-tab-pane tab="Keywords" key="2">
                        <a-table
                          :rowKey="record => record.Keyword"
                          :dataSource="corePlannerResult.en_keyword"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240, x: 380 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Ad Group"
                            dataIndex="adgroup"
                            key="adgroup"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Keyword"
                            dataIndex="Keyword"
                            key="Keyword"
                            :width=120
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column 
                          title="Bid" 
                          dataIndex="Bid" 
                          key="Bid"
                          :width=50>
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Traffic"
                            dataIndex="Traffic"
                            key="Traffic"
                            :width=50
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                    </a-tabs>
                  </template>
                </a-col>
                <a-col
                  :span="24"
                  style="padding: 0 16px"
                  v-if="Object.entries(corePlannerResult).length === 0"
                >
                  <div style="width: 100%">
                    <a-button
                      type="primary"
                      style="display: block; margin: 40px auto;"
                      :loading="sendRequestCoreLoading"
                      @click="sendRequestCore"
                      >Send Request</a-button
                    >
                  </div>
                </a-col>
              </a-row>
            </a-tab-pane>
            <!-- Competitor part -->
            <a-tab-pane tab="Competition Keywords" key="3">
              <a-row :gutter="32">
                <a-col :span="12" style="padding: 0 16px">
                  <h3 style="margin-left: 5px">Competition Keywords (Japanese)</h3>
                  <a-input
                    style="margin: 5px"
                    placeholder="Insert additional keywords"
                    v-model="additionalKeyword.competitionJA"
                  >
                    <a-icon
                      slot="addonAfter"
                      type="plus"
                      @click="additionalKeywordAdd('competitionKeywordsJA')"
                    />
                  </a-input>
                  <template v-for="(tag, index) in keywords.competitionKeywordsJA">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="
                        () =>
                          removeKeyword({ tag: tag, type: 'competitionKeywordsJA' })
                      "
                    >
                      {{ tag }}
                    </a-tag>
                  </template>
                </a-col>
                <a-col :span="12" style="padding: 0 16px">
                  <h3 style="margin-left: 5px">Competition Keywords (English)</h3>
                  <a-input
                    style="margin: 5px"
                    placeholder="Insert additional keywords"
                    v-model="additionalKeyword.competitionEN"
                  >
                    <a-icon
                      slot="addonAfter"
                      type="plus"
                      @click="additionalKeywordAdd('competitionKeywordsEN')"
                    />
                  </a-input>
                  <template v-for="(tag, index) in keywords.competitionKeywordsEN">
                    <a-tag
                      :key="tag"
                      :closable="index !== 0"
                      :afterClose="
                        () =>
                          removeKeyword({ tag: tag, type: 'competitionKeywordsEN' })
                      "
                    >
                      {{ tag }}
                    </a-tag>
                  </template>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <template
                    v-if="Object.entries(competitionPlannerResult).length !== 0"
                  >
                    <a-tabs
                      defaultActiveKey="1"
                      style="padding-top: 15px; margin: 5px;"
                    >
                      <a-tab-pane tab="Campaigns" key="1">
                        <a-table
                          :rowKey="record => record.Campaign_Name"
                          :dataSource="competitionPlannerResult.ja_campaign"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Allocation"
                            dataIndex="Allocation"
                            key="Allocation"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Volume"
                            dataIndex="Volume"
                            key="Volume"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                      <a-tab-pane tab="Keywords" key="2">
                        <a-table
                          :rowKey="record => record.Keyword"
                          :dataSource="competitionPlannerResult.ja_keyword"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240, x: 380 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Ad Group"
                            dataIndex="adgroup"
                            key="adgroup"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Keyword"
                            dataIndex="Keyword"
                            key="Keyword"
                            :width=120
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column 
                          title="Bid" 
                          dataIndex="Bid" 
                          key="Bid"
                          :width=50>
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Traffic"
                            dataIndex="Traffic"
                            key="Traffic"
                            :width=50
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                    </a-tabs>
                  </template>
                </a-col>
                <a-col :span="12">
                  <template
                    v-if="Object.entries(competitionPlannerResult).length !== 0"
                  >
                    <a-tabs
                      defaultActiveKey="1"
                      style="padding-top: 15px; margin: 5px;"
                    >
                      <a-tab-pane tab="Campaigns" key="1">
                        <a-table
                          :rowKey="record => record.Campaign_Name"
                          :dataSource="competitionPlannerResult.en_campaign"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Allocation"
                            dataIndex="Allocation"
                            key="Allocation"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Volume"
                            dataIndex="Volume"
                            key="Volume"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                      <a-tab-pane tab="Keywords" key="2">
                        <a-table
                          :rowKey="record => record.Keyword"
                          :dataSource="competitionPlannerResult.en_keyword"
                          size="small"
                          :loading="tableLoading"
                          :pagination="{ pageSize: 50 }"
                          :scroll="{ y: 240, x: 380 }"
                        >
                          <a-table-column
                            title="Campaign Name"
                            dataIndex="Campaign_Name"
                            key="Campaign_Name"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Ad Group"
                            dataIndex="adgroup"
                            key="adgroup"
                            :width=80
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Keyword"
                            dataIndex="Keyword"
                            key="Keyword"
                            :width=120
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                          <a-table-column 
                          title="Bid" 
                          dataIndex="Bid" 
                          key="Bid"
                          :width=50>
                            <template slot-scope="text">
                              {{ truncate_float(text) }}
                            </template>
                          </a-table-column>
                          <a-table-column
                            title="Traffic"
                            dataIndex="Traffic"
                            key="Traffic"
                            :width=50
                          >
                            <template slot-scope="text">
                              {{ text }}
                            </template>
                          </a-table-column>
                        </a-table>
                      </a-tab-pane>
                    </a-tabs>
                  </template>
                </a-col>
                <a-col
                  :span="24"
                  style="padding: 0 16px"
                  v-if="Object.entries(competitionPlannerResult).length === 0"
                >
                  <div style="width: 100%">
                    <a-button
                      type="primary"
                      style="display: block; margin: 40px auto;"
                      :loading="sendRequestCompetitionLoading"
                      @click="sendRequestCompetition"
                      >Send Request</a-button
                    >
                  </div>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </div>
    <div class="steps-action" style="padding-top: 20px;">
      <a-button
        v-if="current < steps.length - 1"
        type="primary"
        @click="sendKeywords"
        :loading="confirmNext"
      >
        Next
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
        Start Again
      </a-button>
    </div>
  </div>
</template>
<script>
import categoryData from "@/assets/data/result.json";
import { keywordPlanner, brandPlanner, corePlanner, competitionPlanner } from "@/api";
export default {
  data() {
    return {
      current: 0,
      steps: [
        {
          title: "Campaign Information"
        },
        {
          title: "Keywords"
        }
      ],
      categoryData: categoryData,
      CampaignInformation: {
        brandName: "",
        brandNameEN: "",
        selectedCategories: [],
        budget: "",
        languageSwitch: false,
        productName: "",
        productNameEN: "",
        landingURL: ""
      },
      categorySelected: {
        level_1: "",
        level_2: "",
        level_3: "",
        level_4: "",
        level_5: ""
      },
      keywords: {
        brandKeywordsJA: [],
        brandKeywordsEN: [],
        coreKeywordsJA: [],
        coreKeywordsEN: [],
        competitionKeywordsJA: [],
        competitionKeywordsEN: []
      },
      confirmNext: false,
      additionalKeyword: {
        brandJA: "",
        brandEN: "",
        coreJA: "",
        coreEN: "",
        competitionJA: "",
        competitionEN: "",
      },
      sendRequestBrandLoading: false,
      sendRequestCoreLoading: false,
      sendRequestCompetitionLoading: false,
      brandPlannerResult: {},
      corePlannerResult: {},
      competitionPlannerResult: {},
      tableLoading: false
    };
  },
  methods: {
    sendKeywords() {
      if(this.errors.items.length === 0) {
        this.confirmNext = true;
        keywordPlanner({
          brand: this.CampaignInformation.brandName,
          brand_en: this.CampaignInformation.brandNameEN,
          budget: this.CampaignInformation.budget,
          categories: this.CampaignInformation.selectedCategories,
          english_switch: this.CampaignInformation.languageSwitch,
          product: this.CampaignInformation.productName,
          product_en: this.CampaignInformation.productNameEN,
          url: this.CampaignInformation.landingURL
    
        })
          .then(response => {
            console.log(response)
            this.confirmNext = false;
            this.keywords.brandKeywordsJA = response.data.ja_keywords;
            this.keywords.brandKeywordsEN = response.data.en_keywords;
            this.keywords.coreKeywordsJA = response.data.ja_core_keywords;
            this.keywords.coreKeywordsEN = response.data.en_core_keywords;
            this.keywords.competitionKeywordsJA = response.data.ja_competitor_keywords;
            this.keywords.competitionKeywordsEN = response.data.en_competitor_keywords;
            this.current++;
          })
          .catch(() => {
            this.confirmNext = false;
            this.$message.error("Please fill all fields");
          });
      } else {
        this.$message.error("Please fill required fields of the form. " )

      }

    },
    prev() {
      this.current--;
      let self = this;
      (self.brandPlannerResult = {}),
        (self.corePlannerResult = {}),
        (self.keywords = {}),
        (self.CampaignInformation.selectedCategories = new Array()),
        (self.categorySelected = {});
        (self.brandPlannerResult= {});
        (self.corePlannerResult= {});
        (self.competitionPlannerResult= {});
    },
    onLanguageSwitch(checked) {
      this.CampaignInformation.languageSwitch = checked;
    },
    categoryChange(level) {
      let self = this;
      Object.keys(self.categorySelected).forEach(key => {
        if (parseInt(level) < parseInt(key.split("_")[1])) {
          self.categorySelected[key] = "";
        }
      });
    },
    categoryChecked(e) {
      let self = this;
      if (e.target.checked && e.target.value != "") {
        self.CampaignInformation.selectedCategories.push(e.target.value);
      } else {
        let index = self.CampaignInformation.selectedCategories.indexOf(
          e.target.value
        );
        self.CampaignInformation.selectedCategories.splice(index, 1);
      }
    },
    removeKeyword(value) {
      if (value.type == "brandKeywordsJA") {
        let index = this.keywords.brandKeywordsJA.indexOf(value.tag);
        this.keywords.brandKeywordsJA.splice(index, 1);
      }
      if (value.type == "brandKeywordsEN") {
        let index = this.keywords.brandKeywordsEN.indexOf(value.tag);
        this.keywords.brandKeywordsEN.splice(index, 1);
      }
      if (value.type == "coreKeywordsJA") {
        let index = this.keywords.coreKeywordsJA.indexOf(value.tag);
        this.keywords.coreKeywordsJA.splice(index, 1);
      }
      if (value.type == "coreKeywordsEN") {
        let index = this.keywords.coreKeywordsEN.indexOf(value.tag);
        this.keywords.coreKeywordsEN.splice(index, 1);
      }
    },
    additionalKeywordAdd(type) {
      if (type == "brandKeywordsJA") {
        if (
          !this.keywords.brandKeywordsJA.includes(
            this.additionalKeyword.brandJA
          )
        ) {
          this.keywords.brandKeywordsJA.push(this.additionalKeyword.brandJA);
          this.additionalKeyword.brandJA = "";
          this.$message.success("Keyword successfully added!");
        } else {
          this.$message.error("Keyword is duplicated!");
        }
      }
      if (type == "brandKeywordsEN") {
        if (
          !this.keywords.brandKeywordsEN.includes(
            this.additionalKeyword.brandEN
          )
        ) {
          this.keywords.brandKeywordsEN.push(this.additionalKeyword.brandEN);
          this.additionalKeyword.brandEN = "";
          this.$message.success("Keyword successfully added!");
        } else {
          this.$message.error("Keyword is duplicated!");
        }
      }
      if (type == "coreKeywordsJA") {
        if (
          !this.keywords.coreKeywordsJA.includes(this.additionalKeyword.coreJA)
        ) {
          this.keywords.coreKeywordsJA.push(this.additionalKeyword.coreJA);
          this.additionalKeyword.coreJA = "";
          this.$message.success("Keyword successfully added!");
        } else {
          this.$message.error("Keyword is duplicated!");
        }
      }
      if (type == "coreKeywordsEN") {
        if (
          !this.keywords.coreKeywordsEN.includes(this.additionalKeyword.coreEN)
        ) {
          this.keywords.coreKeywordsEN.push(this.additionalKeyword.coreEN);
          this.additionalKeyword.coreEN = "";
          this.$message.success("Keyword successfully added!");
        } else {
          this.$message.error("Keyword is duplicated!");
        }
      }
      if (type == "competitionKeywordsJA"){
        if (
          !this.keywords.competitionKeywordsJA.includes(this.additionalKeyword.competitionJA)
        ) {
          this.keywords.competitionKeywordsJA.push(this.additionalKeyword.competitionJA);
          this.additionalKeyword.competitionJA = "";
          this.$message.success("Keyword successfully added!");
        } else {
          this.$message.error("Keyword is duplicated!");
        }
      }
      if (type == "competitionKeywordsEN"){
        if (
          !this.keywords.competitionKeywordsEN.includes(this.additionalKeyword.competitionEN)
        ) {
          this.keywords.competitionKeywordsEN.push(this.additionalKeyword.competitionEN);
          this.additionalKeyword.competitionEN = "";
          this.$message.success("Keyword successfully added!");
        } else {
          this.$message.error("Keyword is duplicated!");
        }
      }
    },
    sendRequestBrand() {
      this.sendRequestBrandLoading = true;
      brandPlanner({
        categories: this.CampaignInformation.selectedCategories,
        brand: this.CampaignInformation.brandName,
        product: this.CampaignInformation.productName,
        en_keywords: this.keywords.brandKeywordsEN,
        ja_keywords: this.keywords.brandKeywordsJA,
        budget: this.CampaignInformation.budget,
        url: this.CampaignInformation.landingURL,
        brand_en: this.CampaignInformation.brandNameEN,
        product_en: this.CampaignInformation.productNameEN
      })
        .then(response => {
          this.sendRequestBrandLoading = false;
          this.brandPlannerResult = response.data;
        })
        .catch(() => {
          this.$message.error("Error");
        });
    },
    sendRequestCore() {
      this.sendRequestCoreLoading = true;
      corePlanner({
        core_en: this.keywords.coreKeywordsEN,
        core_ja: this.keywords.coreKeywordsJA,
        budget: this.CampaignInformation.budget,
        english_switch: this.CampaignInformation.languageSwitch
      }).then(response => {
        this.sendRequestCoreLoading = false;
        this.corePlannerResult = response.data;
      });
    },
    sendRequestCompetition() {
      this.sendRequestCompetitionLoading = true;
      competitionPlanner({
        competition_en: this.keywords.competitionKeywordsEN,
        competition_ja: this.keywords.competitionKeywordsJA,
        budget: this.CampaignInformation.budget,
        english_switch: this.CampaignInformation.languageSwitch,
        brand_ja: this.CampaignInformation.brandName,
        brand_en: this.CampaignInformation.brandNameEN,
        product_ja: this.CampaignInformation.productName,
        product_en: this.CampaignInformation.productNameEN,
      }).then(response => {
        this.sendRequestCompetitionLoading = false;
        this.competitionPlannerResult = response.data;
      });
    },
    truncate_float(value) {
      if (value == null) return "INF";
      else return value.toFixed(2);
    }
  }
};
</script>
<style scoped>
.steps-content {
  margin-top: 32px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 60vh;
  padding: 0 25px;
}

.steps-action {
  margin-top: 8px;
}
.form-label {
  margin-bottom: 8px;
}
.padding-top__20 {
  padding-top: 20px;
  padding-left: 8px !important;
  padding-right: 8px !important;
}
.ant-tag {
  margin: 5px 5px;
}
</style>
