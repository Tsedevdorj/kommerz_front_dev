<template>
  <div>
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <h2>Domain Management</h2>
      </a-col>
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <div style="float:right; margin-bottom: 0.5em;">
          <a-button
            type="primary"
            shape="circle"
            icon="plus"
            @click="showDomainAdd"
          />
          <a-modal
            title="Add Domain"
            v-model="domainAddVisible"
            @ok="handleAddDomain"
            :confirmLoading="confirmLoadingDomain"
          >
            <a-row type="flex" :gutter="16" style="padding-bottom: 10px;">
              <a-col :span="24" :order="1" style="padding-bottom: 15px;">
                <label>Company Name:</label>
                <div style="margin: 4px 0" />
                <a-input
                  placeholder="Company"
                  v-model="addDomain.companyName"
                />
              </a-col>
              <a-col :span="24" :order="2" style="padding-bottom: 15px;">
                <label>Domain Name:</label>
                <div style="margin: 4px 0" />
                <a-input placeholder="Domain" v-model="addDomain.domainName" />
              </a-col>
            </a-row>
          </a-modal>
        </div>
      </a-col>
    </a-row>
    <a-table
      :rowKey="record => record.domain_id"
      :dataSource="domainList"
      :loading="loading"
      size="middle"
      style="padding-bottom: 20px;"
    >
      <a-table-column title="ID" dataIndex="domain_id" key="id">
      </a-table-column>
      <a-table-column
        title="Company Name"
        dataIndex="company_name"
        key="company_name"
        :sorter="(a, b) => a.company_name.length - b.company_name.length"
      >
      </a-table-column>
      <a-table-column
        title="Domain Name"
        dataIndex="domain"
        key="domain"
        :sorter="(a, b) => a.domain.length - b.domain.length"
      >
      </a-table-column>
      <a-table-column
        title="Registered on"
        dataIndex="registered_on"
        key="registered_on"
      >
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
              @click="deleteDomain(record.domain_id)"
              ghost
              >Delete</a-button
            >
          </div>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { domainList, domainDelete, domainAdd } from "@/api";

export default {
  name: "domainmanagement",
  data() {
    return {
      domainList: [],
      loading: false,
      domainAddVisible: false,
      confirmLoadingDomain: false,
      addDomain: {
        domainName: "",
        companyName: ""
      },
      responseError: {}
    };
  },
  methods: {
    getDomainList() {
      domainList()
        .then(response => {
          this.domainList = response.data.domains;
        })
        .catch(error => {
          this.responseError = error.response.data;
        });
    },
    showDomainAdd() {
      this.domainAddVisible = true;
    },
    handleAddDomain() {
      this.confirmLoadingDomain = true;
      setTimeout(() => {
        domainAdd({
          company_name: this.addDomain.companyName,
          domain: this.addDomain.domainName
        })
          .then(() => {
            this.getDomainList();
            this.$message.success("Domain added");
            this.confirmLoadingDomain = false;
            this.domainAddVisible = false;
          })
          .catch(error => {
            this.responseError = error.response.data;
          });
      }, 2000);
    },
    deleteDomain(id) {
      domainDelete({
        domain_id: id
      })
        .then(() => {
          this.getDomainList();
          this.$message.success("Domain deleted");
        })
        .catch(error => {
          this.responseError = error.response.data;
        });
    }
  },
  mounted() {
    this.getDomainList();
  }
};
</script>
