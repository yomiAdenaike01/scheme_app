<template>
  <el-dialog custom-class="event_dialog" :visible.sync="view">
    <Tabs
      v-loading="loading"
      :tabs="tabs"
      @val="eventsCtrl"
      :disable="currentTab > 1"
      v-model="currentTab"
      :selectedTab="currentTab"
      :submitText="tabXref.display"
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
          v-if="tabXref.name == 'create_event_group' && getIsAdmin"
        >
          <ColourUnit v-model="eventsInformation.colour" />
          <p class="mb-3 ml-4 desc grey">Press to select an event colour (optional):</p>
        </div>
      </div>
    </Tabs>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

import EventTemplate from "./EventTemplate";
import EventOptions from "./EventOptions";

import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
import MoreInformation from "@/components/MoreInformation";
import ColourUnit from "@/components/ColourUnit";

export default {
  name: "EventModuleDialog",
  data() {
    return {
      eventsInformation: {},
      templatesInformation: {},
      loading: false,
      currentTab: 0
    };
  },
  components: {
    Title,
    Tabs,
    ColourUnit
  },
  computed: {
    ...mapState(["clientInformation", "daysOfWeek"]),

    ...mapGetters(["getIsAdmin", "getActiveDialog", "getCurrentTabXref"]),
    ...mapGetters("Admin", [
      "getDropdownTeamMembers",
      "getEnabledEvents",
      "getUserGroups"
    ]),

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
          options: this.getUserGroups,
          placeholder: "Enable for user group",
          model: "enabledFor",
          multiple: true,
          optional: true
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
        },

        {
          "component-type": "select",
          placeholder: "Repeat for (days of week)",
          options: this.daysOfWeek,
          multiple: true,
          model: "weekdays",
          optional: true
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "Repeat until",
          model: "until",
          optional: true
        }
      ];

      // Check if it is an admin or not

      if (this.getIsAdmin) {
        createEventConfig.unshift({
          placeholder: "Select Team Member",
          "component-type": "select",
          model: "assignedTo",
          options: this.getDropdownTeamMembers,
          multiple: true
        });
      }

      return createEventConfig;
    },
    //  control the current view
    view: {
      get() {
        return this.getActiveDialog("eventModule");
      },
      set(toggle) {
        this.closeDialog("eventModule");
      }
    }
  },
  methods: {
    ...mapActions(["request", "closeDialog", "genPromptBox"]),
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

        default:
          break;
      }
    },
    // Submit one event
    genEvent() {
      this.loading = true;
      let { date } = this.eventsInformation;

      let startDate = this.initMoment(date[0]).toISOString();
      let endDate = this.initMoment(date[1]).toISOString();
      this.eventsInformation.startDate = startDate;
      this.eventsInformation.endDate = endDate;
      this.eventsInformation.until = this.initMoment(
        this.eventsInformation.until
      ).toISOString();
      this.eventsInformation = {
        ...this.eventsInformation,
        repeat: {
          until: this.eventsInformation.until,
          weekdays: this.eventsInformation.weekdays
        }
      };
      this.templatesInformation = {
        content: {
          ...this.eventsInformation
        }
      };

      this.createEvent(this.eventsInformation)
        .then(response => {
          this.loading = false;
          this.view = false;
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
        .then(({ value }) => {
          this.resolveSaveTemplate(value);
        })
        .catch(err => {
          return err;
        });
    },
    resolveSaveTemplate(value) {
      this.templatesInformation.name = value;
      // If there is an error reinitiate the create template
      this.createEventTemplate(this.templatesInformation).catch(err => {
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
        .then(response => {
          this.loading = false;
          this.view = false;
        })
        .catch(err => {
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
