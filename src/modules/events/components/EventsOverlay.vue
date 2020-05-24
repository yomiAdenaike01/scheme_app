<template>
  <Overlay v-model="view">
    <Menu
      mode="tabs"
      :tab-items="tabItems"
      :active-tab="selectedTab"
      @changeTab="selectedTab = $event"
    />

    <Form
      v-if="selectedTab == 'create_event'"
      v-model="formData"
      :config="config"
      :validations="['assigned_to', 'dates', 'type']"
      :headings="{
        assigned_to: '<strong>Assigned to</strong>'
      }"
      :submit-button="{ text: 'Create event' }"
      @val="handler"
    >
      <!-- Templates -->
      <div slot="header" class="templates_container">
        <div
          class="display_filters_container trigger"
          @click="displayTemplates = !displayTemplates"
        >
          <strong> View templates </strong>
          <i
            :class="`bx bx-${!displayTemplates ? 'right' : 'down'}-arrow-alt`"
          ></i>
        </div>
        <!-- Displayed filters -->

        <collapse-transition>
          <div v-if="displayTemplates" class="templates_sub_container">
            <!-- Filter templates -->
            <input
              v-model="searchTemplates"
              type="text"
              class="s_input"
              placeholder="Search templates"
            />

            <!-- Each template -->
            <EventTemplate
              v-for="(template, index) in filteredTemplates"
              :key="index"
              :template="event"
              :index="index"
              @useTemplate="createEvent"
              @updateTemplate="updateTemplate"
              @deleteTemplate="deleteTemplate"
            />
          </div>
        </collapse-transition>
      </div>
    </Form>

    <UpdateGroups v-else group-type="event_groups" />
  </Overlay>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import { CollapseTransition } from "vue2-transitions";

import Menu from "@/components/Menu";
import Overlay from "@/components/Overlay";
import genID from "@/mixins/genID";
import cleanObject from "@/mixins/cleanObject";
import EventTemplate from "./EventTemplate";

import Form from "@/components/Form";
import UpdateGroups from "@/components/UpdateGroups";

export default {
  name: "EventsOverlay",
  components: {
    Menu,
    Form,
    Overlay,
    UpdateGroups,
    CollapseTransition,
    EventTemplate
  },
  mixins: [genID, cleanObject],
  props: {
    display: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabItems: ["manage_groups", "create_event"],
      selectedTab: "manage_groups",
      formData: {},
      searchTemplates: "",
      displayTemplates: false
    };
  },
  computed: {
    ...mapState(["clientInformation", "userInformation"]),
    ...mapState("Team", ["team"]),
    ...mapState("Events", ["events", "eventRequests", "eventTemplates"]),
    ...mapGetters(["adminPermission", "groupLookup"]),
    ...mapGetters("Team", ["userLookup"]),

    filteredTemplates() {
      let templates = [];
      let searchTerm = this.searchTemplates.toLowerCase();

      for (let i = 0, len = this.eventTemplates.length; i < len; i++) {
        let template = this.eventTemplates[i];
        if (!template.name.toLowerCase().includes(searchTerm)) {
          continue;
        }
        templates.push(template);
      }

      return templates.length > 0 ? templates : this.eventTemplates;
    },

    dates() {
      return {
        start_date: new Date(this.formData?.dates[0]).toISOString(),
        end_date: new Date(this.formData?.dates[1]).toISOString()
      };
    },

    config() {
      let condition = this.adminPermission;

      let dateTimeFormItem = {
        component_type: "date-picker",
        input_type: "date-time-range",
        model: "dates",
        label: "Timings",
        start_placeholder: "Start datetime",
        end_placeholder: "End datetime"
      };

      let eventTypeFormItem = {
        label: "Event type",
        component_type: "select",
        options: this.clientInformation["event_groups"],
        model: "type"
      };

      let form = {
        [condition]: [
          {
            component_type: "select",
            model: "assigned_to",
            multiple: true,
            options: this.team,
            disabled: this.formData?.user_group?.length > 0
          }
        ],
        [!condition]: [
          {
            component_type: "textarea",
            placeholder: "Reason for request",
            model: "notes"
          }
        ]
      };
      form[true].push(dateTimeFormItem, eventTypeFormItem);
      return form[true];
    },
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("close");
      }
    },
    requestPayload() {
      let excludeProperties = ["is_approved"];

      return {
        request: this.cleanObject(excludeProperties, this.eventPayload.request),
        mutation: this.cleanObject(
          excludeProperties,
          this.eventPayload.mutation
        )
      };
    },
    localData() {
      return {
        date_created: new Date().toISOString(),
        _id: this.genID(),
        assigned_to: this.formData.assigned_to.map(assignee => {
          return this.userLookup(assignee);
        }),
        type: this.groupLookup("event", this.formData.type)
      };
    },

    eventPayload() {
      const isApproved = (populate = false) => {
        let approved = [];
        let assignedTo = this.formData.assigned_to;

        for (let i = 0, len = assignedTo.length; i < len; i++) {
          let member = assignedTo[i];
          if (!member.enable_event_rejection) {
            if (populate) {
              approved.push(this.userLookup(member));
            } else {
              approved.push(member);
            }
          }
        }
        return approved;
      };

      let { start_date, end_date } = this.dates;
      return {
        request: {
          assigned_to: this.formData.assigned_to,
          is_approved: isApproved(),
          start_date,
          end_date,
          notes: this.formData.notes,
          type: this.formData.type
        },
        mutation: {
          notes: this.formData.notes,
          is_approved: isApproved(true),
          start_date,
          end_date
        }
      };
    }
  },
  methods: {
    ...mapActions(["request", "genPromptBox"]),
    ...mapMutations("Events", [
      "CREATE_EVENT",
      "DELETE_EVENT",
      "DELETE_EVENT_TEMPLATE",
      "CREATE_EVENT_TEMPLATE"
    ]),

    async createEvent(event) {
      try {
        return console.log(event);
        let lastEventIndex = this.events.length - 1;

        let apiPayload = Object.assign(
          { data: this.eventPayload.request },
          {
            method: "POST",
            url: "events/create"
          }
        );

        let localPayload = Object.assign(this.localData, this.dates);

        this.CREATE_EVENT(localPayload);

        let apiResponse = await this.request(apiPayload);

        if (apiResponse) {
          apiResponse = Object.assign(apiResponse, { index: lastEventIndex });

          this.UPDATE_EVENT(apiResponse);
        }

        await this.createTemplate(localPayload, apiPayload);
      } catch (e) {
        this.DELETE_EVENT();
        console.error(e);
      }
    },
    async createTemplate(eventPayload, apiPayload) {
      try {
        // Use the event content to create a template
        let boxPayload = {
          boxType: "prompt",
          title: "Create template",
          text:
            "Would you like to save this event as a template, If so enter the name of the template below ?"
        };

        let defaultName = `template_${new Date().toISOString()}`;
        let owners = [this.userInformation];

        let name = await this.genPromptBox(boxPayload)?.value;
        if (!name) {
          name = defaultName;
        }

        let localTemplatePayload = {
          content: eventPayload,
          owners,
          name
        };

        this.CREATE_EVENT_TEMPLATE(localTemplatePayload);

        // Create request to template
        let apiTemplatePayload = {
          data: this.cleanObject(["notes"], apiPayload.data),
          method: "POST",
          url: "events/templates/create"
        };

        let apiResponse = await this.request(apiTemplatePayload);

        this.UPDATE_EVENT_TEMPLATE({
          index: this.eventTemplates.length - 1,
          data: apiResponse
        });
      } catch (error) {
        this.DELETE_EVENT_TEMPLATE();
        console.error(error);
      }
    },
    async createRequest() {
      try {
        let { request, mutation } = this.requestPayload;
        // Create local request
        let localRequestPayload = Object.assign(mutation, this.dates);

        this.CREATE_REQUEST(localRequestPayload);

        // Create api request
        let apiRequstPayload = {
          data: request,
          url: "events/create/request",
          method: "POST"
        };

        let apiResponse = await this.request(apiRequstPayload);

        if (apiResponse) {
          this.UPDATE_EVENT_REQUEST({
            index: this.eventRequests.length - 1,
            payload: apiResponse
          });
        }
      } catch (error) {
        this.DELETE_EVENT_REQUEST();
        console.error(error);
      }
    },
    async handler() {
      try {
        if (this.adminPermission) {
          await this.createEvent();
        } else {
          await this.createRequest();
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async deleteTemplate({ _id, index }) {
      try {
        this.DELETE_EVENT_TEMPLATE(index);

        let apiDeleteTemplatePayload = {
          data: { _id },
          url: "events/templates/delete",
          method: "DELETE"
        };
        await this.request(apiDeleteTemplatePayload);
      } catch (error) {
        this.CREATE_EVENT_TEMPLATE(this.eventTemplateRef);
      }
    },
    async updateTemplate({ template, index }) {
      try {
        let localUpdatePayload = {
          index,
          data: template
        };

        this.UPDATE_EVENT_TEMPLATE(localUpdatePayload);

        let apiUpdatePayload = {
          method: "PUT",
          url: "events/templates/update",
          data: { _id: template._id, update: template.content }
        };

        await this.request(apiUpdatePayload);
      } catch (error) {
        this.UPDATE_EVENT_TEMPLATE(this.eventTemplateRef);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.display_filters_container {
  border-bottom: $border;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.templates_sub_container {
  padding: 10px;
}
</style>
