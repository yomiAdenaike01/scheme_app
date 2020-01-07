<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Title
      defaultClass="mb-0"
      :title="!getIsAdmin ? 'Create Request' : 'Create Shift'"
      :subtitle="
        !getIsAdmin
          ? 'Fill in the form below to create a request.'
          : 'Fill in the form below to create a shift.'
      "
      slot="title"
    />

    <el-form
      v-loading="processingTimeSheet"
      class="ml-3 mr-3 mt-0 pt-0"
      status-icon
      label-position="left"
      :model="eventData"
      :disabled="returnInvalidateForm"
    >
      <!-- Timesheet -->
      <el-form-item class="extra_form_item">
        <p @click="uploadTimeSheetDisplay = !uploadTimeSheetDisplay">
          Upload Timesheet
        </p>
        <el-collapse-transition>
          <div class="mt-3" v-if="uploadTimeSheetDisplay">
            <!-- Input for the timesheet -->
            <input
              type="file"
              @change="timeSheetManagement"
              id="upload_timesheet"
            />
          </div>
        </el-collapse-transition>
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
          class="form_item"
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
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import dates from "@/mixins/dates";
import moment from "moment";
export default {
  name: "CreateShift",
  mixins: [dates],
  data() {
    return {
      repeat_toggle: false,
      save_as_template: false,
      selectMultipleEmployees: false,
      uploadTimeSheetDisplay: false,
      isValidCSV: false,
      validFile: null,
      processingTimeSheet: false,
      csvErrorContents: [],
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
    returnInvalidateForm() {
      // If the upload timesheet is enabled or there is a file make the entire form invalid
      return this.uploadTimeSheetDisplay;
    },
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
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    /**
     * @params Team members fullname
     */
    findTeamMember(memberName) {
      return this.team.find(member => {
        member.name = member.name.trim().toLowerCase();
        memberName = memberName.trim().toLowerCase();
        return member.name == memberName;
      });
      return foundTeamMember;
    },
    validateKeys(eventKey, validationKey) {
      let isValid;
      if (!validationKey || validationKey != eventKey) {
        // Error found
        isValid = false;
      } else {
        isValid = true;
      }
      return isValid;
    },
    formatEventDates({ startDate, endDate }) {
      const format = "DD/MM/YYYY HH:mm:ss";
      startDate = moment(moment(startDate).format(format)).toISOString();
      endDate = moment(moment(endDate).format(format)).toISOString();
      return {
        startDate,
        endDate
      };
    },
    /**
     * @params {Array} converted csv file
     */
    validateCSVData(fileData) {
      return new Promise((resolve, reject) => {
        let validateData = {
          assigned_to: null,
          startDate: null,
          endDate: null
        };
        const len = fileData.length;
        for (let i = 0; i < len; i++) {
          let eventElement = fileData[i];
          const eventKeys = Object.keys(eventElement);
          const validationKeys = Object.keys(validateData);
          const eventKeysLen = eventKeys.length;

          // Checking the keys against the validation schema
          for (let j = 0; j < eventKeysLen; j++) {
            const eventKey = eventKeys[j];
            const validationKey = validationKeys[j];
            let finalValidation = this.validateKeys(eventKey, validationKey);
            if (finalValidation) {
              resolve(fileData);
            } else {
              reject(finalValidation);
            }
          }

          // Changed the assigned to
          let foundTeamMember = this.findTeamMember(eventElement.assigned_to);

          if (!foundTeamMember) {
            reject(false);
            this.UPDATE_NOTIFICATIONS({
              type: "error",
              message: `${eventElement.assigned_to} could not be found as a team member`
            });
          }

          eventElement.assigned_to = foundTeamMember._id;
          this.processingTimeSheet = false;

          // assign the shift type if there isn't one

          if (!eventElement.shift_type) {
            eventElement.shift_type = foundTeamMember.employee_type;
          }

          // Format the dates
          let startDate = eventElement.startDate,
            endDate = eventElement.endDate;

          let formattedDates = this.formatEventDates({ startDate, endDate });
          eventElement.startDate = formattedDates.startDate;
          eventElement.endDate = formattedDates.endDate;
        }
      });
    },

    timeSheetManagement(e) {
      const csvtojson = require("csvtojson");
      const fileReader = new FileReader();
      e = e.target.files[0];
      this.processingTimeSheet = true;

      fileReader.onload = async () => {
        try {
          let fileContent = await csvtojson().fromString(fileReader.result);
          let validationResult = await this.validateCSVData(fileContent);
          this.uploadTimeSheet(validationResult);
        } catch (e) {
          console.error(e);
          this.processingTimeSheet = false;
          // Create dialog with error processing csv file
          this.UPDATE_NOTIFICATIONS({
            type: "error",
            message:
              "Failed when processing the csv file, please check the csv file and upload it again"
          });
        }
      };
      fileReader.readAsBinaryString(e);
    },
    uploadTimeSheet(file) {
      return console.log(file);
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
      this.processingTimeSheet = false;
      this.$emit("toggle", false);
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
.form_item {
  width: 100%;
}
</style>
