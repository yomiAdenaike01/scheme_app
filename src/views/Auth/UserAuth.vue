<template>
  <div class="login_container">
    <div class="flex_container">
      <el-card class="form_container">
        <el-container style="height:100%">
          <el-main class="login_wrapper">
            <!-- Auth Register &  Login -->
            <AuthFormContainer
              v-loading="loading"
              :tabs="returnTabs"
              :submitText="selectedForm"
              v-model="selectedForm"
              @val="
                formModel[selectedForm] = $event;
                processUser();
              "
            >
              <template #header_content>
                <Title
                  :title="switchController.title"
                  :subtitle="switchController.subtitle"
                />
              </template>
            </AuthFormContainer>
            <!-- End of auth form contatiner -->
          </el-main>
        </el-container>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import prompts from "@/mixins/prompts";
import Title from "@/components/Title";
import AuthFormContainer from "./components/AuthFormContainer";
export default {
  name: "UserAuth",
  data() {
    return {
      newUser: false,
      selectedForm: "login",
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
        data: this.formModel[this.selectedForm],
        url: `/users/${this.selectedForm}`
      };
    },
    switchController() {
      let switchObj = {
        title: "Sign In",
        subtitle: "Use your email and password to sign in.",
        text: "Switch to registration"
      };

      if (this.selectedForm == "Register") {
        switchObj.title = "Sign Up";
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
    validationRules() {
      let len = this.returnForm.length || 0;
      let rules = {};
      for (let i = 0; i < len; i++) {
        let input = this.returnForm[i];
        rules[this.selectedForm] = {
          [input.name]: [
            {
              required: true,
              message: `Please fill in ${input.name}`,
              trigger: "blur"
            }
          ]
        };
      }
      return rules;
    },
    returnValidationRules() {
      return this.validationRules[this.selectedForm];
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
                value: "male"
              },
              {
                text: "Female",
                value: "female"
              },
              {
                text: "Other",
                value: "other"
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
    AuthFormContainer
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
</style>
