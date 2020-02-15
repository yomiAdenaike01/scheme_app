<template>
  <el-dialog :visible.sync="view">
    <Tabs
      v-model.number="currentTab"
      :tabs="tabs"
      @fileContent="fileContent = $event"
      @deleteContent="fileContent = $event"
      @val="userManagerController"
      :disableForm="fileContent != null"
      v-loading="loading"
    >
      <div slot="header_content">
        <Title title="Manager users" subtitle="Manage all users and groups here." />
        <transition name="el-fade-in">
          <div class="flex_center" v-if="currentTab > 0">
            <ValidationUnit v-bind="renderValidationUnit" />
          </div>
        </transition>
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import UploadFile from "@/components/UploadFile";
import ToggleSlideDown from "@/components/ToggleSlideDown";
import Tabs from "@/components/Tabs";
import CreateUserOptions from "./CreateUserOptions";
import Title from "@/components/Title";
import ValidationUnit from "@/components/ValidationUnit";
import ManageUserGroups from "./ManageUserGroups";
const csvtojson = require("csvtojson");

export default {
  name: "UserManagerDialog",

  data() {
    return {
      currentTab: 0,
      loading: false,
      fileContent: null,
      fileError: null,
      convertedData: {},
      createUserForm: {}
    };
  },

  props: {
    display: Boolean
  },

  computed: {
    ...mapState(["clientInformation"]),

    renderValidationUnit() {
      return {
        success: {
          condition: this.fileError == true,
          text: "User file passed tests ready to upload"
        },
        danger: {
          condition: this.fileError == true,
          text: "User timesheet passed tests ready to upload"
        },
        info: {
          condition: this.fileError == null,
          text: "Upload users file"
        }
      };
    },

    genPwd() {
      return this.createUserForm.name
        .trim()
        .toLowerCase()
        .replace(" ", "");
    },

    tabs() {
      return [
        {
          label: "Manage user groups",
          view: {
            component: ManageUserGroups,
            props: ""
          }
        },
        {
          label: "Create users",
          formContent: this.formItems
        },
        {
          label: "Upload users",
          view: {
            props: "",
            component: CreateUserOptions
          }
        }
      ];
    },

    formItems() {
      return [
        {
          name: "name",
          "component-type": "text",
          clearable: true,
          placeholder: "Name",
          model: "name"
        },
        {
          name: "gender",
          placeholder: "Gender",
          model: "gender",
          "component-type": "select",
          options: [
            {
              value: "male",
              name: "Male"
            },
            {
              value: "female",
              name: "Female"
            },
            {
              value: "other",
              name: "Other"
            }
          ]
        },

        {
          name: "email",
          "component-type": "text",
          model: "email",
          clearable: true,
          placeholder: "Email"
        },
        {
          name: "phoneNumber",
          "component-type": "text",
          model: "phoneNumber",
          clearable: true,
          placeholder: "Phone Number"
        },
        {
          placeholder: "Group",
          model: "groupID",
          "component-type": "select",
          options: this.clientInformation.userGroups,
          optional: true
        }
      ];
    },

    view: {
      get() {
        return this.display;
      },
      set(toggle) {
        this.$emit("toggle", toggle);
      }
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    userManagerController(val) {
      switch (this.currentTab) {
        case 1: {
          if (!this.fileContent) {
            this.createOneUser(val);
          } else {
            console.log("Creating multiple users");
            // this.createUsers()
          }
          break;
        }
        default: {
          break;
        }
      }
    },

    createOneUser(employee) {
      this.loading = true;
      this.request({
        method: "POST",
        url: "users/register/one",
        data: {
          ...employee,
          clientID: this.clientInformation._id,
          adminGen: true
        }
      })
        .then(response => {
          this.loading = false;
          this.view = false;
        })
        .catch(error => {
          this.loading = false;
          console.error(error);
          return error;
        });
    },

    async cleanData(JSONData) {
      let JSONContent = await csvtojson().fromString(JSONData);

      let schema = {
        name: null,
        email: "",
        gender: "",
        phoneNumber: "",
        password: ""
      };

      const len = JSONContent.length;

      for (let i = 0; i < len; i++) {
        let employee = JSONContent[i];
        employee.clientID = this.clientInformation._id;

        for (let property in schema) {
          property = property.toLowerCase().trim();

          if (!employee[property]) {
            this.fileError = true;
            return Promise.reject("Missing parameters for employee timesheet");
            break;
          }
        }
      }
      this.fileError = false;
      return Promise.resolve(JSONContent);
    },

    createUsers(employees) {
      return new Promise((resolve, reject) => {
        let url = "users/register/multiple";

        this.request({
          method: "POST",
          url,
          data: { employees }
        })
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
    }
  },

  components: {
    Title,
    UploadFile,
    ToggleSlideDown,
    Tabs,
    CreateUserOptions,
    ValidationUnit,
    ManageUserGroups
  },

  watch: {
    fileContent(val) {
      this.loading = true;
      this.cleanData(val)

        .then(response => {
          this.createUsers(response).then(response => {
            this.fileError = false;
            this.loading = false;
          });
        })

        .catch(error => {
          this.loading = false;
          this.fileError = true;

          this.UPDATE_NOTIFICATIONS({
            title: "Error when processing the employee sheet",
            "component-type": "info",
            message: error
          });
        });
    }
  }
};
</script>

<style></style>
