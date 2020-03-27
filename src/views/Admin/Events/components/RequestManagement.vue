<template>
  <div v-loading="loading" class="request_management">
    <InformationDisplay
      v-if="requests.length == 0"
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
      <Request
        v-for="request in requests"
        :key="request._id"
        :request="request"
        @updateRequest="updateRequest"
        @deleteRequest="deleteRequest"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import InformationDisplay from "@/components/InformationDisplay";
import Request from "./Request";

export default {
  name: "RequestManagement",
  components: {
    InformationDisplay,
    Request
  },
  props: {
    userID: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      displayDetails: false,
      localRequests: [],
      loading: false,
      currentRequestInfo: {}
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
    ...mapState("Admin", ["requestsInformation"]),

    requests() {
      return this.localRequests.length > 0
        ? this.localRequests
        : this.requestsInformation;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["getRequests"]),
    updateRequest({ update, _id }) {
      this.loading = true;
      this.request({
        method: "PUT",
        data: {
          update,
          _id
        },
        url: "events/request/update"
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteRequest(requestID) {
      this.loading = true;
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
  height: 100%;
}

.request_management_inner_wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 60%;
  overflow-x: hidden;
}
</style>
