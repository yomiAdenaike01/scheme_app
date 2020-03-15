<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <!-- <div
      v-if="teamInformation.length == 0"
      class="no_team flex_center columns p-4"
    >
      <i class="bx bx-error-circle large_icon"></i>
      <p>You need to create team mmebers before you can create events</p>
      <el-button
        size="small"
        round
        type="primary"
        @click="
          closeDialog('eventManager');
          $router.push({ name: 'user' });
        "
        >Go to user management</el-button
      >
    </div> -->
    <Tabs
      v-loading="loading"
      :tabs="tabs"
      @val="eventManagerController"
      :disable="currentTab > 1"
      v-model="currentTab"
      :selectedTab="currentTab"
      :liveChange="true"
      :disableForm="fileContent.length > 0"
    >
      <!-- Confirmation unit for a template or csv content -->
      <div slot="header_content">
        <Title
          defaultClass="mb-5"
          class="p-4"
          title="Event Management"
          subtitle="Select different tabs to create groups or events."
        />
      </div>

      <div slot="body_content">
        <div
          class="ml-4 mt-4 flex align-center"
          v-if="currentTab == 0 && getIsAdmin"
        >
          <ColourUnit v-model="eventData.colour" />
          <p class="mb-3 ml-4 desc grey">
            Press to select an event colour (optional):
          </p>
        </div>
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import EventTemplate from "./EventTemplate";
import UploadFile from "@/components/UploadFile";
import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import EventOptions from "./EventOptions";
import ValidationUnit from "@/components/ValidationUnit";
import MoreInformation from "@/components/MoreInformation";
import moment from "moment";
import csvtojson from "csvtojson";
import ColourUnit from "@/components/ColourUnit";
export default {
  name: "EventManagerDialog",
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

  deactivated() {
    this.resetData();
  },
  computed: {
    ...mapGetters([
      "getIsAdmin",
      "getInstructions",
      "getName",
      "getActiveDialog"
    ]),
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

    tabs() {
      let tabs = [
        {
          label: this.getIsAdmin ? "Create event" : "Create request",
          formContent: this.createEventForm
        },
        {
          label: "Manage event templates",
          view: {
            component: EventOptions
          }
        }
      ];

      if (this.getIsAdmin) {
        tabs.unshift({
          label: "Create event group",
          formContent: this.createEventGroupForm
        });
      }
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
        return this.getActiveDialog("eventManager");
      },
      set(toggle) {
        this.closeDialog("eventManager");
      }
    }
  },
  methods: {
    ...mapActions(["request", "closeDialog", "genPromptBox"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS", "UPDATE_DIALOG_INDEX"]),
    // Submit one event
    createOneEvent() {
      this.loading = true;
      let { date } = this.eventData;

      let startDate = moment(date[0]).toISOString();
      let endDate = moment(date[1]).toISOString();

      this.eventData = {
        ...this.eventData,
        startDate,
        endDate
      };
      this.request({
        method: "POST",
        url: "events/create",
        data: this.eventData
      })
        .then(response => {
          this.loading = false;
          this.view = false;
          this.UPDATE_NOTIFICATIONS({
            type: "success",
            message: "Event successfully created"
          });
          this.initSaveTemplate();
        })
        .catch(error => {
          this.loading = false;
          return error;
        });
    },
    initSaveTemplate() {
      this.genPromptBox({
        boxType: "prompt",
        title: "Save template",
        text:
          "Would you like to save this event as a template to use for later.",
        type: "info"
      })
        .then(response => {
          this.saveTemplate(response);
        })
        .catch(err => {
          return err;
        });
    },
    saveTemplate(response) {
      let getDayOfStart = moment(this.eventData.startDate).get("day");
      this.request({
        method: "POST",
        url: "events/templates/create",
        data: {
          name: response,
          content: {
            ...this.eventData,
            repeat: { weekdays: [getDayOfStart], until: moment().toISOString() }
          }
        }
      })
        .then(response => {
          return response;
        })
        .catch(err => {
          return err;
        });
    },
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
    }
  },

  components: {
    Title,
    Tabs,
    ColourUnit
  }
};
</script>

<style lang="scss" scoped>
.no_team {
  line-height: 2.5em;
}
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
