<template>
  <el-dialog width="40%" :visible.sync="view">
    <Tabs
      v-model.number="currentTab"
      v-loading="loading"
      :tabs="tabs"
      :disable-form="fileContent != null"
      @fileContent="fileContent = $event"
      @deleteContent="fileContent = $event"
      @val="userModuleController"
    >
      <div slot="header">
        <InformationDisplay
          :display-text="{
            heading: 'Module users',
            content: 'Manage all users and groups here.'
          }"
          mode="title"
        />
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

import ManageUserGroups from "./ManageUserGroups";

import Tabs from "@/components/Tabs";
import InformationDisplay from "@/components/InformationDisplay";

export default {
  name: "UserModuleDialog",
  components: {
    InformationDisplay,
    Tabs,
    ManageUserGroups
  },

  props: {
    display: Boolean
  },

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
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters("Admin", ["getUserGroups"]),

    genPwd() {
      return this.createUserForm.name
        .trim()
        .toLowerCase()
        .replace(/\s/g, "");
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
          validType: "number",
          clearable: true,
          options: this.getUserGroups
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

    userModuleController(val) {
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
  }
};
</script>
