<template>
  <div class="login_container">
    <div class="flex_container">
      <el-card class="form_container">
        <el-container style="height:100%">
          <el-main class="login_wrapper">
            <!-- Display the clients image -->
            <ClientImage :center="true" class="mb-4" />
            <!-- Auth Register &  Login -->
            <Tabs
              v-loading="loading"
              :tabs="returnTabs"
              :submitText="
                tabIndex == '0' && isValidClient
                  ? 'Login'
                  : !isValidClient
                  ? 'Invalid client please register'
                  : 'Register'
              "
              v-model="tabIndex"
              :disable="!isValidClient"
              @val="setFormAndProcessUser"
            >
              <!-- New client registration -->
              <div
                class="new_client_button_container mb-4 mt-4"
                slot="header_content"
                v-if="tabIndex != '0'"
              >
                <!-- New client registration -->
                <el-button
                  v-if="!isValidClient"
                  @click="$router.push({ name: 'register' })"
                  round
                  size="small"
                  type="primary"
                >
                  Registering a new company ? Click here to register.
                </el-button>
              </div>
            </Tabs>
          </el-main>
        </el-container>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import prompts from "@/mixins/prompts";
import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import ClientImage from "@/components/ClientImage";
export default {
  name: "UserAuth",
  data() {
    return {
      newUser: false,
      tabIndex: "0",
      formModel: {
        login: {},
        register: {},
        forgotPassword: {}
      },

      loading: false,
      payload: {}
    };
  },
  computed: {
    ...mapGetters(["isValidClient"]),
    ...mapState(["client"]),
    selectedForm() {
      if (this.tabIndex == "0") {
        return "login";
      } else {
        return "register";
      }
    },
    returnTabs() {
      // loop the types of forms and create a label
      return [
        {
          label: "Login",
          formContent: this.formConfig["login"]
        },
        {
          label: "Register",
          formContent: this.formConfig["register"]
        }
      ];
    },
    returnPayload() {
      return {
        method: "POST",
        data: {
          client_id: this.client._id,
          ...this.formModel[this.selectedForm]
        },
        url: `/users/${this.selectedForm}`
      };
    },
    switchController() {
      let switchObj = {
        title: "User sign in",
        subtitle: "Use your email and password to sign in.",
        text: "Switch to registration"
      };

      if (this.selectedForm == "register") {
        switchObj.title = "User sign up";

        switchObj.subtitle =
          "Fill in the following form to successfully register";

        switchObj.text = "Switch to login";
      } else if (this.selectedForm == "forgotPassword") {
        switchObj.title = "Forgot Password";

        switchObj.subtitle =
          "Fill in the following form to change the password";

        switchObj.text = "Switch to login";
      }
      return switchObj;
    },

    returnForm() {
      return this.formConfig[this.selectedForm];
    },
    formConfig() {
      let formConfig = {
        forgotPassword: [
          {
            name: "email",
            type: "text",
            placeholder: "Email",
            model: "email"
          },
          {
            name: "password",
            type: "password",
            placeholder: "Password",
            model: "password"
          },
          {
            name: "Verify password",
            type: "password",
            placeholder: "Verify Password",
            model: "verify_password"
          }
        ],
        login: [
          {
            name: "email",
            type: "text",
            placeholder: "Email",
            model: "email"
          },
          {
            name: "password",
            type: "password",
            placeholder: "Password",
            model: "password"
          }
        ],
        register: [
          {
            name: "name",
            type: "text",
            placeholder: "First and last name",
            model: "name"
          },
          {
            name: "email",
            type: "text",
            placeholder: "Email",
            model: "email"
          },

          {
            name: "password",
            type: "password",
            placeholder: "New password",
            model: "password"
          },

          {
            name: "gender",
            type: "select",
            placeholder: "Gender",
            model: "gender",
            options: [
              {
                text: "Male",
                value: 1
              },
              {
                text: "Female",
                value: 2
              },
              {
                text: "Other",
                value: 3
              }
            ]
          },
          {
            name: "date_of_birth",
            type: "date",
            placeholder: "Date of birth",
            model: "date_of_birth"
          },

          {
            name: "locumn",
            type: "select",
            placeholder: "Are you a locumn ?",
            model: "employee_type",
            options: [
              {
                text: "Yes",
                value: "Yes"
              },
              {
                text: "No",
                value: "No"
              }
            ]
          }
        ]
      };

      return formConfig;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_USER", "UPDATE_NOTIFICATIONS"]),

    setFormAndProcessUser(e) {
      try {
        this.$set(this.formModel, this.selectedForm, e);
        this.processUser();
      } catch (error) {
        console.log(error);
      }
    },
    forgotPassword() {
      let forgotPwdForm = this.formModel[this.selectedForm];
      this.loading = true;
      if (forgotPwdForm.password != forgotPwdForm.verify_password) {
        this.loading = false;

        this.UPDATE_NOTIFICATIONS({
          type: "error",
          message: "Passwords do not match, please enter them again."
        });
      } else {
        delete forgotPwdForm.verify_password;
        this.request({
          method: "POST",
          url: "users/forgotpassword",
          data: forgotPwdForm
        })
          .then(response => {
            this.loading = false;
            this.selectedForm = "login";
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    processUser() {
      if (this.selectedForm == "forgotPassword") {
        this.forgotPassword();
      } else if (this.selectedForm == "register") {
        //Change employee type
        this.formModel.login.employee_type == "Yes"
          ? this.$set(this.formModel.register, "employee_type", 3)
          : this.$set(this.formModel.register, "employee_type", 2);
      }
      this.loading = true;

      this.request(this.returnPayload)
        .then(response => {
          this.UPDATE_USER(response);
          if (response.user.admin_gen == true) {
            this.UPDATE_NOTIFICATIONS({
              type: "warning",
              title: "Insecure Password Detected",
              message:
                "Your password is insecure, please consider changing it in the user settings."
            });
            this.$router.push({ name: "dashboard" });
          }
          this.$router.push({ name: "dashboard" });

          this.loading = false;
          this.selectedForm = "login";
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  },
  components: {
    Title,
    Tabs,
    ClientImage
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
  border: 1px solid $primary_colour;
}
.new_client_button_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
