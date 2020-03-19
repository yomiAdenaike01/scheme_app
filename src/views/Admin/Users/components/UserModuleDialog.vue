<template>
  <el-dialog width="40%" :visible.sync="view">
    <Tabs
      v-model.number="currentTab"
      :tabs="tabs"
      @fileContent="fileContent = $event"
      @deleteContent="fileContent = $event"
      @val="userModuleController"
      :disableForm="fileContent != null"
      v-loading="loading"
    >
      <div slot="header_content">
        <Title title="Module users" subtitle="Manage all users and groups here." />
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

import ManageUserGroups from "./ManageUserGroups";
import CreateUserOptions from "./CreateUserOptions";

import Tabs from "@/components/Tabs";
import Title from "@/components/Title";

export default {
  name: "UserModuleDialog",

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
  components: {
    Title,
    Tabs,
    ManageUserGroups,
    CreateUserOptions
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters("Admin", ["getUserGroups"]),

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

