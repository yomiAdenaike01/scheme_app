<template>
  <div class="reg_wrapper">
    <el-card class="reg_card_container" v-loading="pageLoading">
      <div class="goback_to_login mt-4 mb-4">
        <el-button
          type="primary"
          round
          size="small"
          icon="el-icon-arrow-left"
          @click="$router.push({ name: 'login' })"
          >Go to login</el-button
        >
      </div>

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
            <!-- More inforation button -->
            <el-button
              class="m-4"
              round
              type="primary"
              size="small"
              icon="el-icon-warning-outline"
              v-if="false"
              @click="moreInformation = !moreInformation"
              >More information</el-button
            >
            <el-collapse-transition>
              <div
                class="more_information_container mb-4"
                v-if="moreInformation"
              >
                <h3 class="mb-4">How to login</h3>
                <p style="font-size:.9em">
                  Each company uses scheme cloud using their name. In the event
                  that you do signup your link to schemeapp would be
                  <strong>companyname.schemeapp.cloud</strong>.
                </p>
              </div>
            </el-collapse-transition>
            <!-- FORM  -->
            <el-form-item v-for="item in returnClientForm" :key="item.model">
              <el-input
                :placeholder="item.placeholder"
                v-model="formInput[item.model]"
                clearable
              />
            </el-form-item>

            <!-- Client Details end -->
            <!-- User Details -->
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
            <el-divider>Logo Selection</el-divider>
            <el-form-item>
              <div>
                <input type="file" @change="handleImageChange" />
                <el-collapse-transition>
                  <div v-if="Object.keys(colourPreferences).length > 0">
                    <p class="el-upload__tip" style="color:green">
                      <i class="el-icon el-icon-check"></i> Colour scheme
                      generated based on the imageFileContent provided.
                    </p>
                  </div>
                </el-collapse-transition>
              </div>
            </el-form-item>
          </el-form>

          <!-- Personlisation Tab -->
        </el-tab-pane>
        <el-tab-pane label="Personalisation">
          <div class="theme_wrapper" v-if="imageFileContent">
            <!-- Title -->
            <h5>Logo & Personalisation Guide</h5>
            <p class="instructions">
              Colour suggestions are within the colour selection box. The
              recommended colours are within the bottom row. Select them to see
              the results. These can be changed later.
            </p>
            <div class="image_container">
              <el-image :src="imageFileContent" fit="cover"></el-image>
            </div>
            <!-- Theme selection unit -->
            <ThemeSelectionUnit :colours="colourPreferences" />
          </div>
          <div v-else class="empty_imageFileContent_container">
            <h5>No logo Detected</h5>
            <p class="instructions">
              Please select your imageFileContent so that a recommended colour
              scheme can be generated for you.
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="buttons_container">
        <el-button
          round
          type="primary"
          size="small"
          :disbaled="currentStep == '1' && !imageFileContent"
          @click="
            currentStep == '0' ? (currentStep = '1') : registerNewClient()
          "
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
import refactorLocation from "@/mixins/refactorLocation";
import firebase from "firebase";
import uuid from "uuid";
import mime from "mime-type";
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
  mixins: [refactorLocation],
  data() {
    return {
      imageFileContent: "",
      formInput: {},
      colourOptions: {},
      currentStep: "0",
      pageLoading: false,
      colourPreferences: [],
      moreInformation: false,
      imageFile: ""
    };
  },
  computed: {
    ...mapState(["environmentURL"]),

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
              text: "Male"
            },
            {
              text: "Female"
            },
            {
              text: "Other"
            }
          ]
        }
      ];
      return registerForm;
    }
  },
  methods: {
    ...mapActions(["request"]),

    handleImageChange(e) {
      this.imageFile = e.target.files[0];
      let fileReader = new FileReader();

      fileReader.onload = () => {
        this.imageFileContent = fileReader.result;
      };
      fileReader.readAsDataURL(this.imageFile);
    },

    genAccentColour() {
      if (this.imageFileContent.length > 0) {
        Vibrant.from(this.imageFileContent).getPalette((err, palette) => {
          if (!err) {
            this.pageLoading = false;
            for (let property in palette) {
              if (!property.toLowerCase().includes("muted")) {
                this.colourPreferences.push(palette[property].hex);
              }
            }
          }
        });
      }
    },
    uploadImage() {
      this.pageLoading = true;

      // Upload to firebase;
      const storage = firebase.storage().ref();

      return new Promise((resolve, reject) => {
        let ext = this.imageFileContent.split(";")[0].split("/")[1];
        const storageRef = storage.child(`clients/${uuid()}.${ext}`);

        storageRef
          .putString(this.imageFileContent, "data_url")
          .then(snapshot => {
            resolve(snapshot);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    registerNewClient() {
      this.pageLoading = true;
      let clientRegisterData = this.formInput;
      clientRegisterData.company_name = clientRegisterData.company_name
        .replace(" ", "")
        .toLowerCase();
      clientRegisterData.company_colours = this.colourPreferences;

      this.uploadImage()
        .then(response => {
          clientRegisterData.company_image = response.metadata.fullPath;
          console.log(clientRegisterData.company_image);
          this.request({
            method: "POST",
            url: "clients/create",
            data: clientRegisterData
          })
            .then(response => {
              // log them in
              this.pageLoading = false;
              this.processNewClient(response);
            })
            .catch(error => {
              this.pageLoading = false;
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    },
    processNewClient(response) {
      this.refactorWindowLocation(
        this.formInput.company_name.replace(" ", "").toLowerCase()
      );
    },
    checkIfTabIsValid(tab) {
      console.log(tab);
    }
  },
  components: {
    ThemeSelectionUnit,
    Title
  },
  watch: {
    imageFileContent(val) {
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
.imageFileContent {
  border-radius: 50%;
  max-width: 100px;
  max-height: 100px;
  box-shadow: $box_shadow;
}
.empty_imageFileContent_container {
  margin-top: 2em;
}
.imageFileContent_container {
  display: flex;
  justify-content: center;
}
.image_container {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-image {
    border-radius: 50%;
    max-width: 200px;
    max-height: 200px;
  }
}
</style>
