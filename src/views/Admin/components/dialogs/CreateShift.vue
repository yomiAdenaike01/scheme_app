<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Title
      :title="!getIsAdmin ? 'Create Request' : 'Create Shift'"
      :subtitle="
        !getIsAdmin
          ? 'Fill in the form below to create a request.'
          : 'Fill in the form below to create a shift.'
      "
      slot="title"
    />

    <el-form
      class="ml-3 mr-3"
      status-icon
      label-position="left"
      :model="eventData"
    >
      <!-- Timesheet -->
      <el-form-item class="extra_form_item">
        <el-form-item class="extra_form_item">
          <p @click="uploadTimeSheetDisplay = !uploadTimeSheetDisplay">
            Upload Timesheet
          </p>
          <el-collapse-transition>
            <div class="mt-3" v-if="uploadTimeSheetDisplay">
              <input type="file" @change="timeSheetManagement" />
            </div>
          </el-collapse-transition>
        </el-form-item>
      </el-form-item>
      <!-- Create for multiple employees -->
      <el-form-item class="extra_form_item">
        <p @click="selectMultipleEmployees = !selectMultipleEmployees">
          Assign Shift To Multiple Employees
        </p>
        <el-collapse-transition>
          <div class="mt-3" v-if="selectMultipleEmployees">
            <el-checkbox-group v-model="multi_employee">
              <el-checkbox-button
                v-for="(member, index) in returnTeam"
                :key="index"
                :value="member.value"
                :label="member.label"
                >{{ member.label }}</el-checkbox-button
              >
            </el-checkbox-group>
          </div>
        </el-collapse-transition>
      </el-form-item>

      <el-form-item
        :required="item.required"
        v-for="item in returnCreateShiftConfig"
        :key="item.id"
        :label="item.name"
      >
        <component
          :is="item.type == 'select' ? 'el-select' : 'el-date-picker'"
          type="datetimerange"
          v-model="eventData[item.id]"
          :start-placeholder="
            item.start_placeholder ? item.start_placeholder : null
          "
          :end-placeholder="item.end_placeholder ? item.end_placeholder : null"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        >
          <el-option
            v-for="(option, index) in item.options"
            :key="index"
            :value="option.value"
            :label="option.label"
          ></el-option>
        </component>
        <el-collapse-transition v-if="isNotShiftOrHoliday">
          <el-form-item class="extra_form_item">
            <el-input
              type="textarea"
              :placeholder="`Please input reasons for ${eventData.shift_type}`"
              v-model="textarea"
              maxlength="250"
              show-word-limit
            />
          </el-form-item>
        </el-collapse-transition>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        round
        type="primary"
        @click="$emit('createEvent', eventData), $emit('toggle', false)"
        >Publish</el-button
      >
      <el-button round @click="$emit('toggle', false)">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "CreateShift",

  data() {
    return {
      repeat_toggle: false,
      save_as_template: false,
      selectMultipleEmployees: false,
      uploadTimeSheetDisplay: false,
      eventData: {
        date: {},
        assigned_to: "",
        loading: false,
        shift_type: null,
        repeat_days: [0],
        reasons: ""
      },
      multi_employee: [],
      validationData: {
        startDate: [
          {
            type: "date",
            required: true,
            message: "Please pick a date",
            trigger: "change"
          }
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "Please pick a date",
            trigger: "change"
          }
        ]
      },
      success: false
    };
  },
  props: {
    display: Boolean
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState("Admin", ["team", "shiftTypes"]),
    ...mapState(["token"]),

    returnIsMultiEmployeesSelected() {
      return this.selectMultipleEmployees || this.multi_employee.length > 0;
    },
    returnShiftTypes() {
      let shiftTypes = this.shiftTypes;
      let newShiftTypes = [];
      for (let property in shiftTypes) {
        newShiftTypes.push({
          label: shiftTypes[property],
          value: parseInt(property)
        });
      }
      return newShiftTypes;
    },

    isNotShiftOrHoliday() {
      let shiftType = this.eventData.shift_type;
      const isAdmin = this.getIsAdmin;
      return !isAdmin && shiftType > 3;
    },

    returnCreateShiftConfig() {
      let team = this.returnTeam;

      let createShiftConfig = [
        {
          name: "Request type",
          id: "shift_type",
          type: "select",
          placeholder: "Select event type",
          options: this.returnShiftTypes,
          required: true
        },
        {
          name: "Timings",
          id: "date",
          type: "date",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          required: true
        }
      ];

      // Check if it is an admin or not
      let isAdmin = this.getIsAdmin;
      if (isAdmin) {
        createShiftConfig.unshift({
          name: "Employee",
          placeholder: "Select Team Member",
          id: "assigned_to",
          type: "select",
          options: this.returnTeam,
          required: !this.returnIsMultiEmployeesSelected,
          disabled: this.returnIsMultiEmployeesSelected
        });
      }

      return createShiftConfig;
    },
    returnTeam() {
      return this.team.map(member => {
        return {
          label: member.name,
          value: member._id
        };
      });
    },
    view: {
      get() {
        return this.display;
      },
      set(toggle) {
        this.$emit("toggle", toggle);
      }
    },
    repeatDaysConfig() {
      return ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
    }
  },
  methods: {
    ...mapActions(["request"]),
    validateCSVData(fileData) {},
    timeSheetManagement(e) {
      const csvtojson = require("csvtojson");
      const fileReader = new FileReader();
      e = e.target.files[0];

      fileReader.onload = () => {
        csvtojson()
          .fromString(fileReader.result)
          .then(response => this.validateCSVData(response));
      };
      fileReader.readAsBinaryString(e);
    },
    uploadTimeSheet(file) {
      this.request({
        method: "POST",
        url: "shifts/timesheet",
        data: { timesheet: file }
      })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  components: {
    Title: () => import("@/components/Title")
  }
};
</script>

<style lang="scss" scoped>
.extra_form_item {
  background: rgb(250, 250, 250);
  padding: 1em;
  border-radius: 10px;
  cursor: pointer;
}
</style>
