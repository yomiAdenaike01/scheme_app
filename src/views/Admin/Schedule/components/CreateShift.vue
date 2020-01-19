<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Tabs
      :tabs="tabs"
      @uploadFileContent="fileContent = $event"
      @removeContent="fileContent = '', timeSheetError = null"
      @val="eventData = $event"
      :disable="currentTab == 1"
      v-model.number="currentTab"
      :liveChange="true"
      :customMethod="submit"
      :disableForm="fileContent.length > 0"
    >
      <!-- Confirmation unit for a template or csv content -->
      <Title
        slot="header_content"
        defaultClass="m-0"
        class="mb-4"
        :title="getInstructions['admin']['create_event']['title']"
        subtitle="Fill in the following form to create a new event"
      />
      <div class="content_container p-3 flex_center" slot="body_content" v-if="currentTab == 0">
        <ValidationUnit v-bind="validationUnitController" />
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import dates from "@/mixins/dates";
import ShiftTemplate from "./ShiftTemplate";
import moment from "moment";
import UploadFile from "@/components/UploadFile";
import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import CreateShiftOptions from "./CreateShiftOptions";
import ValidationUnit from "@/components/ValidationUnit";
import MoreInformation from "@/components/MoreInformation";
export default {
  name: "CreateShift",
  mixins: [dates],
  data() {
    return {
      eventData: {},
      success: false,
      fileContent: "",
      currentTab: 0,
      timeSheetError: null
    };
  },
  props: {
    display: Boolean
  },
  activated() {
    this.loadingTemplates = true;

    // this.loadingTemplates = false;
  },
  computed: {
    ...mapGetters(["getIsAdmin", "getInstructions"]),
    ...mapState("Admin", ["team", "shiftTypes"]),
    ...mapState(["token", "currentUser", "weeklyTimesheetUploaded"]),
    ...mapGetters("Admin", ["getTeamMember"]),
    validationUnitController() {
      return {
        success: {
          condition: this.timeSheetError == false,
          text: "Time sheet successfully validated."
        },
        danger: {
          text: "Time sheet validation failed.",
          condition: this.timeSheetError == true
        },
        info: {
          text: "Timesheet not selected",
          condition: this.fileContent.length <= 0
        }
      };
    },
    tabs() {
      return [
        {
          label: this.getIsAdmin ? "Create event" : "Create Request",
          formContent: this.returnCreateShiftConfig
        },
        {
          label: "Timesheets",
          view: {
            component: CreateShiftOptions
          }
        }
      ];
    },

    returnShiftTypes() {
      let shiftTypes = this.shiftTypes;
      let shiftTypeOptions = [];

      for (let property in shiftTypes) {
        let shiftTypeText = shiftTypes[property];
        const append = () => {
          shiftTypeOptions.push({
            text: shiftTypeText,
            value: parseInt(property)
          });
        };
        switch (shiftTypeText) {
          case "Normal": {
            if (this.getIsAdmin) {
              append();
            }
            break;
          }
          case "Locumn": {
            if (this.currentUser.employee_type == 3) {
              append();
            }
            break;
          }
          default: {
            append();
            break;
          }
        }
      }
      return shiftTypeOptions;
    },

    isNotShiftOrHoliday() {
      let shiftType = this.eventData.shift_type;
      const isAdmin = this.getIsAdmin;
      return !isAdmin && shiftType > 3;
    },

    returnCreateShiftConfig() {
      let team = this.returnTeam;
      let isShiftOrHoliday = this.isNotShiftOrHoliday;

      let createShiftConfig = [
        {
          type: "select",
          placeholder: "Select event type",
          options: this.returnShiftTypes,
          required: true,
          model: "shift_type"
        },
        {
          type: "date-time",
          placeholder: "Timings",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          model: "date",
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
          model: "assigned_to",
          options: this.returnTeam
        });
      }
      // Add reasons for being sick
      if (this.isNotShiftOrHoliday) {
        createShiftConfig.push({
          label:
            "Please enter a reason for the sick leave or time off and please feel free to attach a document displaying proof",
          type: "text",
          textarea: true,
          placeholder: "Optional: Please enter reason for sick leave",
          model: "reasons",
          required: true
        });
      }

      return createShiftConfig;
    },
    returnTeam() {
      return this.team.map(member => {
        return {
          text: member.name,
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

          // Loop the validation scheme and check that each one has values
          for (let property in validateData) {
            if (!eventElement[property]) {
              this.UPDATE_NOTIFICATIONS({
                title: "Error processing csv file",
                type: "info",
                message: "There are missing parameters."
              });
              return Promise.reject();
              break;
            } else {
              return Promise.reolve();
            }
          }
          console.log(eventElement);
        }
      });
    },

    async timeSheetManagement() {
      const csvtojson = require("csvtojson");
      this.processingTimeSheet = true;
      let fileContent = this.fileContent;
      try {
        fileContent = await csvtojson().fromString(fileContent);
        let validationResult = await this.validateCSVData(fileContent);
        return Promise.resolve(validationResult);
      } catch (e) {
        this.processingTimeSheet = false;
        this.UPDATE_NOTIFICATIONS({
          title: "Failed to validate timesheet",
          type: "info",
          message:
            "Failed when processing the csv file, please check the csv file and upload it again"
        });
        return Promise.reject(e);
      }
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
    submit() {
      console.log("FINAL", this.eventData);
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
    Title,
    ShiftTemplate,
    UploadFile,
    Tabs,
    CreateShiftOptions,
    ValidationUnit,
    MoreInformation
  },
  watch: {
    fileContent(val) {
      if (val) {
        this.timeSheetManagement()
          .then(response => {
            this.timeSheetError = false;
          })
          .catch(error => {
            this.timeSheetError = true;

            return error;
          });
      }
    }
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
