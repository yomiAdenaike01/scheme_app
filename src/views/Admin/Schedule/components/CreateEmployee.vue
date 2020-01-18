<template>
  <el-dialog :visible.sync="view">
    <Tabs :tabs="tabs" @val="employeeForm = $event"></Tabs>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";
import UploadFile from "@/components/UploadFile";
import ToggleSlideDown from "@/components/ToggleSlideDown";
import Tabs from "@/components/Tabs";
import CreateEmeployeeOptions from "./CreateEmployeeOptions";
export default {
  name: "CreateEmployee",
  data() {
    return {
      uploadMultiple: false,
      loading: false,
      fileContent: "",
      employeeForm: {}
    };
  },

  props: {
    display: Boolean
  },
  computed: {
    genPwd() {
      return this.employeeForm.name
        .trim()
        .toLowerCase()
        .replace(" ", "");
    },
    isoDate() {
      return this.employeeForm.date_of_birth.toISOString();
    },
    rules() {
      let rules = {};
      for (let prop in this.employeeForm) {
        rules[prop] = [
          {
            required: true,
            message: `Please enter the employee's ${prop.toLowerCase()}.`,
            trigger: "blur"
          }
        ];
      }
      return rules;
    },
    tabs() {
      return [
        {
          label: "Create Employee",
          formContent: this.formItems
        },
        {
          label: "Options",
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
          type: "text",
          clearable: true,
          placeholder: "Name",
          model: "name"
        },
        {
          name: "gender",
          placeholder: "Gender",
          type: "select",
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
          type: "text",
          clearable: true,
          placeholder: "Email"
        },
        {
          name: "phoneNumber",
          type: "text",
          model: "phone_number",
          clearable: true,
          placeholder: "Phone Number"
        },
        {
          name: "employeeType",
          model: "employee_type",
          placeholder: "Employee type",
          type: "select",
          options: [
            {
              value: "1",
              text: "Admin"
            },
            {
              value: "2",
              text: "Regular Staff"
            },
            {
              value: "3",
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
    handleChange(event) {
      var input = event.target;

      var reader = new FileReader();
      console.log(input.files[0], reader.readAsText(input.files[0]));
    },
    reset() {
      this.$set(this, "employeeForm", {
        name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        password: "",
        employee_type: "",
        admin_gen: true,
        gender: ""
      });
    },
    ...mapActions(["request"]),
    createEmployee() {
      this.loading = true;
      this.employeeForm.date_of_birth = this.isoDate;
      this.employeeForm.password = this.genPwd;
      const payload = {
        method: "POST",
        url: "/users/register",
        data: this.employeeForm
      };
      this.request(payload)
        .then(response => {
          this.$emit("toggle", false);
          this.loading = false;
          this.reset();
        })
        .catch(error => {
          this.$emit("toggle", false);

          this.loading = false;
          this.reset();
        });
    },
    validateEmployeeForm() {
      this.$refs.employeeForm.validate(valid => {
        if (valid) {
          this.createEmployee();
        }
      });
    }
  },
  components: {
    Title: () => import("@/components/Title"),
    UploadFile,
    ToggleSlideDown,
    Tabs,
    CreateEmeployeeOptions
  }
};
</script>

<style></style>
