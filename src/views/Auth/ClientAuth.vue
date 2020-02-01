<template>
  <div class="reg_wrapper">
    <el-card v-loading="pageLoading">
      <ClientImage class="m-4" :image="imageFileContent" :center="true" :showClient="false" />
      <Tabs
        :tabs="returnTabs"
        v-model="selectedTab"
        :selectedTab="selectedTab"
        @val="clientRegForm = $event"
        :customMethod="registerNewClient"
        :nextTab="true"
        @changeTab="selectedTab = '1'"
        :submitText="selectedTab == '1' ? 'Register' : 'Next'"
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
import Tabs from "@/components/Tabs";
import CompanyPersonlisation from "./components/CompanyPersonlisation";
import UploadFile from "@/components/UploadFile";
import ClientImage from "@/components/ClientImage";
import uploadContent from "@/mixins/uploadContent";
export default {
  name: "ClientAuth",
  created() {
    let allForms = this.returnRegisterForm.concat(this.returnClientForm);
    allForms.map(form => {
      for (let prop in form) {
        if (prop == "model") {
          this.$set(this.clientRegForm, form[prop], "");
        }
      }
    });
  },
  mixins: [refactorLocation, uploadContent],
  data() {
    return {
      selectedTab: "0",
      imageFileContent: "",
      clientRegForm: {},
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
      for (let property in this.clientRegForm) {
        let initNum = 0;
        if (this.clientRegForm[property]) {
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
          disabled:true,
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
          model: "clientName",
          "component-type": "text",
          placeholder: "Company Name"
        },
        {
          model: "clientPhone",
 "component-type": "text",          placeholder: "Company Phone Number"
        },
        {
          model: "clientSubdomain",
 "component-type": "text",          placeholder: ".schemeapp.cloud"
        }
      ];
    },

    returnRegisterForm() {
      let clientInformation = {};
      return [
        {
          name: "name",
          "component-type": "text",
          placeholder: "First and last name",
          model: "userName"
        },

        {
          name: "email",
          "component-type": "text",
          placeholder: "Email",
          model: "userEmail"
        },
        {
          name: "password",
          "component-type": "password",
          placeholder: "New password",
          model: "userPassword"
        },
        {
          name: "gender",
          "component-type": "select",
          placeholder: "Gender",
          model: "userGender",
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

    registerNewClient() {
      let clientRegPayload = {
        userInformation: {},
        clientInformation: {}
      };
      for (let property in this.clientRegForm) {
        if (property.includes("user")) {
          clientRegPayload.userInformation[property] = this.clientRegForm[
            property
          ];
        }
        clientRegPayload.clientInformation[property] = this.clientRegForm[
          property
        ];
      }
      this.pageLoading = true;
      let { clientInformation, userInformation } = clientRegPayload;

      clientInformation.clientName = clientInformation.clientName
        .replace(" ", "")
        .toLowerCase();
      clientInformation.colours = this.colourOptions;

      this.upload({
        ref: { folder: "clients", file: null },
        content: this.imageFileContent
      })
        .then(response => {
          clientInformation.clientImage = response.url;
          clientInformation.clientStorageRef = response.ref;

          this.request({
            method: "POST",
            url: "clients/create",
            data: clientRegPayload
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
        this.clientRegForm.clientName.replace(" ", "").toLowerCase()
      );
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
