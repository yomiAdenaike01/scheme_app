<template>
  <Overlay v-model="view" backdrop-type="dark">
    <Tabs
      v-model="currentTab"
      v-loading="loading"
      :tabs="tabs"
      :disable="currentTab > 1"
      :selected-tab="currentTab"
      :submit-text="tabXref.display"
      @val="eventsCtrl"
      @formChange="events = $event"
    >
      <div slot="header" class="text_container all_centre">
        <h2>{{ informationDisplay.heading }}</h2>
        <p>{{ informationDisplay.content }}</p>
      </div>
      <div
        v-if="
          tabXref.name == 'create_event' &&
            hasEntries(events) &&
            qrCode.length > 0 &&
            getIsAdmin
        "
        slot="body"
        class="body_container"
      >
        <div class="qr_container">
          <qrcode-vue :value="qrCode" />
        </div>
        <p>
          This is QR code for users to clock in with
        </p>
      </div>
    </Tabs>
  </Overlay>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import QrcodeVue from "qrcode.vue";

import Overlay from "@/components/Overlay";
export default {
  name: "EventsOverlay",
  components: {
    Tabs: () => import("@/components/Tabs"),
    ColourPicker: () => import("@/components/ColourPicker"),
    QrcodeVue,
    Overlay
  },
  props: {
    display: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      events: {},
      templates: {},
      loading: false,
      currentTab: 0,
      qrCode: ""
    };
  },

  computed: {
    ...mapState(["clientInformation", "daysOfWeek", "userInformation"]),
    ...mapGetters([
      "getValidEventTypes",
      "getUserGroups",
      "getUsersInGroup",
      "getIsAdmin",
      "getCurrentTabXref"
    ]),

    ...mapGetters("Team", ["getDropdownTeamMembers", "userLookup"]),
    headings() {
      return {
        assigned_to: "<h3>Assign team members</h3>",
        until:
          "<h3>Timings & Templating</h3> <small class='grey'>The content of this will be saved as a template, once saved as a template it can be reused with the timings that are entered below</small>"
      };
    },
    eventContent() {
      // this.loading = true;
      let events = { ...this.events };
      let date = events?.date;

      let start_date = this.initMoment(date[0]).toISOString();
      let end_date = this.initMoment(date[1]).toISOString();
      events.start_date = start_date;
      events.end_date = end_date;
      events.until = this.initMoment(events?.until ?? new Date()).toISOString();

      if (this.activeDialogInformation?.length > 0) {
        events.assigned_to = events.assigned_to.concat(
          this.activeDialogInformation
        );
      }

      events.is_approved = [
        this.userInformation._id,
        ...events.assigned_to.filter(assignee => {
          return (
            this.userLookup(assignee)?.user_group?.enable_event_rejection ==
            true
          );
        })
      ];

      events = {
        ...events,
        repeat: {
          until: events.until,
          weekdays: events?.weekdays ?? 0
        }
      };

      if (!this.getIsAdmin) {
        events.assigned_to = [this.userInformation._id];
      }
      let templates = {
        content: events
      };

      if (events?.user_groups?.length > 0) {
        // Changed the assigned to to all of the user groups
        let uGroups = events.user_groups;
        events.assigned_to = [];

        for (let i = 0, len = uGroups.length; i < len; i++) {
          events.assigned_to.push(...this.getUsersInGroup(uGroups[i]));
        }
      }
      return { templates, events };
    },

    informationDisplay() {
      let content =
          "You can create a request here that will be sent to an admin for approval",
        heading = "Request Management";
      if (this.getIsAdmin) {
        heading = "Event Management";
        content =
          "As an admin you can create templates to batch create events. You can also create event groups and singular events.";
      }
      return {
        heading,
        content
      };
    },

    isNotShiftOrHoliday() {
      return !this.getIsAdmin && this.events.type > 3;
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
          displayReset: true,
          emitOnChange: true,
          headings: this.headings
        }
      ];

      if (this.getIsAdmin) {
        tabs.unshift({
          label: "Manage event groups",
          view: {
            component: () => import("@/components/UpdateGroups")
          }
        });
      }

      return tabs;
    },

    createEventForm() {
      let createEventConfig = [
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getValidEventTypes,
          model: "type",
          noLabel: true
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time-range",
          placeholder: "Timings",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          model: "date",
          noLabel: true
        }
      ];

      // Check if it is an admin or not

      if (this.getIsAdmin) {
        createEventConfig.unshift(
          {
            placeholder: "Select team members",
            disabled: this.events?.user_groups?.length > 0,
            "component-type": "select",
            model: "assigned_to",
            options: this.getDropdownTeamMembers,
            multiple: true,
            optional: true,
            noLabel: true
          },
          {
            "component-type": "select",
            options: this.getUserGroups,
            disabled: this.events?.assigned_to?.length > 0,
            multiple: true,
            model: "user_groups",
            placeholder: "Assign to a user group",
            optional: true,
            noLabel: true
          },
          {
            "component-type": "select",
            placeholder: "Repeat for (days of week)",
            options: this.daysOfWeek,
            multiple: true,
            model: "weekdays",
            optional: true,
            noLabel: true
          },
          // Assign to an event group,

          {
            "component-type": "date-picker",
            "input-type": "date-time",
            placeholder: "Repeat until",
            model: "until",
            optional: true,
            noLabel: true
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
      set() {
        this.$emit("close");
      }
    }
  },
  methods: {
    ...mapActions(["request", "closeOverlay", "genPromptBox"]),
    ...mapActions("Events", ["createEvent", "createEventTemplate"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),

    eventsCtrl(information) {
      this.events = information;

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
      let eventInfo = this.eventContent.events;
      let requestInformation = {
        type: this.eventContent.events.type,
        end_date: eventInfo.end_date,
        start_date: eventInfo.start_date
      };

      this.request({
        method: "POST",
        url: "events/requests/create",
        data: requestInformation
      });
    },
    // Submit one event
    genEvent() {
      this.createEvent(this.eventContent.events)
        .then(response => {
          this.qrCode = response ? response : "";
          if (this.getIsAdmin) {
            this.initSaveTemplate();
          } else {
            this.view = false;
          }
        })
        .catch(() => {});
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
          this.view = false;
        })
        .catch(() => {
          this.view = false;
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
      let events = {
        ...this.events,
        value: this.clientInformation.event_groups.length + 1
      };
      this.request({
        method: "POST",
        url: "clients/group",
        data: { name: "event_groups", value: events }
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
.create_event_group_container {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.colour_unit_label {
  margin-left: 10px;
}
.body_container {
  display: flex;
  justify-content: center;
}
.qr_container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  flex-direction: column;
  border: $border;
  max-height: fit-content;
}
</style>
