<template>
  <div class="reg_wrapper">
    <el-card v-loading="pageLoading">
      <ClientImage class="m-4" :image="imageFileContent" :center="true" :showClient="false" />
      <Tabs
        :tabs="returnTabs"
        v-model="selectedTab"
        :selectedTab="selectedTab"
        @val="formInput = $event"
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
          this.$set(this.formInput, form[prop], "");
        }
      }
    });
  },
  mixins: [refactorLocation, uploadContent],
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
          "component-type": "text",
          placeholder: "Company Name"
        },
        {
          model: "company_phone",
          type: "text",
          placeholder: "Company Phone Number"
        },
        {
          model: "company_subdomain",
          type: "text",
          placeholder: ".schemeapp.cloud"
        }
      ];
    },

    returnRegisterForm() {
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
      this.pageLoading = true;
      let clientRegisterData = this.formInput;
      clientRegisterData.company_name = clientRegisterData.company_name
        .replace(" ", "")
        .toLowerCase();
      clientRegisterData.company_colours = this.colourOptions;

      this.upload({
        ref: { folder: "clients", file: null },
        content: this.imageFileContent
      })
        .then(response => {
          clientRegisterData.company_image = response.url;
          clientRegisterData.storage_ref = response.ref;

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
