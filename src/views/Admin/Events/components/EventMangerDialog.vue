<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Tabs
      v-loading="loading"
      :tabs="tabs"
      @uploadFileContent="fileContent = $event"
      @removeContent="(fileContent = ''), (timeSheetError = null)"
      @val="eventManagerController"
      :disable="currentTab > 1"
      v-model.number="currentTab"
      :liveChange="true"
      size="mini"
      :disableForm="fileContent.length > 0"
    >
      <!-- Confirmation unit for a template or csv content -->
      <div slot="header_content">
        <Title
          defaultClass="m-0"
          title="Event creation"
          subtitle="Select different tabs to create groups or events."
        />
        <div class="content_container p-3 flex_center" v-if="currentTab > 0">
          <ValidationUnit v-bind="validationUnitController" />
        </div>
      </div>

      <div slot="body_content">
        <div class="ml-4 mt-4 flex align-center" v-if="currentTab == 0">
          <ColourUnit v-model="eventData.colour" />
          <p class="mb-3 ml-4 desc grey">Press to select an event colour (optional):</p>
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
import ColourUnit from "@/components/ColourUnit";
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
      userTemplates: null,
      syncWithGcal: false
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
    ...mapState("Admin", ["teamInformation"]),
    ...mapState([
      "token",
      "userInformation",
      "weeklyTimesheetUploaded",
      "clientInformation"
    ]),
    ...mapGetters("Admin", [
      "getTeamMember",
      "getDropdownTeamMembers",
      "getEnabledEvents"
    ]),

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
          formContent: this.createEventForm
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
          placeholder: "Event group name",
          required: true,
          model: "name"
        },
        {
          "component-type": "select",
          options: this.clientInformation.userGroups,
          placeholder: "(Optional) Enable for user group",
          model: "enabledFor",
          multiple: true
        }
      ];
    },
    createEventForm() {
      let isShiftOrHoliday = this.isNotShiftOrHoliday;

      let createEventConfig = [
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getEnabledEvents,
          required: true,
          model: "type",
          validType: "number"
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time-range",
          placeholder: "Timings",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          model: "date",
          optional: true
        }
      ];

      // Check if it is an admin or not
      let isAdmin = this.getIsAdmin;
      if (isAdmin) {
        createEventConfig.unshift(
          {
            placeholder: "Select Team Member",
            "component-type": "select",
            model: "assignedTo",
            options: this.getDropdownTeamMembers,
            multiple: true
          },
          {
            placeholder: "Repeat For (in days)",
            id: "repeat_days",
            "component-type": "text",
            model: "repeat_days"
          }
        );
      }

      return createEventConfig;
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

    createEventController() {
      if (this.hasEntries(this.fileContent)) {
        this.createEventWithTimeSheet();
      } else {
        this.createOneEvent();
      }
    },

    eventManagerController(val) {
      this.eventData = val;
      switch (this.currentTab) {
        case 0: {
          this.createEventGroup();
          break;
        }

        case 1: {
          this.createEventController();
          break;
        }

        default: {
          break;
        }
      }
    },
    createEventGroup() {
      let eventData = {
        ...this.eventData,
        value: this.clientInformation.eventGroups.length + 1
      };
      this.request({
        method: "POST",
        url: "clients/group",
        data: { name: "eventGroups", value: eventData }
      })
        .then(response => {
          this.loading = false;
          this.view = false;
        })
        .catch(err => {
          this.loading = false;
          this.view = false;
        });
    },
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
    MoreInformation,
    ColourUnit
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
