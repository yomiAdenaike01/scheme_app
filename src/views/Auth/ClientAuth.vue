<template>
  <div class="reg_wrapper">
    <el-card>
      <ClientImage class="m-4" :image="imageFileContent" :center="true" :showClient="false" />
      <Tabs
        :tabs="returnTabs"
        v-model="selectedTab"
        :selectedTab="selectedTab"
        @val="formInput = $event"
        :customMethod="registerNewClient"
        :nextTab="true"
        @changeTab="selectedTab = '1'"
        :submitText="selectedTab == '1'  ? 'Register' : 'Next'"
      >
        <!-- Upload Image -->
        <template #footer_content v-if="selectedTab == '0'">
          <el-divider>
            <span>Logo Selection</span>
          </el-divider>
          <UploadFile @fileContent="imageFileContent = $event" />
        </template>
        <!-- Upload Image -->
      </Tabs>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Title from "@/components/Title";
import ThemeSelection from "@/components/ThemeSelection";
import * as Vibrant from "node-vibrant";
import refactorLocation from "@/mixins/refactorLocation";
import firebase from "firebase";
import uuid from "uuid";
import mime from "mime-type";
import Tabs from "@/components/Tabs";
import CompanyPersonlisation from "./components/CompanyPersonlisation";
import UploadFile from "@/components/UploadFile";
import ClientImage from "@/components/ClientImage";
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
      selectedTab: "0",
      imageFileContent: "",
      formInput: {},
      colourOptions: "",
      currentStep: "0",
      pageLoading: false,
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
    returnTabs() {
      return [
        {
          label: "Company & User Details",
          formContent: this.returnClientForm.concat(this.returnRegisterForm)
        },
        {
          label: "Scheme Personalisation",
          view: {
            component: CompanyPersonlisation,
            props: {
              predefinedColours: [this.colourOptions]
            }
          }
        }
      ];
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
      return [
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
    }
  },
  methods: {
    ...mapActions(["request"]),

    genAccentColour() {
      if (this.imageFileContent.length > 0) {
        Vibrant.from(this.imageFileContent).getPalette((err, palette) => {
          if (!err) {
            this.pageLoading = false;
            this.colourOptions = palette.Vibrant.hex;
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
      clientRegisterData.company_colours = this.colourOptions;

      this.uploadImage()
        .then(response => {
          clientRegisterData.company_image = response.metadata.fullPath;
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
    ThemeSelection,
    Title,
    Tabs,
    CompanyPersonlisation,
    UploadFile,
    ClientImage
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
  .el-card {
    width: 30%;
  }
}
</style>
