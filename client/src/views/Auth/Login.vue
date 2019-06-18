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
          <a-button type="primary" html-type="submit" @click="authenticate">
            Login
          </a-button>
        </a-form-item>
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
      responseError: {}
    };
  },
  methods: {
    authenticate() {
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push({ name: "dashboard" });
          this.$message.success(`Welcome back ${this.email}!`);
        })
        .catch(error => {
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
</style>
