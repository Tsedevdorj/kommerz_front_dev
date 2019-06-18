<template>
  <div style="padding-bottom: 40px;">
    <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content" v-if="current == 0">
      <a-row :gutter="32">
        <a-col :span="12">
          <div class="form-label">
            <label>Brand Name</label>
          </div>
          <a-input
            v-model="CampaignInformation.brandName"
            placeholder="Brand Name in Japanese"
          ></a-input>
        </a-col>
        <a-col :span="12">
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
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select defaultValue="lucy" style="width: 80%">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 2</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select defaultValue="lucy" style="width: 80%">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 3</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select defaultValue="lucy" style="width: 80%">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5" class="padding-top__20">
          <div class="form-label">
            <label>Level 4</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select defaultValue="lucy" style="width: 80%">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4" class="padding-top__20">
          <div class="form-label">
            <label>Level 5</label>
          </div>
          <a-checkbox style="padding-right: 10px;"></a-checkbox>
          <a-select defaultValue="lucy" style="width: 80%">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
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
    <div class="steps-content" v-if="current == 2">Step 3</div>
    <div class="steps-action">
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
          title: "Brand Keywords"
        },
        {
          title: "Core Keywords"
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
        productNameEN: ""
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
    }
  }
};
</script>
<style scoped>
.steps-content {
  margin-top: 24px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 60vh;
  padding: 25px;
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
