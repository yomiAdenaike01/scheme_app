<template>
  <Overlay v-model="view">
    <Menu
      mode="tabs"
      :tab-items="tabItems"
      :active-tab="selectedTab"
      @changeTab="selectedTab = $event"
    />

    <Form
      v-if="displayForEvents"
      v-model="formData"
      :config="config"
      :validations="validations"
      reset-on-submit
      :headings="{
        assigned_to: '<strong>Assigned to</strong>'
      }"
      :submit-button="{ text: makePretty(selectedTab) }"
      @val="handler"
    >
      <div v-if="displayForEvents" slot="header">
        <!-- Templates -->

        <div
          class="display_filters_container trigger"
          @click="displayTemplates = !displayTemplates"
        >
          <strong> View templates ({{ filteredTemplates.length }})</strong>
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
              class="s_input filter_input"
              placeholder="Search templates"
            />

            <!-- Each template -->
            <EventTemplate
              v-for="(template, index) in filteredTemplates"
              :key="index"
              :template="template"
              :index="index"
              @useTemplate="populateForm"
              @updateTemplate="updateTemplate"
              @deleteTemplate="deleteTemplate"
            />
          </div>
        </collapse-transition>

        <!-- QR Code -->
        <div v-if="newEventID.length > 0" class="qr_container">
          <qrcode-vue :value="newEventID" level="H"></qrcode-vue>

          <p class="grey">
            Scan this code with the companion app to clock in.
          </p>
        </div>
      </div>
    </Form>

    <UpdateGroups
      v-if="selectedTab == 'manage_groups'"
      group-type="event_groups"
    />
  </Overlay>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import { CollapseTransition } from "vue2-transitions";
import QrcodeVue from "qrcode.vue";
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
    EventTemplate,
    QrcodeVue
  },
  mixins: [genID, cleanObject],
  props: {
    display: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectedTab: "",
      formData: {},
      searchTemplates: "",
      displayTemplates: false,
      newEventID: "",
      populated: false
    };
  },
  computed: {
    ...mapState(["clientInformation", "userInformation"]),
    ...mapState("Team", ["team"]),
    ...mapState("Events", ["events", "eventTemplates"]),
    ...mapState("Requests", ["requests"]),
    ...mapGetters(["adminPermission", "groupLookup"]),
    ...mapGetters("Team", ["userLookup", "admins"]),

    displayForEvents() {
      return ["create_event", "create_request"].indexOf(this.selectedTab) > -1;
    },

    validations() {
      let validations = {
        [this.adminPermission]: ["assigned_to", "dates", "type"],
        [!this.adminPermission]: ["dates", "type"]
      };
      return validations[true];
    },
    tabItems() {
      let tabItems = {
        [this.adminPermission]: ["create_event", "manage_groups"],
        [!this.adminPermission]: ["create_request"]
      };

      return tabItems[true];
    },
    filteredTemplates() {
      let templates = [];
      let eventTemplates = [...this.eventTemplates];

      let searchTerm = this.searchTemplates.toLowerCase();

      for (let i = 0, len = eventTemplates.length; i < len; i++) {
        let template = eventTemplates[i];

        if (!template.name.toLowerCase().includes(searchTerm)) {
          continue;
        }
        templates.push(template);
      }

      return templates.length > 0 ? templates : eventTemplates;
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
        options: this.clientInformation.event_groups,
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
      form[true].unshift(dateTimeFormItem, eventTypeFormItem);
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
      let excludeProperties = ["is_approved", "assigned_to"];
      // Get admins for assigned to request
      let admins = {
        request: this.admins(false),
        mutation: this.admins(true)
      };

      let mutation = Object.assign(
        this.cleanObject(excludeProperties, this.eventPayload.mutation),
        {
          _id: this.genID(),
          assigned_to: admins.mutation,
          requested_by: this.userInformation,
          date_created: new Date().toISOString(),
          status: "sent"
        }
      );

      let request = Object.assign(
        this.cleanObject(excludeProperties, this.eventPayload.request),
        {
          assigned_to: admins.request
        }
      );

      return {
        request,
        mutation
      };
    },
    localData() {
      return {
        date_created: new Date().toISOString(),
        _id: this.genID(),
        assigned_to: this.formData?.assigned_to?.map(assignee => {
          return this.userLookup(assignee);
        }),
        type: this.groupLookup("event", this.formData.type)
      };
    },

    eventPayload() {
      const isApproved = (populate = false) => {
        let approved = [];
        let assignedTo = this.formData?.assigned_to;

        if (assignedTo) {
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
        }
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
  created() {
    this.selectedTab = this.tabItems[0];

    if (Object.keys(this.params).length > 0) {
      this.populateForm(this.params);
    }
  },

  methods: {
    ...mapActions(["request", "genPromptBox", "notify"]),
    ...mapMutations(["CREATE_SYSTEM_NOTIFICATION"]),
    ...mapMutations("Events", [
      "CREATE_EVENT",
      "DELETE_EVENT",
      "UPDATE_EVENT",
      "DELETE_EVENT_TEMPLATE",
      "CREATE_EVENT_TEMPLATE",
      "UPDATE_EVENT_TEMPLATE"
    ]),
    ...mapMutations("Requests", [
      "DELETE_REQUEST",
      "CREATE_REQUEST",
      "UPDATE_REQUEST"
    ]),

    closeOverlay() {
      this.view = false;
    },

    populateForm(data) {
      let notifyXref = {
        [!this.adminPermission]: {
          title: "Request form populated",
          type: "request",
          label: "Create request"
        },
        [this.adminPermission]: {
          title: "Event form populated",
          type: "event",
          label: "Create event"
        }
      };

      let notificationContent = notifyXref[true];

      if (!this.populated) {
        this.selectedTab = this.tabItems[0];
        if (data?.start_date || data?.end_date) {
          data = this.cleanObject(["start_date", "end_date"], data);
        }
        this.formData = data;

        if (this.displayTemplates) {
          this.displayTemplates = false;
        }

        this.CREATE_SYSTEM_NOTIFICATION({
          title: notificationContent.title,
          message: "Your form has been auto populated",
          type: notificationContent.type,
          methods: [
            {
              label: notificationContent.label,
              body: this.createEvent
            }
          ]
        });
        this.populated = true;
      }
    },
    // Create notification for assigned users
    async handleNotify() {
      try {
        this.notify({
          for: this.formData.assigned_to,
          message: `You have been assigned to a ${this.localData.type.label} event`,
          payload: { event_id: this.newEventID },
          sent_from: this.userInformation._id,
          type: "event"
        });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async createEvent() {
      try {
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

        // Create the qr code the event
        if (apiResponse) {
          this.newEventID = apiResponse._id;
          this.UPDATE_EVENT({ payload: apiResponse });
        }
        // Create notification for the assignees
        this.handleNotify();
        // Create template
        await this.createTemplate(localPayload, apiPayload);
      } catch (e) {
        this.DELETE_EVENT();
        console.error(e);
      }
    },
    async createTemplate(eventPayload, apiEventPayload) {
      try {
        // Use the event content to create a template
        let boxPayload = {
          boxType: "prompt",
          title: "Create template",
          text:
            "Would you like to save this event as a template, If so enter the name of the template below ?",
          inputPlaceholder: "Template name"
        };

        let defaultName = `template_${new Date().toISOString()}`;
        let owners = [this.userInformation];

        let { value } = await this.genPromptBox(boxPayload);

        if (value) {
          let localTemplatePayload = {
            content: eventPayload,
            owners,
            name: value ? value : defaultName,
            _id: this.localData._id
          };

          localTemplatePayload.content.assigned_to =
            apiEventPayload.data.assigned_to;

          this.CREATE_EVENT_TEMPLATE(localTemplatePayload);

          // Create api template

          let apiTemplateData = {
            owners: [this.userInformation._id],
            name: localTemplatePayload.name,
            content: this.cleanObject(
              ["notes", "is_approved"],
              apiEventPayload.data
            )
          };

          let apiTemplatePayload = {
            data: apiTemplateData,
            method: "POST",
            url: "events/templates/create"
          };

          let apiResponse = await this.request(apiTemplatePayload);

          if (apiResponse) {
            // Update local template
            this.UPDATE_EVENT_TEMPLATE({
              index: this.eventTemplates.length - 1,
              data: apiResponse
            });
          }
        }
      } catch (error) {
        // Delete local template
        this.DELETE_EVENT_TEMPLATE();
        console.error(error);
      }
    },

    async createRequest() {
      try {
        let { request, mutation } = this.requestPayload;
        // Create local request

        this.CREATE_REQUEST(mutation);

        // Create api request
        let apiRequstPayload = {
          data: request,
          url: "requests/create",
          method: "POST"
        };
        let apiResponse = await this.request(apiRequstPayload);

        if (apiResponse) {
          this.UPDATE_REQUEST({
            index: this.requests.length - 1,
            ...apiResponse
          });
        }
        // Create request notifications
        let user = this.userInformation;
        this.notify({
          message: `${
            user.name
          } has created a ${this.localData.type.label.toLowerCase()} request`,
          for: this.admins(false),
          payload: {
            request_id: apiResponse._id
          },
          type: "request"
        });
        // Go to requests
        this.CREATE_SYSTEM_NOTIFICATION({
          title: "Request created",
          message:
            "Your request has been sent and will be updated in real-time.",
          methods: [
            {
              label: "View request",
              body: () => {
                // Close overlay and go to requests with params
                this.$emit("close");
                this.$router.push({
                  name: "requests",
                  params: {
                    request_id: apiResponse._id
                  }
                });
              }
            }
          ]
        });
      } catch (error) {
        this.DELETE_REQUEST();
        console.error(error);
      }
    },
    async handler() {
      try {
        if (this.adminPermission) {
          await this.createEvent();
          this.closeOverlay();
        } else {
          await this.createRequest();
          this.closeOverlay();
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // Delete template
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
        console.log(error);
      }
    },
    // Update template
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
  max-height: 350px;
  overflow: auto;
}
.filter_input {
  position: sticky;
  top: 0;
  background: white;
}
.qr_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
</style>
