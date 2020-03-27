<template>
  <div class="request_container">
    <div class="request_details_wrapper">
      <div v-for="(value, key) in request" :key="key">
        <p v-if="keyXref[key] && keyXref[key].display(value)">
          {{ keyXref[key].label }}
          <span v-html="keyXref[key].value(value)"></span>
        </p>
      </div>
    </div>
    <div
      v-if="request.requestedBy == userInformation._id || getIsAdmin"
      class="buttons_container"
    >
      <Popover trigger="click">
        <el-button slot="trigger" size="mini" round>Update Request</el-button>
        <Form
          slot="content"
          submit-text="Update request"
          size="mini"
          :config="requestUpdateConfig"
          @val="$emit('updateRequest', { update: $event, _id: request._id })"
        />
      </Popover>
      <el-button
        plain
        type="danger"
        size="mini"
        round
        @click="$emit('deleteRequest', request._id)"
        >Delete Request</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Popover from "@/components/Popover";
import Form from "@/components/Form";

export default {
  name: "Request",
  components: {
    Form,
    Popover
  },
  props: {
    request: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(["userInformation"]),

    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", [
      "getGroupName",
      "getEnabledEvents",
      "getUserInformation"
    ]),
    requestUpdateConfig() {
      // Change the date
      // Add notes
      let config = [
        {
          "component-type": "date-picker",
          "input-type": "date-time-range",
          placeholder: "Timings",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          model: "date",
          optional: true
        },
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getEnabledEvents,
          model: "type",
          validType: "number",
          optional: true
        },
        {
          "component-type": "text",
          "input-type": "textarea",
          placeholder: "Notes",
          model: "notes",
          optional: true
        }
      ];

      return config;
    },
    keyXref() {
      const self = this;
      return {
        type: {
          label: "",
          display() {
            return true;
          },
          value(params) {
            return `<h2>${self.getGroupName("eventGroup", params)?.name}</h2>`;
          }
        },
        requestedBy: {
          label: "Requested by :",

          display() {
            return self.getIsAdmin;
          },
          value(params) {
            return self.getUserInformation(params)?.name;
          }
        },
        startDate: {
          label: "Start Date :",
          display() {
            return true;
          },
          value(params) {
            return self.formatDate(params);
          }
        },
        endDate: {
          label: "End Date :",
          display() {
            return true;
          },
          value(params) {
            return self.formatDate(params);
          }
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.request_container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin: 10px;
  padding: 25px;
  border: $border;
  text-transform: capitalize;
  line-height: 1.3em;
}

.request_details_wrapper {
  display: block;
  & > * {
    margin-bottom: 10px;
  }
}
.buttons_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &/deep/ > * {
    margin: 0 5px;
  }
}
</style>
