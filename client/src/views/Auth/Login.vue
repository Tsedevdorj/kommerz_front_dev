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
          <a-input v-model="password" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            @click="authenticate"
            :loading="confirmLoading"
          >
            Login
          </a-button>
        </a-form-item>
        <router-link :to="{ name: 'register' }">
          <span class="login-form-register">
            Register
          </span>
        </router-link>
        <router-link :to="{ name: 'newpassword' }">
          <span class="login-form-forgot">
            Request New Password
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
      password: "",
      confirmLoading: false,
      responseError: {}
    };
  },
  methods: {
    authenticate() {
      this.confirmLoading = true;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.confirmLoading = false;
          this.$router.push({ name: "dashboard" });
          this.$message.success(`Welcome back ${this.email}!`);
        })
        .catch(error => {
          this.confirmLoading = false;
          this.responseError = error.response.data.message;
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
.login-form-register {
  float: left;
}
</style>
