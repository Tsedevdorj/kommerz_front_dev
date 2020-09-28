<template>
  <div class="heatmap">
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :span="9">
        <label>Account: </label>
        <a-select
          style="width: 300px"
          placeholder="Select Account"
          @change="handleChangeProfile"
          v-model="selectedProfile"
        >
          <a-select-option
            v-for="(item, index) in availableProfiles"
            :key="index"
            :value="item.profileId"
            >{{ item.accountName }}</a-select-option
          >
        </a-select>
      </a-col>
      <a-col :span="9">
        <label>Asins: </label>
        <a-select
          style="width: 300px"
          placeholder="Select Portfolio"
          @change="handleChangeProduct"
          v-model="selectedProduct"
        >
          <a-select-option
            v-for="(item, index) in availableProducts"
            :key="index"
            :value="item.id"
            >{{ item.asin }}</a-select-option
          >
        </a-select>
      </a-col>
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 60px;">
      <label>Image rank on Amazon: </label>
      <a-carousel arrows dots-class="slick-dots slick-thumb">
        <!-- <div
          slot="prevArrow"
          slot-scope="props"
          class="custom-slick-arrow"
          style="left: 10px;zIndex: 1"
        >
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div> -->
        <a slot="customPaging" slot-scope="props">
          <img :src="getImgUrl(props.i)" />
        </a>
        <div v-for="item in imageObject">
          <img :src="item.image_path" />
        </div>
      </a-carousel>
    </a-row>
    <a-row :gutter="48" style="padding-bottom: 90px;">
      <a-col>
        <label>Image rank after Heatmap Algorithm: </label>
        <a-carousel arrows dots-class="slick-dots slick-thumb">
          <!-- <div
            slot="prevArrow"
            slot-scope="props"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 1"
          >
            <a-icon type="left-circle" />
          </div>
          <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
            <a-icon type="right-circle" />
          </div> -->
          <a slot="customPaging" slot-scope="props">
            <img :src="getImgUrlHeatmap(props.i)" />
            
          </a>
          <div v-for="item in imageObjectHeatmap">
            <img :src="item.image_path_heatmap" />
            <span> {{item.image_score}}</span>
          </div>
        </a-carousel>
      </a-col>
    </a-row>
  </div>
</template>

<script>
// Danish provided tracking script START
window.__lo_site_id = 162488;

(function() {
  var wa = document.createElement("script");
  wa.type = "text/javascript";
  wa.async = true;
  wa.src = "https://d10lpsik1i8c69.cloudfront.net/w.js";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wa, s);
})();
// Danish provided tracking script END

import {
  list_basic_portfolios,
  list_basic_profiles,
  list_basic_campaigns,
  keywordReport,
  get_product_listing,
  get_product_listing_images
} from "@/api";

export default {
  name: "heatmap",
  data() {
    return {
      availableCampaigns: [],
      loading: true,
      responseError: {},
      selectProfile: "",
      availableProfiles: [],
      availableProducts: [],
      selectedProfile: "",
      selectedProduct: "",
      selectedCampaign: "",
      asinChurnerData: [],
      imageObject: [],
      imageObjectHeatmap: []
    };
  },
  methods: {
    getImgUrl(i) {
      return this.imageObject[i].image_path;
    },
    getImgUrlHeatmap(i) {
      return this.imageObjectHeatmap[i].image_path_heatmap;
    },
    getProfilesList() {
      list_basic_profiles()
        .then(response => {
          this.availableProfiles = response.data.data;
          this.loading = false;
          console.log(this.availableProfiles);
        })
        .catch(error => {
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          // this.$router.push({ name: "keywordchurner"});
        });
    },
    handleChangeProfile(value) {
      this.loading = true;
      console.log(value);
      this.selectedProduct = "";
      this.availableProducts = [];
      get_product_listing()
        .then(response => {
          this.availableProducts = response.data.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner" });
        });
    },
    handleChangeProduct(value) {
      this.loading = true;
      console.log(value);
      this.selectedCampaign = "";
      this.availableCampaigns = [];
      get_product_listing_images(this.selectedProduct)
        .then(response => {
          console.log(response.data);
          this.imageObject = response.data.data;
          this.imageObjectHeatmap = this.imageObject
            .slice()
            .sort(function(a, b) {
              if (a.value > b.value) {
                return -1;
              } else return 1;
            });
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner" });
        });
    },
    handleChangeCampaign(value) {
      this.loading = true;
      console.log(value);
      this.asinChurnerData = [];
      keywordReport({
        campaignId: value,
        isKeywordTargeting: false,
        isAsinChurner: true
      })
        .then(response => {
          this.asinChurnerData = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.responseError = error.response.data.message;
          this.$message.error("Error: " + this.responseError);
          this.$router.push({ name: "keywordchurner" });
        });
    },

    goCampaignRecord(id) {
      this.$router.push({ name: "keywordcampaigndetails", params: { id } });
    }
  },
  mounted() {
    this.getProfilesList();
  }
};
</script>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
