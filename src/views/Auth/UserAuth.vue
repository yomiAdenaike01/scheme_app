<template>
  <div class="login_container">
    <div class="flex_container">
      <el-card class="form_container">
        <el-container class="h-100">
          <el-main class="login_wrapper">
            <div class="logo_wrapper mb-4">
              <Logo />
            </div>
            <Form
              :config="formConfig"
              :submit-text="submitText"
              @val="submitController"
            >
              <div slot="footer" class="new_client_button_container mb-4 mt-4">
                <el-button
                  size="small"
                  @click="selectedForm = 'forgotPassword'"
                >
                  Forgot password ?
                </el-button>
              </div>
            </Form>
          </el-main>
        </el-container>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import Form from "@/components/Form";
import Logo from "@/components/Logo";

import validateInput from "@/mixins/validateInput";
export default {
  name: "UserAuth",
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

  activated() {
    if (this.hasEntries(this.$route.params)) {
      this.login(this.$route.params);
    }
    if (!this.hasEntries(this.clientInformation)) {
      this.getClient()
        .then(response => {
          this.UPDATE_CLIENT(response);
        })
        .catch(() => {
          return;
        });
    }
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
  methods: {
    ...mapActions(["request", "getClient"]),
    ...mapMutations(["UPDATE_USER", "UPDATE_NOTIFICATIONS"]),

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
            clientID: this.clientInformation._id,
            email: this.credentials.fp_email,
            password: this.credentials.fp_password
          }
        }).then(response => {
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
          clientID: this.clientInformation._id,
          ...this.credentials,
          deviceInformation: this.getDeviceInformation
        },
        url: "/users/login"
      })
        .then(response => {
          this.UPDATE_USER(response);

          if (response.user.admin_gen == true) {
            this.UPDATE_NOTIFICATIONS({
              type: "warning",
              title: "Insecure Password Detected",
              message:
                "Your password is insecure, please consider changing it in the user settings."
            });

            this.$router.push({ name: "events" });
          }

          this.$router.push({ name: "events" });

          this.loading = false;
          // this.changeTab("login");
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  height: 100%;
}
.register_as_new_client_wrapper {
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 1em 0;
  cursor: pointer;
}
.flex_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  margin: 0;
}
.form_container {
  min-width: 25%;
}
.switch_button {
  border: 1px solid $element_colour;
}
.new_client_button_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
