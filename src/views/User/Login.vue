<template>
  <el-container class="flex_container">
    <el-card v-loading="loading">
      <el-container style="height:100%">
        <el-main class="login_wrapper">
          <h1 class="p-0 m-0">Sign In</h1>
          <h5 class="light p-0 mt-0 mb-3">Use your email and password to sign in.</h5>
          <el-input type="email" placeholder="Email" v-model="email" />
          <el-input show-password type="password" placeholder="Password" v-model="password" />
          <!-- <el-row type="flex" :gutter="10" class="mt-4">
            <el-col>
              <el-button>Login With Google</el-button>
            </el-col>
            <el-col>
              <el-button>Login With Facebook</el-button>
            </el-col>
            <el-col>
              <el-button>Login With Linkedin</el-button>
            </el-col>
          </el-row>-->
          <el-button class="mt-4" @click="login" type="primary" round>Login</el-button>
        </el-main>
      </el-container>
    </el-card>
  </el-container>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_USER"]),
    login() {
      this.loading = true;
      const payload = {
        method: "POST",
        data: { email: this.email, password: this.password },
        url: "/users/login"
      };
      this.request(payload)
        .then(response => {
          this.UPDATE_USER(response);
          this.$router.push({ name: "dashboard" });
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.flex_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding: 0;
  margin: 0;
}

.el-input {
  max-width: 40%;
  margin: 1em;
}
</style>
