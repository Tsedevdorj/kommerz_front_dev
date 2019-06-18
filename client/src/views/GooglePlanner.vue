<template>
  <div style="padding-bottom: 40px;">
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content" v-if="current == 0">
      <a-row :gutter="32">
        <a-col :span="12" class="padding-top__20">
          <div class="form-label">
            <label>Brand Name</label>
          </div>
          <a-input
            v-model="CampaignInformation.brandName"
            placeholder="Brand Name in Japanese"
          ></a-input>
        </a-col>
        <a-col :span="12" class="padding-top__20">
          <div class="form-label">
            <label>Product Name</label>
          </div>
          <a-input
            v-model="CampaignInformation.productName"
            placeholder="Product Name in Japanese"
          ></a-input>
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
              <label>Brand Name in English</label>
            </div>
            <a-input
              v-model="CampaignInformation.brandNameEN"
              placeholder="Brand Name in English"
            ></a-input>
          </a-col>
          <a-col :span="12" class="padding-top__20">
            <div class="form-label">
              <label>Product Name in English</label>
            </div>
            <a-input
              v-model="CampaignInformation.productNameEN"
              placeholder="Product Name in English"
            ></a-input>
          </a-col>
        </div>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 1</label>
          </div>
          <a-checkbox style="padding-right: 10px;" @change="categoryChecked"></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            @change="categoryChange"
          >
            <a-select-option
              v-for="(label, id) in categoryData"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 2</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            @change="categoryChange"
            :disabled="categorySelected.level_1.length == 0"
          >
            <a-select-option
              v-for="(label, id) in categoryDataLevel.level_2"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 3</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            @change="categoryChange"
            :disabled="categorySelected.level_2.length == 0"
          >
            <a-select-option
              v-for="(label, id) in categoryDataLevel.level_3"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 4</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            @change="categoryChange"
            :disabled="categorySelected.level_3.length == 0"
          >
            <a-select-option
              v-for="(label, id) in categoryDataLevel.level_4"
              :value="id"
              :key="id"
              >{{ label.Category }}</a-select-option
            >
          </a-select>
        </a-col>
        <a-col :span="4" class="padding-top__20">
          <div class="form-label">
            <label>Level 5</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select
            style="width: 80%"
            showSearch
            placeholder="Please select a value"
            @change="categoryChange"
            :disabled="categorySelected.level_4.length == 0"
          >
            <a-select-option
              v-for="(label, id) in categoryDataLevel.level_5"
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
            v-model="CampaignInformation.budget"
            placeholder="Budget"
          ></a-input>
        </a-col>
        <a-col :span="24" class="padding-top__20">
          <div class="form-label">
            <label>Landing URL</label>
          </div>
          <a-input placeholder="Landing URL"></a-input>
        </a-col>
      </a-row>
    </div>
    <div class="steps-content" v-if="current == 1">Step 2</div>
    <div class="steps-action" style="padding-top: 20px;">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">
        Next
      </a-button>
      <a-button
        v-if="current == steps.length - 1"
        type="primary"
        @click="$message.success('Processing complete!')"
      >
        Done
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
        Previous
      </a-button>
    </div>
  </div>
</template>
<script>
import categoryData from "@/assets/data/result.json";
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
      categoryDataLevel: {},
      CampaignInformation: {
        brandName: "",
        brandNameEN: "",
        selectedCategories: [],
        budget: "",
        languageSwitch: false,
        productName: "",
        productNameEN: ""
      },
      categorySelected: {
        level_1: "",
        level_2: "",
        level_3: "",
        level_4: "",
        level_5: ""
      }
    };
  },
  methods: {
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    },
    onLanguageSwitch(checked) {
      this.CampaignInformation.languageSwitch = checked;
    },
    categoryChange(value) {
      console.log(value)
      if(value in this.categoryData) {
        if (this.categoryData[value].level_num == 1) {
          this.categorySelected.level_1 = value;
          this.categoryDataLevel.level_2 = this.categoryData[value].children
          this.CampaignInformation.selectedCategories.push(value)
        } 
      }
      else if(value in this.categoryDataLevel.level_2) {
        if (this.categoryDataLevel.level_2[value].level_num == 2) {
          this.categorySelected.level_2 = value;
          this.categoryDataLevel.level_3 = this.categoryDataLevel.level_2[value].children
        } 
      }
      else if(value in this.categoryDataLevel.level_3) {
        if (this.categoryDataLevel.level_3[value].level_num == 3) {
          this.categorySelected.level_3 = value;
          this.categoryDataLevel.level_4 = this.categoryDataLevel.level_3[value].children
        } 
      }
      else if(value in this.categoryDataLevel.level_4) {
        if (this.categoryDataLevel.level_4[value].level_num == 4) {
          this.categorySelected.level_4 = value;
          this.categoryDataLevel.level_5 = this.categoryDataLevel.level_4[value].children
        }  
      }
      else if(value in this.categoryDataLevel.level_5) {
        if (this.categoryDataLevel.level_5[value].level_num == 5) {
          this.categorySelected.level_4 = value;
          this.categoryDataLevel.level_5 = this.categoryDataLevel.level_4[value].children
        } 
      }
    },
    categoryChecked(e) {
      console.log(e.target.checked)
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
</style>
