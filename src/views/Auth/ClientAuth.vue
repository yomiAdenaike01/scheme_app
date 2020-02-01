<template>
  <div class="reg_wrapper">
    <el-card v-loading="loading">
      <ClientImage class="m-4" :image="imageFileContent" :center="true" :showClient="false" />
      <Tabs
        :tabs="returnTabs"
        v-model="selectedTab"
        :selectedTab="selectedTab"
        @val="selectedTab == '0' ? clientRegForm.clientInformation = $event : clientRegForm.userInformation = $event"
        :customMethod="changeTabs"
        :nextTab="true"
        :submitText="selectedTab == returnTabs.length.toString() ? 'Register' : 'Next'"
      >
        <!-- Upload Image -->
        <div slot="footer_content" v-if="selectedTab == '0'">
          <el-divider class="mb-5">
            <span>Logo Selection</span>
          </el-divider>
          <!-- Upload Image -->
          <UploadFile @fileContent="imageFileContent = $event" />
        </div>
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

  mixins: [refactorLocation, uploadContent],
  data() {
    return {
      selectedTab: "0",
      imageFileContent: "",
      clientRegForm: {
        userInformation: {},
        clientInformation: {}
      },
      colourOptions: "",
      currentStep: "0",
      loading: false,
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
    regFormValidation() {
      let { clientInformation, userInformation } = this.clientRegForm;
      return {
        userInformation: Object.values(userInformation).length <= 0,
        clientInformation: Object.values(clientInformation).length <= 0
      };
    },
    returnTabs() {
      return [
        {
          label: "Company Details",
          formContent: this.returnClientForm
        },
        {
          label: "User Details",
          formContent: this.returnRegisterForm,
          disabled: this.regFormValidation.clientInformation
        },
        {
          label: "Scheme Personalisation",
          disabled: this.regFormValidation.userInformation,
          view: {
            component: CompanyPersonlisation,
            props: {
              predefinedColours: [this.colourOptions],
              method: this.registerNewClient
            }
          }
        }
      ];
    },

    returnClientForm() {
      return [
        {
          model: "name",
          "component-type": "text",
          placeholder: "Company Name"
        },
        {
          model: "phone",
          "component-type": "text",
          placeholder: "Company Phone Number"
        },
        {
          model: "subdomain",
          "component-type": "text",
          placeholder: ".schemeapp.cloud",
          hint: "Optional: Will default to the company name"
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
          model: "name"
        },

        {
          name: "email",
          "component-type": "text",
          placeholder: "Email",
          model: "email"
        },
        {
          name: "password",
          "component-type": "password",
          placeholder: "New password",
          model: "password"
        },
        {
          name: "gender",
          "component-type": "select",
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

    changeTabs() {
      let selectedTab = parseInt(this.selectedTab) + 1;
      if (selectedTab == this.returnTabs.length) {
        selectedTab = 0;
      }

      this.selectedTab = selectedTab.toString();
    },

    genAccentColour() {
      if (this.imageFileContent.length > 0) {
        Vibrant.from(this.imageFileContent).getPalette((err, palette) => {
          if (!err) {
            this.loading = false;
            this.colourOptions = palette.Vibrant.hex;
          }
        });
      }
    },

    registerNewClient() {
      this.loading = true;

      let { clientInformation } = this.clientRegForm;

      clientInformation.name = clientInformation.name
        .replace(" ", "")
        .toLowerCase();

      clientInformation.colours = this.colourOptions;

      this.upload({
        ref: { folder: "clients", file: null },
        content: this.imageFileContent
      })
        .then(response => {
          clientInformation.image = response.url;
          clientInformation.storageRef = response.ref;

          this.request({
            method: "POST",
            url: "clients/create",
            data: this.clientRegForm
          })
            .then(response => {
              // log them in
              this.loading = false;
              this.processNewClient(response);
            })
            .catch(error => {
              this.loading = false;
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    },
    processNewClient(response) {
      this.refactorWindowLocation(
        this.clientRegForm.name.replace(" ", "").toLowerCase()
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
