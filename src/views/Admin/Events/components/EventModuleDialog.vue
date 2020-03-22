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
      @formValChange="eventInformation= $event"
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

import Title from "@/components/Title";
import Tabs from "@/components/Tabs";
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
    ...mapState(["clientInformation", "daysOfWeek",'userInformation']),
    ...mapGetters(["getIsAdmin", "getActiveDialog", "getCurrentTabXref"]),
    ...mapGetters("Admin", [
      "getDropdownTeamMembers",
      "getEnabledEvents",
      "getUserGroups",
      'getUserInformation',
      'getUsersInUserGroup'
    ]),

    assignToUsernames(){
      let usernames = '';
      if(this.activeDialogInformation?.assignedTo){
      let assignToUsernames = [...this.activeDialogInformation?.assignedTo];
      usernames =  assignToUsernames.map(assignee=>{
         return this.getUserInformation(assignee)?.name
      });

      return usernames.length > 1 ? usernames.join(",") : usernames;
      }
    },

    activeDialogInformation(){
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
          emitOnChange:true
        }
      ];
       
        if(this.getIsAdmin){
        
        tabs.unshift({
          label: "Create event group",
          formContent: this.createEventGroupForm
        });

          tabs.push( {
          label: "Manage event templates",
          view: {
            component: EventOptions
          }
        })
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
        },

      
      ];

      // Check if it is an admin or not

      if (this.getIsAdmin) {
        let teamMemberPlaceholder = this.assignToUsernames?.length > 0  ? `Select team members including (${this.assignToUsernames})` : 'Select team members';
        createEventConfig.unshift(
        {
          placeholder: teamMemberPlaceholder,
          disabled:this.eventInformation?.userGroups?.length > 0,
          "component-type": "select",
          model: "assignedTo",
          options: this.getDropdownTeamMembers,
          multiple: true
        },
           {
           "component-type":'select',
           options:this.getUserGroups,
           disabled:this.eventInformation?.assignedTo?.length > 0,
           multiple:true,
           model:'userGroups',
           placeholder:'Assign to a user group',
           optional:true
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
      // this.loading = true;
      let { date } = this.eventsInformation;

      let startDate = this.initMoment(date[0]).toISOString();
      let endDate = this.initMoment(date[1]).toISOString();
      this.eventsInformation.startDate = startDate;
      this.eventsInformation.endDate = endDate;
      this.eventsInformation.until = this.initMoment(
        this.eventsInformation?.until ?? new Date()
      ).toISOString();
      
      if(this.activeDialogInformation?.length > 0){
        this.eventsInformation.assignedTo = this.eventsInformation.assignedTo.concat(this.activeDialogInformation)
      }
      
      this.eventsInformation = {
        ...this.eventsInformation,
        repeat: {
          until: this.eventsInformation.until,
          weekdays: this.eventsInformation?.weekdays ?? 0
        }
      };
      
      if(!this.getIsAdmin){
        this.eventsInformation.assignedTo = [this.userInformation._id];
      }
      this.templatesInformation = {
        content: {
          ...this.eventsInformation
        }
      };

      if(this.eventsInformation?.userGroups){
        // Changed the assigned to to all of the user groups
        let uGroups = this.eventsInformation.userGroups;
        
        for(let i = 0, len = uGroups.length; i<len; i++){
          this.eventsInformation.assignedTo = [...this.getUsersInUserGroup(uGroups[i])];
        }
        
      }

      this.createEvent(this.eventsInformation)
        .then(response => {
          this.loading = false;
          this.view = false;
          if(this.getIsAdmin){
            this.initSaveTemplate();
          }
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
