<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Tabs
      v-model="currentTab"
      v-loading="loading"
      :tabs="tabs"
      :disable="currentTab > 1"
      :selected-tab="currentTab"
      :submit-text="tabXref.display"
      @val="eventsCtrl"
      @formValChange="eventInformation = $event"
    >
      <div slot="header">
        <InformationDisplay class="mb-5" :display-text="informationDisplay" />
      </div>
      <div slot="body">
        <div
          v-if="tabXref.name == 'create_event_group' && getIsAdmin"
          class="ml-4 mt-4 flex align-center"
        >
          <ColourUnit v-model="eventsInformation.colour" />
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
import EventOptions from "./EventOptions";
import RequestManagement from "./RequestManagement";

import InformationDisplay from "@/components/InformationDisplay";
import Tabs from "@/components/Tabs";
import ColourUnit from "@/components/ColourUnit";

export default {
  name: "EventModuleDialog",
  components: {
    InformationDisplay,
    Tabs,
    ColourUnit,
    RequestManagement
  },
  data() {
    return {
      eventsInformation: {},
      templatesInformation: {},
      loading: false,
      currentTab: 0
    };
  },

  computed: {
    ...mapState(["clientInformation", "daysOfWeek", "userInformation"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog", "getCurrentTabXref"]),
    ...mapGetters("Admin", [
      "getDropdownTeamMembers",
      "getEnabledEvents",
      "getUserGroups",
      "getUserInformation",
      "getUsersInUserGroup"
    ]),

    eventContent() {
      // this.loading = true;
      let eventsInformation = { ...this.eventsInformation };
      let date = eventsInformation?.date;

      let startDate = this.initMoment(date[0]).toISOString();
      let endDate = this.initMoment(date[1]).toISOString();
      eventsInformation.startDate = startDate;
      eventsInformation.endDate = endDate;
      eventsInformation.until = this.initMoment(
        eventsInformation?.until ?? new Date()
      ).toISOString();

      if (this.activeDialogInformation?.length > 0) {
        eventsInformation.assignedTo = eventsInformation.assignedTo.concat(
          this.activeDialogInformation
        );
      }

      eventsInformation = {
        ...eventsInformation,
        repeat: {
          until: eventsInformation.until,
          weekdays: eventsInformation?.weekdays ?? 0
        }
      };

      if (!this.getIsAdmin) {
        eventsInformation.assignedTo = [this.userInformation._id];
      }
      let templatesInformation = {
        content: {
          ...eventsInformation
        }
      };

      if (eventsInformation?.userGroups) {
        // Changed the assigned to to all of the user groups
        let uGroups = eventsInformation.userGroups;
        eventsInformation.assignedTo = [];

        for (let i = 0, len = uGroups.length; i < len; i++) {
          eventsInformation.assignedTo.push(
            ...this.getUsersInUserGroup(uGroups[i])
          );
        }
      }
      return { templatesInformation, eventsInformation };
    },

    informationDisplay() {
      
      let content =
        "You can create a request here that will be sent to an admin for approval",
        heading  = 'Request Management'
      if (this.getIsAdmin) {
        heading = 'Event Management'
        content =
          "As an admin you can create templates to batch create events. You can also create event groups and singular events.";
      }
      return {
        heading,
        content
      };
    },

    assignToUsernames() {
      let usernames = "";
      if (this.activeDialogInformation?.assignedTo) {
        let assignToUsernames = [...this.activeDialogInformation?.assignedTo];
        usernames = assignToUsernames.map(assignee => {
          return this.getUserInformation(assignee)?.name;
        });
      }
      return usernames.length > 1 ? usernames.join(",") : usernames;
    },

    activeDialogInformation() {
      return this.getActiveDialog()?.data;
    },
    isNotShiftOrHoliday() {
      return !this.getIsAdmin && this.eventsInformation.type > 3;
    },

    tabXref() {
      return this.getCurrentTabXref({
        tabs: this.tabs,
        currentTab: this.currentTab
      });
    },

    tabs() {
      let tabs = [
        {
          label: this.getIsAdmin ? "Create event" : "Create request",
          formContent: this.createEventForm,
          displayReset: true
        },
        {
          label:'Manage Requests',
          view:{
            component:RequestManagement,
          }

        }
      ];

      if (this.getIsAdmin) {
        tabs.unshift({
          label: "Create event group",
          formContent: this.createEventGroupForm
        });

        tabs.push({
          label: "Manage event templates",
          view: {
            component: EventOptions
          }
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
          options: this.getUserGroups,
          placeholder: "Enable for user group",
          model: "enabledFor",
          multiple: true,
          optional: true
        }
      ];
    },
    createEventForm() {
      let createEventConfig = [
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getEnabledEvents,
          model: "type",
          validType: "number"
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time-range",
          placeholder: "Timings",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          model: "date"
        }
      ];

      // Check if it is an admin or not

      if (this.getIsAdmin) {
        let teamMemberPlaceholder =
          this.assignToUsernames?.length > 0
            ? `Select team members including (${this.assignToUsernames})`
            : "Select team members";
        createEventConfig.unshift(
          {
            placeholder: teamMemberPlaceholder,
            disabled: this.eventInformation?.userGroups?.length > 0,
            "component-type": "select",
            model: "assignedTo",
            options: this.getDropdownTeamMembers,
            multiple: true
          },
          {
            "component-type": "select",
            options: this.getUserGroups,
            disabled: this.eventInformation?.assignedTo?.length > 0,
            multiple: true,
            model: "userGroups",
            placeholder: "Assign to a user group",
            optional: true
          },
          {
            "component-type": "select",
            placeholder: "Repeat for (days of week)",
            options: this.daysOfWeek,
            multiple: true,
            model: "weekdays",
            optional: true
          },
          // Assign to an event group,

          {
            "component-type": "date-picker",
            "input-type": "date-time",
            placeholder: "Repeat until",
            model: "until",
            optional: true
          }
        );
      }

      return createEventConfig;
    },
    //  control the current view
    view: {
      get() {
        return this.getActiveDialog("eventModule");
      },
      set() {
        this.closeDialog("eventModule");
      }
    }
  },
  methods: {
    ...mapActions(["request", "closeDialog", "genPromptBox"]),
    ...mapActions('Admin',['getRequests']),
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),
    ...mapActions("Admin", ["createEvent", "createEventTemplate"]),

    eventsCtrl(information) {
      this.eventsInformation = information;

      switch (this.tabXref.name) {
        case "create_event_group": {
          break;
        }
        case "create_event": {
          this.genEvent();
          break;
        }
        case "create_request": {
          this.genRequest();
          break;
        }

        default:
          break;
      }
    },
    genRequest() {
      this.loading = true;
      let eventInfo = this.eventContent.eventsInformation;
      let requestInformation = {
        type: this.eventContent.eventsInformation.type,
        endDate:eventInfo.endDate,
        startDate:eventInfo.startDate,
        }
      
      this.request({
        method: "POST",
        url: "events/requests/create",
        data: requestInformation
      }).then(()=>{
        this.loading = false;
        this.getRequests();
      }).catch(()=>{
        this.loading = false;
      })
    },
    // Submit one event
    genEvent() {
      this.createEvent(this.eventContent.eventsInformation)
        .then(() => {
          this.loading = false;
          this.view = false;
          if (this.getIsAdmin) {
            this.initSaveTemplate();
          }
        })
        .catch(() => {
          this.loading = false;
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
        .then(({ value }) => {
          this.resolveSaveTemplate(value);
        })
        .catch(err => {
          return err;
        });
    },

    resolveSaveTemplate(value) {
      let localTemplateInformation = {
        ...this.eventContent.templateInformation,
        name: value
      };
      this.createEventTemplate(localTemplateInformation).catch(() => {
        this.initSaveTemplate();
      });
    },

    createEventGroup() {
      let eventsInformation = {
        ...this.eventsInformation,
        value: this.clientInformation.eventGroups.length + 1
      };
      this.request({
        method: "POST",
        url: "clients/group",
        data: { name: "eventGroups", value: eventsInformation }
      })
        .then(() => {
          this.loading = false;
          this.view = false;
        })
        .catch(() => {
          this.loading = false;
          this.view = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.no_team {
  line-height: 2.5em;
}

.custom_form_item {
  background: rgb(253, 253, 253);
  border-radius: 10px;
  cursor: pointer;
  padding: 1em;
}
.form_item {
  width: 100%;
}
</style>
