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
