<template>
  <el-dialog :visible.sync="view" v-loading="loading">
    <Tabs
      :tabs="tabs"
      @fileContent="fileContent = $event"
      @deleteContent="fileContent = $event"
      @val="employeeForm = $event"
      :disableForm="fileContent != null"
    >
      <div slot="header_content">
        <Title
          title="Create employee"
          subtitle="Enter the employee's details. Feel free to upload a csv file of the employee or employees"
        />
        <div class="flex_center">
          <ValidationUnit v-bind="renderValidationUnit" />
        </div>
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import UploadFile from "@/components/UploadFile";
import ToggleSlideDown from "@/components/ToggleSlideDown";
import Tabs from "@/components/Tabs";
import CreateEmeployeeOptions from "./CreateEmployeeOptions";
import Title from "@/components/Title";
import ValidationUnit from "@/components/ValidationUnit";
const csvtojson = require("csvtojson");
export default {
  name: "CreateEmployee",
  data() {
    return {
      loading: false,
      fileContent: null,
      fileError: null,
      convertedData: {}
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
          text: "Employee timesheet passed tests ready to upload"
        },
        danger: {
          condition: this.fileError == true,
          text: "Employee timesheet passed tests ready to upload"
        },
        info: {
          condition: this.fileError == null,
          text: "Upload employee file"
        }
      };
    },

    genPwd() {
      return this.employeeForm.name
        .trim()
        .toLowerCase()
        .replace(" ", "");
    },

    tabs() {
      return [
        {
          label: "Create Employee",
          formContent: this.formItems
        },
        {
          label: "Upload Employees",
          view: {
            props: "",
            component: CreateEmeployeeOptions
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
              text: "Male"
            },
            {
              value: "female",
              text: "Female"
            },
            {
              value: "other",
              text: "Other"
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
          model: "phone_number",
          clearable: true,
          placeholder: "Phone Number"
        },
        {
          name: "employeeType",
          model: "employee_type",
          placeholder: "Employee type",
          "component-type": "select",
          options: [
            {
              value: 1,
              text: "Admin"
            },
            {
              value: 2,
              text: "General Staff"
            },
            {
              value: 3,
              text: "Locumn"
            }
          ]
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
    async cleanData(JSONData) {
      let JSONContent = await csvtojson().fromString(JSONData);
      let schema = {
        name: null,
        email: "",
        gender: "",
        phone_number: "",
        password: ""
      };
      const len = JSONContent.length;
      for (let i = 0; i < len; i++) {
        let employee = JSONContent[i];
        employee["client_id"] = this.client._id;
        for (let property in schema) {
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
    async createEmployees(employees) {
      await this.request({
        method: "POST",
        url: "users/register/multiple",
        data: { employees: employees }
      });
    }
  },
  components: {
    Title,
    UploadFile,
    ToggleSlideDown,
    Tabs,
    CreateEmeployeeOptions,
    ValidationUnit
  },
  watch: {
    fileContent(val) {
      this.loading = true;
      this.cleanData(val)
        .then(response => {
          this.createEmployees(response).then(response => {
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
