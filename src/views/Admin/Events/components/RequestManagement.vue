<template>
  <div v-loading="loading" class="request_management">
    <InformationDisplay
      v-if="requestsInformation.length == 0"
      class="l-3"
      :display-text="{
        heading: 'No requests found',
        content:
          'All your requests regardless of their status will appear here, to create a request please to go <strong>Create request</strong>'
      }"
    />
    <div
      v-else
      class="request_management_inner_wrapper"
      @click="displayDetails = !displayDetails"
    >
      <InformationDisplay
        :display-text="{
          tag: 'h2',
          heading: 'Your Requests',
          content: 'Feel free to delete or update your requests below'
        }"
      />
      <div v-for="request in requests" :key="request._id" class="request">
        <div class="details_wrapper">
          <h2 class="mb-4">
            {{ getGroupName("eventGroup", request.type).name }}
          </h2>

          <p v-for="(key, value) in request" :key="key">
            <span>{{ makePretty(value) }}: {{ request[value] }}</span>
          </p>
        </div>
        <div
          v-if="getIsAdmin || request.requestedBy == userInformation._id"
          class="buttons_container"
        >
          <Popover trigger="click">
            <el-button slot="trigger" size="mini" round
              >Update Request</el-button
            >
            <Form
              slot="content"
              submit-text="Update request"
              size="mini"
              :config="requestUpdateConfig"
              @val="updateRequest($event, request._id)"
            />
          </Popover>
          <el-button size="mini" round @click="deleteRequest(request._id)"
            >Delete Request</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import Popover from "@/components/Popover";
import InformationDisplay from "@/components/InformationDisplay";
import Form from "@/components/Form";

export default {
  name: "RequestManagement",
  components: {
    InformationDisplay,
    Popover,
    Form
  },
  props: {
    userID: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      displayDetails: false,
      localRequests: [],
      loading: false
    };
  },

  activated() {
    if (this.userID) {
      this.loading = true;
      this.getRequests(this.userID)
        .then(response => {
          this.localRequests = response;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["requestsInformation"]),
    ...mapGetters("Admin", ["getGroupName", "getEnabledEvents"]),
    ...mapGetters(["getIsAdmin"]),

    requests() {
      return this.localRequests.length > 0
        ? this.localRequests
        : this.requestXref;
    },

    // Create the cross referencing

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

    requestXref() {
      return [...this.requestsInformation].map(request => {
        return {
          start_date: this.formatDate(request.startDate),
          end_date: this.formatDate(request.endDate),
          date_requested: this.formatDate(request.dateCreated),
          type: request.type,
          requested_by: request.requestedBy
        };
      });
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["getRequests"]),
    updateRequest(updateInformation, requestID) {
      console.log(updateInformation, requestID);
    },
    updateAllStatus() {},
    deleteRequest(requestID) {
      this.request({
        method: "DELETE",
        url: "events/requests/delete",
        data: { _id: requestID }
      })
        .then(() => {
          this.getRequests();
        })
        .catch(() => {
          this.getRequests();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.request_management {
  display: flex;
  flex: 1;
  justify-content: center;
}
.l-3 {
  line-height: 2.9em;
}
.request_management_inner_wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
}
.details_wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.request {
  display: flex;
  flex: 1;
  margin: 10px;
  padding: 10px;
  border: $border;
  cursor: pointer;
  text-transform: capitalize;
  line-height: 1.3em;
  &:hover {
    background: $hover_grey;
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
