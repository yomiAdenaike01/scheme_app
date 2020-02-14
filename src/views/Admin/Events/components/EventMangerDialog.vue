<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Tabs
      v-loading="loading"
      :tabs="tabs"
      @uploadFileContent="fileContent = $event"
      @removeContent="(fileContent = ''), (timeSheetError = null)"
      @val="eventData = $event"
      :disable="currentTab == 1"
      v-model.number="currentTab"
      :liveChange="true"
      size="mini"
      :customMethod="
        !timeSheetError && fileContent.length > 0
          ? submitWithTimeSheet
          : submitOneShift
      "
      :disableForm="fileContent.length > 0"
    >
      <!-- Confirmation unit for a template or csv content -->
      <div slot="header_content">
        <Title
          defaultClass="m-0"
          title="Event creation"
          subtitle="Select different tabs to create groups or events."
        />
        <div class="content_container p-3 flex_center">
          <ValidationUnit v-bind="validationUnitController" />
        </div>
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import dates from "@/mixins/dates";
import EventTemplate from "./EventTemplate";
import UploadFile from "@/components/UploadFile";
import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import EventOptions from "./EventOptions";
import ValidationUnit from "@/components/ValidationUnit";
import MoreInformation from "@/components/MoreInformation";
import findTeam from "@/mixins/findTeam";
import createEvent from "../createEvent";
import moment from "moment";
import csvtojson from "csvtojson";

export default {
  name: "EventManagerDialog",
  mixins: [dates, findTeam, createEvent],
  data() {
    return {
      eventData: {},
      loading: false,
      fileContent: "",
      currentTab: 0,
      timeSheetError: null,
      timeSheetData: "",
      userTemplates: null
    };
  },
  props: {
    display: Boolean
  },

  deactivated() {
    this.resetData();
  },
  computed: {
    ...mapGetters(["getIsAdmin", "getInstructions", "getName"]),
    ...mapState("Admin", ["team"]),
    ...mapState([
      "token",
      "userInformation",
      "weeklyTimesheetUploaded",
      "clientInformation"
    ]),
    ...mapGetters("Admin", ["getTeamMember", "getDropdownTeamMembers"]),

    isNotShiftOrHoliday() {
      let type = this.eventData.type;
      const isAdmin = this.getIsAdmin;
      return !isAdmin && type > 3;
    },

    validationUnitController() {
      return {
        success: {
          condition:
            this.timeSheetError == false && this.fileContent.length > 0,
          text:
            "Time sheet successfully validated please submit to add timesheet."
        },
        danger: {
          text: "Time sheet validation failed.",
          condition: this.timeSheetError == true && this.fileContent.length > 0
        },
        info: {
          text: "Timesheet not selected",
          condition: this.fileContent.length <= 0
        }
      };
    },
    tabs() {
      let tabs = [
        {
          label: this.getIsAdmin ? "Create event" : "Create Request",
          formContent: this.returnCreateShiftConfig
        },
        {
          label: "Timesheets",
          view: {
            component: EventOptions
          }
        }
      ];

      tabs.unshift({
        label: "Create Event Group",
        formContent: this.createEventGroupForm
      });
      return tabs;
    },
    createEventGroupForm() {
      return [
        {
          "component-type": "text",
          placeholder: "Event Name",
          required: true,
          model: "eventName"
        },
        {
          "component-type": "select",
          options: this.clientInformation.userGroups,
          placeholder: "Enable for (specify users who can select it)",
          model: "enableFor"
        }
      ];
    },
    returnCreateShiftConfig() {
      let isShiftOrHoliday = this.isNotShiftOrHoliday;

      let createShiftConfig = [
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.clientInformation.userGroups,
          required: true,
          model: "type"
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time-range",
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
        createShiftConfig.unshift(
          {
            name: "Employee",
            placeholder: "Select Team Member",
            id: "assignedTo",
            "component-type": "select",
            model: "assignedTo",
            options: this.getDropdownTeamMembers,
            multiple: true
          },
          {
            name: "repeat_for",
            placeholder: "Repeat For (in days)",
            id: "repeat_days",
            "component-type": "text",
            model: "repeat_days"
          }
        );
      }
      // Add reasons for being sick
      if (this.isNotShiftOrHoliday) {
        createShiftConfig.push({
          type: "text",
          textarea: true,
          placeholder:
            "Optional: Please enter reason for sick leave or time-off",
          model: "notes",
          required: true
        });
      }

      return createShiftConfig;
    },
    //  control the current view
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

    resetData() {
      this.timeSheetError = null;
      this.fileContent = "";
      this.timeSheetData = "";
      this.loading = true;

      let loadingTimeout;
      clearTimeout(loadingTimeout);

      loadingTimeout = setTimeout(() => {
        this.loading = false;
      }, 1000);
    },

    async validateCSVData(fileData) {
      try {
        let validateData = {
          assignedTo: null,
          startDate: null,
          endDate: null,
          type: null
        };

        let isAdmin = this.getIsAdmin;
        let userInformation = this.userInformation.name.trim().toLowerCase();
        const len = fileData.length;

        for (let i = 0; i < len; i++) {
          let eventElement = fileData[i];
          // Validate against the schema

          for (let property in validateData) {
            if (!eventElement[property]) {
              return Promise.reject("Time sheet is missing parameters");

              break;
            } else {
              switch (property) {
                case "assignedTo": {
                  eventElement[property] = await this.getEmployeeID(
                    eventElement[property]
                  );
                  break;
                }

                case "startDate": {
                  eventElement[property] = await moment(
                    moment(eventElement[property])
                  ).toISOString();

                  break;
                }

                case "endDate": {
                  eventElement[property] = await moment(
                    moment(eventElement[property])
                  ).toISOString();

                  break;
                }

                case "type": {
                  if (eventElement[property] == 1) {
                    return Promise.reject(
                      "Non admins cannot create shifts, if you require a shift, please request it from your admin."
                    );
                  }
                }

                default:
                  break;
              }
            }
          }

          return Promise.resolve(eventElement);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async timeSheetManagement() {
      try {
        let JSONshifts = await csvtojson().fromString(this.fileContent);
        let validationResult = await this.validateCSVData(JSONshifts);

        return Promise.resolve(validationResult);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  },

  watch: {
    fileContent(val) {
      if (val) {
        let data = this.timeSheetManagement()
          .then(response => {
            this.timeSheetData = response;
            this.timeSheetError = false;
          })
          .catch(error => {
            this.timeSheetError = true;

            this.UPDATE_NOTIFICATIONS({
              title: "Timesheet error",
              message: error,
              type: "info"
            });
          });
      }
    }
  },
  components: {
    Title,
    EventTemplate,
    UploadFile,
    Tabs,
    EventOptions,
    ValidationUnit,
    MoreInformation
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
