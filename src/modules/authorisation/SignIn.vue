<template>
  <div class="login_container">
    <Form
      v-model="credentials"
      :form-content="credentials"
      class="form_container"
      :config="formConfig"
      :validations="validations"
      :submit-button="textXref.button"
      @val="submit"
    >
      <div slot="header" class="header_container">
        <h1>{{ textXref.header }}</h1>
        <small class="grey">{{ textXref.description }}</small>
        <collapse-transition>
          <p
            v-if="Object.values(response).length > 0"
            :class="`message ${response.type}`"
          >
            {{ response.message }}
          </p>
        </collapse-transition>
      </div>
      <div slot="footer" class="new_client_button_container">
        <s-button class="rounded plain mini" @click="changeForm">
          {{ selectedForm == "login" ? "Forgot password ?" : "Go to login" }}
        </s-button>
      </div>
    </Form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import Form from "@/components/Form";

import SButton from "@/components/SButton";
import { CollapseTransition } from "vue2-transitions";
export default {
  name: "SignIn",
  components: {
    Form,
    SButton,
    CollapseTransition
  },
  data() {
    return {
      newUser: false,
      loading: false,
      credentials: {},
      selectedForm: "login",
      response: {},
      failedCount: 0
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters(["getDeviceInformation"]),

    validations() {
      let validations = {
        login: ["email", "password"],
        forgotPassword: ["fp_email", "fp_password", "fp_reentered_password"]
      };
      return validations[this.selectedForm];
    },

    submitText() {
      return this.selectedForm == "login" ? "Login" : "Submit new password";
    },

    formConfig() {
      return this.forms[this.selectedForm];
    },
    textXref() {
      let textXref = {
        login: {
          header: "Sign in",
          description: "Fill in the form to login",
          button: {
            text: "Sign in",
            icon: "right-arrow-alt"
          }
        },
        forgotPassword: {
          header: "Reset password",
          description: "Fill in form to reset password",
          button: {
            text: "Reset password",
            class: "icon_reverse primary rounded",
            icon: "left-arrow-alt",
            inverseIcon: true
          }
        }
      };
      return textXref[this.selectedForm];
    },
    forms() {
      return {
        forgotPassword: [
          {
            name: "email",
            component_type: "text",
            placeholder: "Email",
            model: "fp_email"
          },
          {
            name: "password",
            component_type: "password",
            placeholder: "New password",
            model: "fp_password"
          },
          {
            name: "password",
            component_type: "password",
            placeholder: "Retype new password",
            model: "fp_reentered_password"
          }
        ],
        login: [
          {
            name: "email",
            component_type: "text",
            placeholder: "Email",
            model: "email"
          },
          {
            name: "password",
            component_type: "password",
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
      "UPDATE_USER_SESSION",
      "CREATE_SYSTEM_NOTIFICATION"
    ]),
    changeForm() {
      if (this.selectedForm == "login") {
        this.selectedForm = "forgotPassword";
      } else {
        this.selectedForm = "login";
      }
    },
    submit() {
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

      let equalPasswords =
        this.credentials?.fp_password?.toLowerCase()?.trim() ===
        this.credentials?.fp_reentered_password?.toLowerCase()?.trim();
      if (!equalPasswords) {
        this.errorMessage =
          "Error processing reset password, please enter your desired password again";
      } else {
        this.request({
          method: "POST",
          url: "users/password",
          data: {
            client_id: this.clientInformation._id,
            email: this.credentials.fp_email,
            password: this.credentials.fp_password
          }
        })
          .then(() => {
            this.selectedForm = "login";
            this.response = {
              type: "success",
              message:
                "Password successfully reset. Go to login to test your new password."
            };
          })
          .catch(err => {
            this.response = {
              type: "error",
              message: err
            };
          });
      }
    },
    /**
     *
     */
    login() {
      const goToEvents = () => {
        if (this.$route.name != "events") {
          this.$router.push({
            name: "events"
          });
        }
      };
      this.loading = true;
      this.response = {};
      this.request({
        method: "POST",
        disableNotifications: true,
        data: {
          client_id: this.clientInformation._id,
          ...this.credentials
        },
        url: "/users/login"
      })
        .then(response => {
          if (this.failedCount > 0) {
            this.failedCount = 0;
          }
          this.UPDATE_USER(response.user);
          this.UPDATE_USER_SESSION(response.token);

          if (response.user.admin_gen == true) {
            this.CREATE_SYSTEM_NOTIFICATION({
              title: "Insecure password detected",
              message:
                "Use the forgot password functionality to reset you password."
            });

            goToEvents();
          }
          goToEvents();

          this.loading = false;
        })
        .catch(err => {
          this.response = { message: err, type: "error" };
          this.failedCount++;
          this.loading = false;
        });
    }
  },
  watch: {
    failedCount(val) {
      if (val >= 3) {
        this.selectedForm = "forgotPassword";
        this.failedCount = 0;
        this.response = {
          type: "error",
          message: "You have failed to login, you can reset your password."
        };
      }
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
.header_container {
  padding: 20px;
}
.message {
  padding: 10px;
  border-radius: 5px;
  &.error {
    background: rgba(var(--danger), 0.05);
    color: rgba(var(--danger), 1);
  }
  &.success {
    background: rgba(var(--success), 0.05);
    color: rgba(var(--success), 1);
  }
}

.form_container {
  display: flex;
  flex-direction: column;
  border: $border;
  width: 46%;
}
</style>
