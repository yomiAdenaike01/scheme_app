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
import UploadFile from "@/components/UploadFile";
import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import CreateShiftOptions from "./CreateShiftOptions";
import ValidationUnit from "@/components/ValidationUnit";
import MoreInformation from "@/components/MoreInformation";
import findTeam from "@/mixins/findTeam";
import createShift from "../createShift";
const csvtojson = require("csvtojson");

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
      timeSheetData: ""
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
    /**
     * @params {Array} converted csv file
     * TODO SHIFT TYPES
     * TODO CAN ADD OTHER USERS IF ADMIN
     * TODO RETURN THE CORRECT TEAM MEMBERS
     */
    async validateCSVData(fileData) {
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
        let eventElement = this.convertEvent(fileData[i]);
        // Loop the validation scheme and check that each one has values
        for (let property in validateData) {
          let eventAttribute = eventElement[property];
          if (!eventAttribute) {
            return Promise.reject(
              "Timesheet validation error, please enter the correct data format for the timesheets"
            );
          }
        }
      }
      return Promise.resolve(fileData);
    },

    async timeSheetManagement() {
      try {
        let holder = await csvtojson().fromString(this.fileContent);
        let validationResult = await this.validateCSVData(this.fileContent);
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
