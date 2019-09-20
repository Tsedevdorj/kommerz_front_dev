<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      <a-icon type="plus" /> New competitor
    </a-button>
    <a-drawer
      title="Create a new competitor"
      :width="720"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
          <div v-for="(k, index) in form.getFieldValue('keys')"
                :key="k">
            <a-row :gutter="16">
                    <a-form-item
                        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
                        :label="'Competitor ' + (index + 1)"
                        :required="false"
                        >
                        <a-input
                            v-decorator="[
                            `brands[${k}]`,
                            {
                                validateTrigger: ['change', 'blur'],
                                rules: [{
                                required: true,
                                whitespace: true,
                                message: 'Please input competitor\'s name or delete this field.',
                                }],
                            }
                            ]"
                            placeholder="client name"
                            style="width: 60%; margin-right: 8px"
                        />
                        <a-icon
                            v-if="form.getFieldValue('keys').length > 1"
                            class="dynamic-delete-button"
                            type="minus-circle-o"
                            :disabled="form.getFieldValue('keys').length === 1"
                            @click="() => remove(k)"
                        />
                        </a-form-item>
                
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item
     
                    :required="false"
                    >

                        <a-radio-group
                            v-decorator="[
                            `publics[${k}]`,
                            {
                                initialValue: 'private',
                            }
                            ]"
                        >
                            <a-radio value='public'>Public</a-radio>
                            <a-radio value='private'>Private</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item

         
                    :required="false"
                    >
                        <a-input
                            v-decorator="[`urls[${k}]`, {
                            rules: [{ required: true, message: 'please enter url' }]
                            }]"
                            style="width: 100%"
                            addonBefore="http://"
                            placeholder="please enter url"
                        />

                    </a-form-item>
                </a-col>
            </a-row>
                <a-divider />
          </div>
                <a-form-item v-bind="formItemLayoutWithOutLabel">
                <a-button
                    type="dashed"
                    style="width: 60%"
                    @click="add"
                >
                    <a-icon type="plus" /> Add
                </a-button>
                </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          Cancel
        </a-button>
        <a-button @click="onSubmit" type="primary">Submit</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { competitorCreate } from "@/api";

let id = 0;
import { Modal } from 'ant-design-vue'
export default {
    name: "competitorform",
    props: {
        CampaignInformation: Object,
    },

    data() {
        return {
        formItemLayout: {
            labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
            },
            wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
            },
        },
        formItemLayoutWithOutLabel: {
            wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
            },
        },
        visible: false,
        CampaignBasicInfo: this.CampaignInformation,
        }
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
        this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
    },
    methods: {
        remove  (k) {
            const { form } = this;
            // can use data-binding to get
            const keys = form.getFieldValue('keys');
            // We need at least one passenger
            if (keys.length === 1) {
                return;
            }

            // can use data-binding to set
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        },
        add  () {
            const { form } = this;
            // can use data-binding to get
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(++id);
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
            keys: nextKeys,
            });
        },
        showDrawer() {
        this.visible = true
        },
        onClose() {
        this.visible = false;
        console.log(this.CampaignBasicInfo);
        },
        onSubmit(){
            if (!this.CampaignBasicInfo.brandName || !this.CampaignBasicInfo.productName || this.CampaignBasicInfo.selectedCategories.length === 0){
                this.$error({
                    title: 'Error message',
                    content: 'Fill campaign basic informations',
                });
            }
            else{
                this.form.validateFields((err, values) => {
                    if (!err) {
                    console.log('Received values of form: ', values);
                        if (values.keys.length === 0){
                            this.$error({
                                title: 'Error message',
                                content: 'At least need one competitor',
                            });
                        }
                        else{
                            let result = Array();
                            values.keys.forEach((k) => {
                                result.push({
                                    brand: values.brands[k],
                                    url: values.urls[k],
                                    public: values.publics[k],
                                });
                            });
                            console.log(result);
                            competitorCreate({
                                brand: this.CampaignBasicInfo.brandName,
                                brand_en: this.CampaignBasicInfo.brandNameEN,
                                budget: this.CampaignBasicInfo.budget,
                                categories: this.CampaignBasicInfo.selectedCategories,
                                product: this.CampaignBasicInfo.productName,
                                product_en: this.CampaignBasicInfo.productNameEN,
                                url: this.CampaignBasicInfo.landingURL,
                                competitors: result
                                })
                                .then(response => {
                                    this.$message.success("Competitors successfully added!");
                                })
                                 .catch(() => {
                                    this.confirmNext = false;
                                    this.$message.error("Error occured");
                                });
                        }
                        
                    }
                });   

            }
        }
    },
}
</script>
<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all .3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>