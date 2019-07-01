<template>
  <div>
    <a-row :gutter="48" style="padding-bottom: 10px;">
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <h2>User Management</h2>
      </a-col>
      <a-col :lg="{ span: 12 }" :xl="{ span: 12 }">
        <div style="float:right; margin-bottom: 0.5em;">
          <a-button type="primary" shape="circle" icon="user-add" />
          <a-modal title="Add User">
            <a-row type="flex" :gutter="16" style="padding-bottom: 10px;">
              <a-col :span="24" :order="1" style="padding-bottom: 15px;">
                <label>Email:</label>
                <div style="margin: 4px 0" />
                <a-input placeholder="Email" />
              </a-col>
            </a-row>
          </a-modal>
        </div>
      </a-col>
    </a-row>
    <a-table
      :rowKey="record => record.user_id"
      :dataSource="userList"
      :loading="loading"
      size="middle"
      style="padding-bottom: 20px;"
    >
      <a-table-column title="ID" dataIndex="user_id" key="id"> </a-table-column>
      <a-table-column
        title="Email"
        dataIndex="email"
        key="email"
        :sorter="(a, b) => a.email.length - b.email.length"
      >
      </a-table-column>
      <a-table-column
        title="Status"
        dataIndex="is_active"
        key="status"
        :sorter="(a, b) => a.is_active - b.is_active"
      >
        <template slot-scope="text, record">
          <a-tag
            color="green"
            v-if="record.is_active == 1"
            :key="record.is_active"
            >Active</a-tag
          >
          <a-tag
            color="red"
            v-if="record.is_active == 0"
            :key="record.is_active"
            >Inactive</a-tag
          >
        </template>
      </a-table-column>
      <a-table-column
        title="Role"
        dataIndex="role"
        key="role"
        :sorter="(a, b) => a.role - b.role"
      >
        <template slot-scope="text, record">
          <a-tag color="blue" v-if="record.role == 1" :key="record.role"
            >User</a-tag
          >
          <a-tag color="blue" v-if="record.role == 2" :key="record.role"
            >Admin</a-tag
          >
          <a-tag color="blue" v-if="record.role == 3" :key="record.role"
            >Super Admin</a-tag
          >
        </template>
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
            <a-button-group>
              <a-button
                type="danger"
                @click="dectivateUser(record.user_id)"
                v-if="record.is_active == 1"
                ghost
                >Deactivate</a-button
              >
              <a-button
                type="primary"
                @click="activateUser(record.user_id)"
                v-if="record.is_active == 0"
                ghost
                >Activate</a-button
              >
              <a-popconfirm
                placement="topLeft"
                okText="Change"
                cancelText="Cancel"
                @confirm="changeRole(record.user_id)"
              >
                <a-icon
                  slot="icon"
                  type="user"
                  style="color: green; margin-top: 5px;"
                />
                <template slot="title">
                  <a-select
                    placeholder="Choose Role"
                    v-model="userRole"
                    style="width: 160px"
                  >
                    <a-select-option value="1">User</a-select-option>
                    <a-select-option value="2">Admin</a-select-option>
                    <a-select-option value="3">Super Admin</a-select-option>
                  </a-select>
                </template>
                <a-button type="primary" ghost>Change Role</a-button>
              </a-popconfirm>
            </a-button-group>
          </div>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { userList, adminUserUpdate } from "@/api";

export default {
  name: "usermanagement",
  data() {
    return {
      userList: [],
      loading: false,
      userRole: "",
      responseError: {}
    };
  },
  methods: {
    getUserList() {
      userList()
        .then(response => {
          this.userList = response.data.users;
        })
        .catch(error => {
          this.responseError = error.response.data;
        });
    },
    dectivateUser(id) {
      adminUserUpdate({
        user_id: id,
        is_active: 0
      })
        .then(() => {
          this.$message.success("User deactivated");
          this.getUserList();
        })
        .catch(error => {
          this.responseError = error.response.data;
        });
    },
    activateUser(id) {
      adminUserUpdate({
        user_id: id,
        is_active: 1
      })
        .then(() => {
          this.$message.success("User activated");
          this.getUserList();
        })
        .catch(error => {
          this.responseError = error.response.data;
        });
    },
    changeRole(user) {
      adminUserUpdate({
        user_id: user,
        role: this.userRole
      })
        .then(() => {
          this.$message.success("User role changed");
          this.userRole = "";
          this.getUserList();
        })
        .catch(error => {
          this.responseError = error.response.data;
        });
    }
  },
  mounted() {
    this.getUserList();
  }
};
</script>
