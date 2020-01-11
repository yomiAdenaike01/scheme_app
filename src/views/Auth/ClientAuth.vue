<template>
  <div class="reg_wrapper">
    <el-card class="reg_card_container" :v-loading="loading">
      <el-tabs
        type="card"
        :closable="false"
        :addable="false"
        stretch
        v-model="currentStep"
      >
        <!-- Client Details Tab -->
        <el-tab-pane label="Company & User Details">
          <el-form
            class="form_container"
            v-if="currentStep <= 0"
            label-position="top"
          >
            <el-form-item v-for="item in returnClientForm" :key="item.model">
              <el-input
                :placeholder="item.placeholder"
                v-model="formInput[item.model]"
                clearable
              />
            </el-form-item>

            <el-divider>User Details</el-divider>
            <el-form-item
              :prop="item.name"
              v-for="(item, index) in returnRegisterForm"
              :key="index"
            >
              <component
                :placeholder="item.placeholder"
                :start-placeholder="item.start_placeholder"
                :end-placeholder="item.end_placeholder"
                :type="item.type == 'password' ? item.type : ''"
                v-model="formInput[item.model]"
                clearable
                :show-password="item.type == 'password'"
                :is="
                  item.type == 'text' || item.type == 'password'
                    ? 'el-input'
                    : item.type == 'select'
                    ? 'el-select'
                    : 'el-date-picker'
                "
              >
                <el-option
                  v-for="(option, index) in item.options"
                  :key="index"
                  :value="option.text"
                  >{{ option.text }}
                </el-option>
              </component>
            </el-form-item>

            <!-- Image upload -->
            <el-divider>Company Logo Selection</el-divider>
            <el-form-item v-loading="this.loading">
              <div>
                <input type="file" @change="handleImageChange" />
                <el-collapse-transition>
                  <div v-if="Object.keys(colourPreferences).length > 0">
                    <p class="el-upload__tip" style="color:green">
                      <i class="el-icon el-icon-check"></i> Colour scheme
                      generated based on the logo provided.
                    </p>
                  </div>
                </el-collapse-transition>
              </div>
            </el-form-item>
          </el-form>

          <!-- Personlisation Tab -->
        </el-tab-pane>
        <el-tab-pane label="Personalisation">
          <div class="theme_wrapper" v-if="logo">
            <!-- Title -->
            <h5>These are your theme settings</h5>
            <p class="instructions">
              These can be changed once you have logged in. They are located
              within your settings. Hover over a colour that you want to change
              to change it.
            </p>
            <div class="logo_container">
              <img :src="logo" class="logo" />
            </div>
            <!-- Theme selection unit -->
            <ThemeSelectionUnit
              v-for="(themeItem, index) in colourPreferences"
              :key="index"
              :label="themeItem.label"
              :colour="themeItem.colour"
              :index="index"
              v-model="colourPreferences[index].colour"
            />
          </div>
          <div v-else class="empty_logo_container">
            <h5>No Logo Detected</h5>
            <p class="instructions">
              Please select your logo so that a recommended colour scheme can be
              generated for you.
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="buttons_container">
        <el-button
          round
          type="primary"
          size="mini"
          :disbaled="currentStep == '1' && !logo"
          @click="currentStep == '0' ? (currentStep = '1') : registerNewClient"
          >{{
            currentStep == "0" ? "Go To Personalisation" : "Finalize Account"
          }}</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Title from "@/components/Title";
import ThemeSelectionUnit from "./components/ThemeSelection";
import * as Vibrant from "node-vibrant";

export default {
  name: "ClientAuth",
  created() {
    let allForms = this.returnRegisterForm.concat(this.returnClientForm);
    allForms.map(form => {
      for (let prop in form) {
        if (prop == "model") {
          this.$set(this.formInput, form[prop], "");
        }
      }
    });
  },
  data() {
    return {
      logo: "",
      formInput: {},
      image_upload: [],
      accent_colour: null,
      colourOptions: {},
      currentStep: "0",
      loading: false,
      colourPreferences: []
    };
  },
  computed: {
    returnIsFileValid() {
      let file = this.image_upload;
    },
    returnIsFormValid() {
      let capNum =
        this.returnClientForm.length + this.returnRegisterForm.length;
      let isValid = false;
      for (let property in this.formInput) {
        let initNum = 0;
        if (this.formInput[property]) {
          initNum++;

          if (initNum == capNum) {
            isValid = true;
          } else {
            isValid = false;
          }
        }
      }
      return isValid;
    },

    returnClientForm() {
      return [
        {
          model: "company_name",
          type: "text",
          placeholder: "Company Name"
        },
        {
          model: "company_phone",
          type: "text",
          placeholder: "Company Phone Number"
        }
      ];
    },

    returnRegisterForm() {
      let registerForm = [
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
              text: "Male"
            },
            {
              text: "Female"
            },
            {
              text: "Other"
            }
          ]
        },
        {
          name: "password",
          type: "password",
          placeholder: "New password",
          model: "password"
        }
      ];
      return registerForm;
    }
  },
  methods: {
    ...mapActions(["request"]),
    handleImageChange(e) {
      this.loading = true;
      let file = e.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = () => {
        this.logo = fileReader.result;
      };
      let url = fileReader.readAsDataURL(file);
    },
    genAccentColour() {
      if (this.logo.length > 0) {
        Vibrant.from(this.logo).getPalette((err, palette) => {
          if (!err) {
            this.loading = false;
            for (let property in palette) {
              if (!property.toLowerCase().includes("muted")) {
                this.colourPreferences.push({
                  label:
                    property == "Vibrant"
                      ? "Primary"
                      : "LightVibrant"
                      ? "Secondary"
                      : "Tertiary",
                  colour: palette[property].hex
                });
              }
            }
          }
        });
      }
    },

    uploadImage(file) {},
    registerNewClient() {
      this.loading = true;
      let clientRegisterData = this.formInput;
      this.request({
        method: "POST",
        data: this.clientRegisterData
      })
        .then(response => {
          if (response) {
            console.log(response);
            this.loading = false;
          }
        })
        .catch(error => {
          console.error(error);
          this.loading = false;
        });
    },
    checkIfTabIsValid(tab) {
      console.log(tab);
    }
  },
  components: {
    ThemeSelectionUnit
  },
  watch: {
    logo(val) {
      this.genAccentColour();
    }
  }
};
</script>

<style lang="scss" scoped>
.reg_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.reg_card_container {
  width: 30%;
  height: 80%;
}
.buttons_container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.form_container {
  padding: 1em;
}
.theme_wrapper {
  padding: 1em;
  line-height: 1.5em;
  height: 100%;
  overflow-x: hidden;
}
.instructions {
  color: #999;
  font-size: 0.8em;
  margin-bottom: 5%;
}
.upload_container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-divider__text {
  color: #888;
}
.logo {
  border-radius: 50%;
  max-width: 100px;
  max-height: 100px;
  box-shadow: $box_shadow;
}
.empty_logo_container {
  margin-top: 2em;
}
.logo_container {
  display: flex;
  justify-content: center;
}
</style>
