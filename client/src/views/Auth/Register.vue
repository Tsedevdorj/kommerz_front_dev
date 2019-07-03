<template>
  <a-row type="flex" justify="center" align="middle">
    <a-col :span="12" class="login_form">
      <img src="@/assets/logo.png" style="margin: 100px 0" />
      <a-form type="inline">
        <a-form-item>
          <a-input name="email" v-model="email" placeholder="Email">
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            @click="register"
            :loading="confirmLoading"
          >
            Register
          </a-button>
        </a-form-item>
        <router-link :to="{ name: 'login' }">
          <span class="login-form-forgot">
            Go Back to Login
          </span>
        </router-link>
      </a-form></a-col
    >
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      confirmLoading: false,
      responseError: {}
    };
  },
  methods: {
    register() {
      this.confirmLoading = true;
      this.$store
        .dispatch("register", {
          email: this.email
        })
        .then(() => {
          this.confirmLoading = false;
          this.$router.push({ name: "login" });
          this.$message.success(`Successfully registered ${this.email}!`);
        })
        .catch(error => {
          this.responseError = error.response.data.msg;
          this.$message.error("Error: " + this.responseError);
        });
    }
  }
};
</script>

<style scoped>
.login_form {
  width: 300px;
  text-align: center;
}
.login-form-forgot {
  float: right;
}
</style>
