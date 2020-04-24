<template>
  <div class="login_container">
    <Form
      class="form_container"
      :config="formConfig"
      :submit-text="submitText"
      :submit-button="{ text: 'Sign in' }"
      @val="submitController"
    >
      <div slot="header" class="logo_wrapper">
        <Logo />
      </div>
      <div slot="footer" class="new_client_button_container">
        <el-button size="small" @click="selectedForm = 'forgotPassword'">
          Forgot password ?
        </el-button>
      </div>
    </Form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import Form from "@/components/Form";
import Logo from "@/components/Logo";

import validateInput from "@/mixins/validateInput";
export default {
  name: "SignIn",
  components: {
    Form,
    Logo
  },
  mixins: [validateInput],
  data() {
    return {
      newUser: false,
      loading: false,
      credentials: {},
      selectedForm: "login"
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters(["getDeviceInformation"]),

    submitText() {
      return this.selectedForm == "login" ? "Login" : "Submit new password";
    },

    returnForm() {
      return this.formConfig[this.selectedForm];
    },
    formConfig() {
      return this.forms[this.selectedForm];
    },
    forms() {
      return {
        forgotPassword: [
          {
            name: "email",
            "component-type": "text",
            placeholder: "Email",
            model: "fp_email"
          },
          {
            name: "password",
            "component-type": "password",
            placeholder: "Password",
            model: "fp_password"
          },
          {
            name: "password",
            "component-type": "password",
            placeholder: "Retype-Password",
            model: "fp_reentered_password"
          }
        ],
        login: [
          {
            name: "email",
            "component-type": "text",
            placeholder: "Email",
            model: "email"
          },
          {
            name: "password",
            "component-type": "password",
            placeholder: "Password",
            model: "password"
          }
        ]
      };
    }
  },

  activated() {
    if (this.hasEntries(this.$route.params)) {
      this.login(this.$route.params);
    }
  },

  methods: {
    ...mapActions(["request", "getClient"]),
    ...mapMutations([
      "UPDATE_USER",
      "UPDATE_NOTIFICATIONS",
      "CLEAR_GLOBAL_INTERVAL"
    ]),

    submitController(formInformation) {
      this.credentials = formInformation;
      switch (this.selectedForm) {
        case "login": {
          this.login();
          break;
        }

        case "forgotPassword": {
          this.resetPassword();
          break;
        }
        default: {
          break;
        }
      }
    },

    resetPassword() {
      // Validate the input;
      let isValid = this.validateInput(this.formConfig, [
        "fp_email",
        "fp_password",
        "fp_reentered_password"
      ]);
      let equalPasswords =
        this.credentials?.fp_password?.toLowerCase()?.trim() ===
        this.credentials?.fp_reentered_password?.toLowerCase()?.trim();
      if (!isValid && !equalPasswords) {
        this.UPDATE_NOTIFICATIONS({
          type: "error",
          message:
            "Error processing reset password, please enter your desired password again"
        });
      } else {
        this.request({
          method: "POST",
          url: "users/password",
          data: {
            client_id: this.clientInformation._id,
            email: this.credentials.fp_email,
            password: this.credentials.fp_password
          }
        }).then(() => {
          this.selectedForm = "login";
        });
      }
    },
    /**
     *
     */
    login() {
      this.loading = true;
      this.request({
        method: "POST",
        data: {
          client_id: this.clientInformation._id,
          ...this.credentials
        },
        url: "/users/login"
      })
        .then(response => {
          this.UPDATE_USER(response);

          if (response.user.admin_gen == true) {
            this.UPDATE_NOTIFICATIONS({
              type: "warning",
              title: "Insecure password detected",
              message:
                "Use the forgot password functionality to reset you password."
            });

            this.$router.push({ name: "events" });
          }

          this.$router.push({ name: "events" });

          this.loading = false;
          // this.changeTab("login");
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo_wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.form_container {
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 40px;
  box-shadow: $box_shadow;
}
</style>
