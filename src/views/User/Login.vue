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
            >{{ switchController.text }}</el-button
          >

          <el-form
            :inline="selectedForm == 'login'"
            :model="formModel[selectedForm]"
            ref="loginForm"
          >
            <el-form-item
              v-for="(input, index) in returnForm"
              :key="index"
              :prop="input.name"
            >
              <component
                :is="
                  input.type == 'text' || input.type == 'password'
                    ? 'el-input'
                    : input.type == 'select'
                    ? 'el-select'
                    : 'el-date-picker'
                "
                :placeholder="input.placeholder"
                v-model="formModel[selectedForm][input.model]"
                clearable
                :show-password="input.type == 'password'"
                :type="input.type == 'date' ? 'date' : null"
              >
                <el-option
                  v-for="(option, index) in input.options"
                  :key="index"
                  :value="option.value"
                  >{{ option.text }}</el-option
                >
              </component>
            </el-form-item>

            <el-divider>
              <span class="grey">Problems logging in ?</span>
            </el-divider>

            <el-row type="flex" class="mt-4" :gutter="8">
              <el-col>
                <el-button
                  size="small"
                  type="danger"
                  plain
                  style="width:100%"
                  @click="selectedForm = 'forgotPassword'"
                  >Forgot Password</el-button
                >
              </el-col>
              <el-col>
                <el-button size="small" type="primary" plain style="width:100%"
                  >Forgot Email</el-button
                >
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-button
              style="width:100%"
              round
              size="small"
              @click="validateForm"
              class="member_name"
              >{{
                selectedForm != 'forgotPassword' ? selectedForm : 'Submit'
              }}</el-button
            >
          </el-form>
        </el-main>
      </el-container>
    </el-card>
  </el-container>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import prompts from '@/mixins/prompts'
import Title from '@/components/Title'
export default {
  name: 'Login',
  data() {
    return {
      newUser: false,
      selectedForm: 'login',
      formModel: {
        login: {},
        register: {},
        forgotPassword: {}
      },

      loading: false,
      payload: {}
    }
  },

  computed: {
    returnPayload() {
      return {
        method: 'POST',
        data: this.formModel[this.selectedForm],
        url: `/users/${this.selectedForm}`
      }
    },
    switchController() {
      let switchObj = {
        title: 'Sign In',
        subtitle: 'Use your email and password to sign in.',
        text: 'Switch to registration'
      }

      if (this.selectedForm == 'register') {
        switchObj.title = 'Sign Up'
        switchObj.subtitle =
          'Fill in the following form to successfully register'
        switchObj.text = 'Switch to login'
      } else if (this.selectedForm == 'forgotPassword') {
        switchObj.title = 'Forgot Password'
        switchObj.subtitle = 'Fill in the following form to change the password'
        switchObj.text = 'Switch to login'
      }
      return switchObj
    },
    validationRules() {
      let len = this.returnForm.length || 0
      let rules = {}
      for (let i = 0; i < len; i++) {
        let input = this.returnForm[i]
        rules[this.selectedForm] = {
          [input.name]: [
            {
              required: true,
              message: `Please fill in ${input.name}`,
              trigger: 'blur'
            }
          ]
        }
      }
      return rules
    },
    returnValidationRules() {
      return this.validationRules[this.selectedForm]
    },
    returnForm() {
      return this.formConfig[this.selectedForm]
    },
    formConfig() {
      let formConfig = {
        forgotPassword: [
          {
            name: 'email',
            type: 'text',
            placeholder: 'Email',
            model: 'email'
          },
          {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            model: 'password'
          },
          {
            name: 'Verify password',
            type: 'password',
            placeholder: 'Verify Password',
            model: 'verify_password'
          }
        ],
        login: [
          {
            name: 'email',
            type: 'text',
            placeholder: 'Email',
            model: 'email'
          },
          {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            model: 'password'
          }
        ],
        register: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'First and last name',
            model: 'name'
          },
          {
            name: 'email',
            type: 'text',
            placeholder: 'Email',
            model: 'email'
          },

          {
            name: 'gender',
            type: 'select',
            placeholder: 'Gender',
            model: 'gender',
            options: [
              {
                text: 'Male',
                value: 'male'
              },
              {
                text: 'Female',
                value: 'female'
              },
              {
                text: 'Other',
                value: 'other'
              }
            ]
          },
          {
            name: 'date_of_birth',
            type: 'date',
            placeholder: 'Date of birth',
            model: 'date_of_birth'
          },

          {
            name: 'locumn',
            type: 'select',
            placeholder: 'Are you a locumn ?',
            model: 'employee_type',
            options: [
              {
                text: 'Yes',
                value: 'Yes'
              },
              {
                text: 'No',
                value: 'No'
              }
            ]
          },

          {
            name: 'password',
            type: 'password',
            placeholder: 'New password',
            model: 'password'
          }
        ]
      }

      return formConfig
    }
  },
  methods: {
    ...mapActions(['request']),
    ...mapMutations(['UPDATE_USER', 'UPDATE_NOTIFICATIONS']),
    switchForms() {
      if (this.selectedForm == 'login') {
        this.selectedForm = 'register'
      } else {
        this.selectedForm = 'login'
      }
    },
    validateForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.processUser()
        }
      })
    },

    forgotPassword() {
      let forgotPwdForm = this.formModel[this.selectedForm]
      this.loading = true
      if (forgotPwdForm.password != forgotPwdForm.verify_password) {
        this.loading = false

        this.UPDATE_NOTIFICATIONS({
          type: 'error',
          message: 'Passwords do not match, please enter them again.'
        })
      } else {
        delete forgotPwdForm.verify_password
        this.request({
          method: 'POST',
          url: 'users/forgotpassword',
          data: forgotPwdForm
        })
          .then(response => {
            this.loading = false
            this.selectedForm = 'login'
            return response
          })
          .catch(error => {
            this.loading = false

            return error
          })
      }
    },
    processUser() {
      if (this.selectedForm == 'forgotPassword') {
        this.forgotPassword()
      }
      //Change employee type
      this.formModel.login.employee_type == 'Yes'
        ? this.$set(this.formModel.login, 'employee_type', 3)
        : this.$set(this.formModel.login, 'employee_type', 2)
      this.loading = true

      this.request(this.returnPayload)
        .then(response => {
          this.UPDATE_USER(response)
          if (response.user.admin_gen == true) {
            this.UPDATE_NOTIFICATIONS({
              type: 'warning',
              title: 'Insecure Password Detected',
              message:
                'Your password is insecure, please consider changing it in the user settings.'
            })
            this.$router.push({ name: 'dashboard' })
          }
          this.$router.push({ name: 'dashboard' })

          this.loading = false
          this.selectedForm = 'login'
        })
        .catch(error => {
          console.log(error)
          this.loading = false
        })
    }
  },
  components: {
    Title
  }
}
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
  min-width: 25%;
}
.switch_button {
  border: 1px solid #2f74eb;
}
</style>
