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
    >
      <!-- Displaying templates -->
      <el-form-item
        class="custom_form_item shift_templates_container"
        v-if="templates.length > 0"
        v-loading="loadingTemplates"
        @click="displayTemplates = !displayTemplates"
      >
        <p>Previously Saved Templates</p>
        <el-collapse-transition>
          <div>
            <ShiftTemplate
              @selectedTemplate="selectedTemplate = $event"
              v-for="template in templates"
              :data="template"
              :key="template._id"
            />
            <!-- Selecting the templates -->
            <transition name="el-fade-in">
              <div v-if="returnIsTemplateSelected">
                <el-button
                  size="small"
                  round
                  type="primary"
                  @click="publishSavedTemplate"
                  >Publish</el-button
                >
              </div>
            </transition>
          </div>
        </el-collapse-transition>
      </el-form-item>
      <!-- Timesheet -->
      <el-form-item class="custom_form_item">
        <p @click="uploadTimesheetToggle = !uploadTimesheetToggle">
          Upload Timesheet
        </p>
        <el-collapse-transition>
          <div class="mt-3" v-if="uploadTimesheetToggle">
            <!-- Input for the timesheet -->
            <input
              type="file"
              @change="timeSheetManagement"
              id="upload_timesheet"
            />
          </div>
        </el-collapse-transition>
      </el-form-item>

      <!-- Create for multiple employees (IF ADMIN) -->
      <el-form-item class="custom_form_item" v-if="getIsAdmin">
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

      <!-- Second form to be able to disable other entries -->
      <el-form :model="eventData" :disabled="returnInvalidateForm">
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
            :end-placeholder="
              item.end_placeholder ? item.end_placeholder : null
            "
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
            <el-form-item class="custom_form_item">
              <el-input
                type="textarea"
                :placeholder="
                  `Please input reasons for ${eventData.shift_type}`
                "
                v-model="textarea"
                maxlength="250"
                show-word-limit
              />
            </el-form-item>
          </el-collapse-transition>
        </el-form-item>
      </el-form>
    </el-form>

    <!-- Footer -->
    <span slot="footer" class="dialog-footer" v-if="!returnInvalidateForm">
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
import ShiftTemplate from "./ShiftTemplate";
import moment from "moment";
export default {
  name: "CreateShift",
  mixins: [dates],
  data() {
    return {
      repeat_toggle: false,
      selectMultipleEmployees: false,
      uploadTimesheetToggle: false,
      isValidCSV: false,
      validFile: null,
      processingTimeSheet: false,
      selectedTemplate: {},
      templates: [],
      loadingTemplates: false,
      displayTemplates: false,
      eventData: {
        date: {},
        assigned_to: "",
        loading: false,
        shift_type: null,
        repeat_days: [0],
        reasons: ""
      },
      multi_employee: [],

      templateData: {
        name: "",
        content: ""
      },
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
  mounted() {
    this.loadingTemplates = true;
    this.request({
      method: "GET",
      url: "templates/all"
    })
      .then(response => {
        this.templates = response;
        this.loadingTemplates = false;
      })
      .catch(error => {
        this.loadingTemplates = false;
        return error;
      });
    // this.loadingTemplates = false;
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState("Admin", ["team", "shiftTypes"]),
    ...mapState(["token", "currentUser", "weeklyTimesheetUploaded"]),
    ...mapGetters("Admin", ["getTeamMember"]),

    returnIsTemplateSelected() {
      return Object.keys(this.selectedTemplate).length > 0;
    },
    returnInvalidateForm() {
      return this.uploadTimesheetToggle || this.returnIsTemplateSelected;
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
    ...mapMutations(["UPDATE_NOTIFICATIONS", "UPDATE_UPLOAD_TIMESHEET"]),

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
        let isAdmin = this.getIsAdmin;
        const len = fileData.length;
        for (let i = 0; i < len; i++) {
          let eventElement = fileData[i];
          const eventKeys = Object.keys(eventElement);
          const validationKeys = Object.keys(validateData);
          const eventKeysLen = eventKeys.length;

          if (isAdmin) {
            eventElement.is_approved = {
              admin: 1,
              user: 1
            };
          } else {
            if (eventElement.assigned_to != this.currentUser._id) {
              eventElement.assigned_to = this.currentUser._id;
            }
          }

          // Check none of them are null if they are remove them
          for (let property in eventElement) {
            if (eventElement[property].length <= 0) {
              fileData.splice(i, 1);
            }
          }

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
          let foundTeamMember = this.getTeamMember(
            eventElement.assigned_to,
            "_id"
          ).name;

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
          // If not selected template them create a new template and if upload timesheet is not selected
          if (!this.returnIsTemplateSelected && this.uploadTimesheetToggle) {
            this.uploadTimeSheetAndTemplate(validationResult);
          }
        } catch (e) {
          this.processingTimeSheet = false;
          this.UPDATE_NOTIFICATIONS({
            type: "error",
            message:
              "Failed when processing the csv file, please check the csv file and upload it again"
          });
        }
      };
      fileReader.readAsBinaryString(e);
    },
    /**
     *  Adds one week to the content
     */
    addOneWeekData(data) {
      return data.map(elem => {
        return {
          ...elem,
          startDate: moment(
            moment(elem.startDate).add(1, "week")
          ).toISOString(),
          endDate: moment(moment(elem.endDate).add(1, "week")).toISOString()
        };
      });
    },
    /**
     * Publish saved template
     */
    publishSavedTemplate() {
      this.uploadTimeSheet(this.selectedTemplate.content);
    },
    /**
     * Upload time sheet
     */
    uploadTimeSheet(content) {
      let timesheet = content;
      let payload = {
        method: "POST",
        url: "shifts/timesheet",
        data: { timesheet: content }
      };
      // Running normal request to timesheet
      this.request(payload)
        .then(response => {
          if (!this.weeklyTimesheetUploaded) {
            this.UPDATE_UPLOAD_TIMESHEET(true);
            this.$emit("toggle", false);
          }
          this.$emit("toggle", false);
        })
        .catch(error => {
          return error;
        });
      this.processingTimeSheet = false;

      // If there is a selected template add one week to its contents and then update the timesheet
      if (this.returnIsTemplateSelected) {
        timesheet = this.addOneWeekData(timesheet);
        payload.data = { update: { content: timesheet } };
        payload.url = "templates/update";
        this.request(payload)
          .then(response => this.$emit("toggle", false))
          .catch(error => {
            return error;
          });
      }
    },
    /**
     * Propmt the user for the template name
     */
    uploadTimeSheetAndTemplate(file) {
      this.processingTimeSheet = false;
      this.$prompt(
        "Please input your new template name if you want to save this timesheet as a template",
        "Save Template",
        {
          confirmButtonText: "Save",
          cancelButtonText: "Cancel",
          inputPlaceholder: `schedule_created ${new Date()}`,
          roundButton: true
        }
      ).then(({ value }) => {
        this.processingTimeSheet = true;
        // Set the template data fields
        this.templateData.content = this.addOneWeekData(file);
        this.templateData.name = value;

        if (!this.templateData.name) {
          this.UPDATE_NOTIFICATIONS({
            type: "error",
            message: "Please fill in the correct fields for your new template"
          });
        }

        // Run request for template and timesheet
        this.uploadTimeSheet({ timesheet: file, template: this.templateData });
      });
    }
  },
  components: {
    Title: () => import("@/components/Title"),
    ShiftTemplate
  }
};
</script>

<style lang="scss" scoped>
.shift_templates_container {
  height: 40%;
  overflow: auto;
}
.custom_form_item {
  background: rgb(253, 253, 253);
  padding: 1em;
  border-radius: 10px;
  cursor: pointer;
}
.form_item {
  width: 100%;
}
</style>
