<template>
  <el-container class="flex_container">
    <el-card v-loading="loading" class="form_container">
      <el-container style="height:100%">
        <el-main class="login_wrapper">
          <Title
            :title="switchController.title"
            :subtitle="switchController.subtitle"
            defaultClass="m-0 mb-3"
          />
          <el-button
            class="mb-4 switch_button"
            style="width:100%"
            plain
            type="text"
            size="mini"
            @click="switchForms"
          >{{switchController.text}}</el-button>

          <el-form
            :inline="selectedForm == 'login'"
            :rules="validationRules"
            :model="formModel[selectedForm]"
            ref="loginForm"
          >
            <el-form-item v-for="(input,index) in returnForm" :key="index" :prop="input.name">
              <component
                :is="input.type == 'text' || input.type =='password' ? 'el-input' : (input.type == 'select' ? 'el-select' :'el-date-picker')"
                :placeholder="input.placeholder"
                v-model="formModel[selectedForm][input.model]"
                clearable
                :show-password="input.type == 'password'"
                :type="input.type == 'date'?'date':null"
              >
                <el-option
                  v-for="(option,index) in input.options"
                  :key="index"
                  :value="option.value"
                >{{option.text}}</el-option>
              </component>
            </el-form-item>

            <el-divider>
              <span class="grey">Use your socials</span>
            </el-divider>

            <el-row type="flex" class="mt-4" :gutter="8">
              <el-col>
                <el-button type="danger" plain style="width:100%">Google</el-button>
              </el-col>
              <el-col>
                <el-button type="primary" plain style="width:100%">Facebook</el-button>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-button
              style="width:100%"
              round
              @click="validateForm"
              class="member_name"
            >{{selectedForm}}</el-button>
          </el-form>
        </el-main>
      </el-container>
    </el-card>
  </el-container>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import prompts from "@/mixins/prompts";
import Title from "@/components/Title";
export default {
  name: "Login",
  data() {
    return {
      newUser: false,
      selectedForm: "register",
      formModel: {
        login: {},
        register: {}
      },

      loading: false,
      payload: {}
    };
  },

  computed: {
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

      if (this.selectedForm == "register") {
        switchObj.title = "Sign Up";
        switchObj.subtitle =
          "Fill in the following form to successfully register";
        switchObj.text = "Switch to login";
      }
      return switchObj;
    },
    validationRules() {
      let len = this.returnForm.length;
      let rules = {};
      for (let i = 0; i < len; i++) {
        let input = this.returnForm[i];
        rules[this.selectedForm] = {
          [input.name]: {
            required: true,
            message: `Please fill in ${input.name}`,
            trigger: "blur"
          }
        };
      }
      return rules;
    },
    returnValidationRules() {
      if (this.selectedForm == "login") {
        return this.validationRules.login;
      } else {
        return this.validationRules.register;
      }
    },
    returnForm() {
      if (this.selectedForm == "login") {
        return this.formConfig.login;
      } else {
        return this.formConfig.register;
      }
    },
    formConfig() {
      let formConfig = {
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
          },

          {
            name: "password",
            type: "password",
            placeholder: "New password",
            model: "password"
          }
        ]
      };

      return formConfig;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_USER", "UPDATE_NOTIFICATIONS"]),
    switchForms() {
      if (this.selectedForm == "login") {
        this.selectedForm = "register";
      } else {
        this.selectedForm = "login";
      }
    },
    validateForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.processUser();
        }
      });
    },

    processUser() {
      //Change employee type
      this.formModel.login.employee_type == "Yes"
        ? this.$set(this.formModel.login, "employee_type", 3)
        : this.$set(this.formModel.login, "employee_type", 2);
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
    Title
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
.form_container {
  min-width: 20%;
}
.switch_button {
  border: 1px solid #2f74eb;
}
</style>
