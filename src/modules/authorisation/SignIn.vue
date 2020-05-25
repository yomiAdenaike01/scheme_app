<template>
  <div class="login_container">
    <Form
      v-model="credentials"
      :form-content="credentials"
      class="form_container"
      :config="formConfig"
      :validations="['email', 'password']"
      :submit-button="{ text: 'Sign in', icon: 'right-arrow-alt' }"
      @val="submit"
    >
      <div slot="header" class="header_container">
        <h1>Sign in</h1>
        <collapse-transition>
          <p v-if="errorMessage.length > 0" class="error">{{ errorMessage }}</p>
        </collapse-transition>
      </div>
      <div slot="footer" class="new_client_button_container">
        <s-button
          class="rounded plain mini"
          @click="selectedForm = 'forgotPassword'"
        >
          Forgot password ?
        </s-button>
      </div>
    </Form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import Form from "@/components/Form";

import validateInput from "@/mixins/validateInput";
import SButton from "@/components/SButton";
import { CollapseTransition } from "vue2-transitions";
export default {
  name: "SignIn",
  components: {
    Form,
    SButton,
    CollapseTransition
  },
  mixins: [validateInput],
  data() {
    return {
      newUser: false,
      loading: false,
      credentials: {},
      selectedForm: "login",
      errorMessage: ""
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters(["getDeviceInformation"]),

    submitText() {
      return this.selectedForm == "login" ? "Login" : "Submit new password";
    },

    formConfig() {
      return this.forms[this.selectedForm];
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
            placeholder: "Password",
            model: "fp_password"
          },
          {
            name: "password",
            component_type: "password",
            placeholder: "Retype-Password",
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
      let isValid = this.validateInput(this.formConfig, [
        "fp_email",
        "fp_password",
        "fp_reentered_password"
      ]);
      let equalPasswords =
        this.credentials?.fp_password?.toLowerCase()?.trim() ===
        this.credentials?.fp_reentered_password?.toLowerCase()?.trim();
      if (!isValid && !equalPasswords) {
        this.CREATE_SYSTEM_NOTIFICATION({
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
      const goToEvents = () => {
        if (this.$route.name != "events") {
          this.$router.push({
            name: "events"
          });
        }
      };
      this.loading = true;
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
          this.errorMessage = err;
          this.loading = false;
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
.header_container {
  padding: 20px;
}
.error {
  padding: 10px;
  border-radius: 5px;
  background: rgba(var(--danger), 0.05);
  color: rgba(var(--danger), 1);
}

.form_container {
  display: flex;
  flex-direction: column;
  border: $border;
  width: 16%;
}
</style>
