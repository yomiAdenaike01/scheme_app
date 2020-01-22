<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Tabs
      v-loading="loading"
      :tabs="tabs"
      @uploadFileContent="fileContent = $event"
      @removeContent="fileContent = '', timeSheetError = null"
      @val="eventData = $event"
      :disable="currentTab == 1"
      v-model.number="currentTab"
      :liveChange="true"
      :customMethod="!timeSheetError && fileContent.length > 0 ? submitWithTimeSheet : submitOneShift"
      :disableForm="fileContent.length > 0"
    >
      <!-- Confirmation unit for a template or csv content -->
      <div slot="header_content">
        <Title
          defaultClass="m-0"
          :title="getIsAdmin ? 'Create event' : 'Create request'"
          subtitle="Fill in the following form to create a new event"
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
import ShiftTemplate from "./ShiftTemplate";
import UploadFile from "@/components/UploadFile";
import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import CreateShiftOptions from "./CreateShiftOptions";
import ValidationUnit from "@/components/ValidationUnit";
import MoreInformation from "@/components/MoreInformation";
import findTeam from "@/mixins/findTeam";
import createShift from "../createShift";
import moment from "moment";
import csvtojson from "csvtojson";

export default {
  name: "CreateShift",
  mixins: [dates, findTeam, createShift],
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
    ...mapState("Admin", ["team", "shiftTypes"]),
    ...mapState(["token", "currentUser", "weeklyTimesheetUploaded"]),
    ...mapGetters("Admin", ["getTeamMember"]),

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
          assigned_to: null,
          startDate: null,
          endDate: null,
          shift_type: null
        };
        let isAdmin = this.getIsAdmin;
        let currentUser = this.currentUser.name.trim().toLowerCase();
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
                case "assigned_to": {
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
                case "shift_type": {
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
    ShiftTemplate,
    UploadFile,
    Tabs,
    CreateShiftOptions,
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
