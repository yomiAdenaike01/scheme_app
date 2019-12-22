<template>
  <el-dialog :visible.sync="view">
    <Title
      title="Create Employee"
      subtitle="Fill in the form below to create an employee, the employee will recieve an email for them to finalize their account details."
      slot="title"
    />
    <el-form
      label-position="top"
      v-loading="loading"
      :model="employeeForm"
      :rules="rules"
      ref="employeeForm"
    >
      <el-form-item
        v-for="(item, index) in formItems"
        :key="index"
        :prop="item.name"
        :label="item.placeholder"
      >
        <component
          style="width:95%"
          :is="
            item.type == 'date' ? 'el-date-picker' : (item.type=='select' ? 'el-select' : 'el-input')
          "
          v-model="employeeForm[item.model || item.name]"
          :clearable="item.clearable"
          :type="item.type"
          :placeholder="
            `Please enter the employee's ${item.placeholder.toLowerCase()}.`
          "
        >
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="option.disabled"
          ></el-option>
        </component>
      </el-form-item>
      <!-- TODO ADD ATTACHMENTS AND DOCUMENTATION LIKE CV's  -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="validateEmployeeForm">Create</el-button>
      <el-button round @click="$emit('toggle', false)">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "CreateEmployee",
  data() {
    return {
      loading: false,
      employeeForm: {
        name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        password: "",
        employee_type: "",
        admin_gen: true,
        gender: ""
      }
    };
  },
  props: {
    display: Boolean
  },
  computed: {
    genPwd() {
      return this.name;
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
    formItems() {
      return [
        {
          name: "employeeType",
          model: "employee_type",
          placeholder: "Employee type",
          type: "select",
          options: [
            {
              value: "1",
              label: "Admin"
            },
            {
              value: "2",
              label: "Regular Staff"
            },
            {
              value: "3",
              label: "Locumn"
            }
          ]
        },
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
              label: "Male"
            },
            {
              value: "female",
              label: "Female"
            },
            {
              value: "other",
              label: "Other"
            }
          ]
        },
        {
          name: "email",
          type: "email",
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
          name: "dateOfBirth",
          model: "date_of_birth",

          type: "date",
          clearable: true,
          placeholder: "Date Of Birth"
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
    reset() {
      this.$set(this, "employeeForm", {
        name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        password: uuid(),
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
    Title: () => import("@/components/Title")
  }
};
</script>

<style></style>
