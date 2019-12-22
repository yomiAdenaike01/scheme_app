<template>
  <el-container class="flex_container">
    <el-card v-loading="loading">
      <el-container style="height:100%">
        <el-main class="login_wrapper">
          <h1 class="p-0 m-0">{{ newUser ? "Welcome New User" : 'Sign In'}}</h1>
          <h5
            class="light p-0 mt-0 mb-3"
          >{{newUser ? 'Please fill in your new password below' : 'Use your email and password to sign in.'}}</h5>
          <el-form :inline="true" :rules="validationRules" :model="formModel" ref="loginForm">
            <el-form-item prop="email">
              <el-input clearable type="email" placeholder="Email" v-model="formModel.email" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                show-password
                type="password"
                placeholder="Password"
                v-model="formModel.password"
                clearable
                @keyup.enter.native="validateForm"
              />
            </el-form-item>
            <el-divider>
              <span class="grey">Login with your socials</span>
            </el-divider>

            <el-row type="flex" class="mt-4" :gutter="8">
              <el-col>
                <el-button type="danger" plain style="width:100%">Google</el-button>
              </el-col>
              <el-col>
                <el-button type="primary" plain style="width:100%">Facebook</el-button>
              </el-col>
            </el-row>
            <el-button class="mt-3" style="width:100%" round @click="validateForm">Login</el-button>
          </el-form>
        </el-main>
      </el-container>
    </el-card>
  </el-container>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import prompts from "@/mixins/prompts";
export default {
  name: "Login",
  data() {
    return {
      newUser: false,
      formModel: {
        email: "",
        password: ""
      },
      loading: false,
      validationRules: {
        email: [
          {
            required: true,
            message: "Please fill your email",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill your password",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_USER"]),

    validateForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login();
        }
      });
    },

    login() {
      this.loading = true;

      const payload = {
        method: "POST",
        data: {
          email: this.formModel.email,
          password: this.formModel.password
        },
        url: "/users/login"
      };

      this.request(payload)
        .then(response => {
          this.UPDATE_USER(response);
          if (response.admin_gen) {
            this.UPDATE_NOTIFICATIONS({
              type: "warning",
              title: "Insecure Password Detected",
              message:
                "Your password is insecure, please consider changing it in the user settings"
            });
          }
          this.$router.push({ name: "dashboard" });

          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  },
  mixins: [prompts]
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
</style>
