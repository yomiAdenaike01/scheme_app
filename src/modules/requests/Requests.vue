<template>
  <!-- NEED TO CHANGE CONTENT OF REQUEST -->
  <div class="requests_container">
    <div class="requests_list">
      <div
        v-if="filteredRequests.length > 0"
        class="requests_list_subcontainer"
      >
        <!-- Filters -->
        <div class="filters_container">
          <h3 class="grey">Filters</h3>
          <input
            v-model="filters.request_id"
            class="s_input no_border_radius"
            placeholder="Search request id"
          />

          <input
            v-model="filters.label"
            class="s_input no_border_radius"
            placeholder="Search request type"
          />
          <select
            v-model="filters.status"
            class="s_input no_border_radius capitalize"
          >
            <option value="">Filter request status</option>
            <option
              v-for="(option, index) in statusOptions"
              :key="index"
              :value="option"
              >{{ makePretty(option) }}</option
            >
          </select>
          <select
            v-model="filters.requested_by"
            class="s_input no_border_radius capitalize"
          >
            <option value="">Filter requested by</option>
            <option
              v-for="(option, index) in team"
              :key="index"
              :value="option._id"
              >{{ makePretty(option.name) }}</option
            >
          </select>
        </div>
        <!-- Active filters -->
        <fade-transition group tag="div" class="active_filters_container">
          <div v-for="(value, key) in filters" :key="key">
            <div v-if="value.length > 0" class="filter_unit capitalize">
              <small>{{
                filtersXref.hasOwnProperty(key) ? filtersXref[key]() : value
              }}</small>
              <i class="bx bx-x-circle trigger" @click="filters[key] = ''"></i>
            </div>
          </div>
        </fade-transition>
        <!-- Requests -->
        <slide-x-left-transition group>
          <Request
            v-for="(request, index) in filteredRequests"
            :key="request._id"
            :request="request"
            :index="index"
            :selected="selectedRequest"
            :user="userInformation._id"
            @setRequest="setSelectedRequest"
          />
        </slide-x-left-transition>
      </div>
      <div v-else class="text_container grey all_centre">
        <h1>No requests</h1>
      </div>
    </div>
    <div class="viewing_request">
      <div
        v-if="Object.keys(selectedRequest).length > 0"
        class="viewing_request_subcontainer"
      >
        <!-- Header -->
        <header>
          <h1 class="capitalize">{{ selectedRequest.type.label }}</h1>
          <s-button
            v-if="selectedRequest.status == 'approved' && adminPermission"
            class="plain"
            @click="handleApprove"
            >Create event</s-button
          >
          <i
            v-if="
              adminPermission ||
                selectedRequest.requested_by._id == userInformation._id
            "
            class="bx grey bx-x trigger"
            @click="deleteRequest"
          ></i>
        </header>
        <!-- Timeline -->
        <div class="timeline_wrapper">
          <div class="timeline">
            <div
              v-for="(status, index) in statusOptions"
              :key="`${status}${index}`"
              :class="[
                'time_unit capitalize',

                {
                  rejected:
                    selectedRequest.status == 'rejected' &&
                    status == 'rejected',
                  approved:
                    selectedRequest.status == 'approved' &&
                    status == 'approved',
                  completed:
                    statusOptions.indexOf(selectedRequest.status) > index,
                  active: selectedRequest.status == status
                }
              ]"
            >
              <i
                v-if="statusOptions.indexOf(selectedRequest.status) > index"
                class="bx bx-check"
              ></i>

              <p v-else>{{ status }}</p>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="details_grid">
          <div
            v-for="(value, key) in viewDataXref"
            :key="key"
            class="details_item col"
          >
            <h2 class="grey capitalize">{{ makePretty(key) }}</h2>
            <span>{{ viewDataXref[key](selectedRequest[key]) }}</span>
          </div>
        </div>

        <div class="details_item">
          <h2 class="grey">Notes</h2>
          <textarea
            v-model="selectedRequest.notes"
            :disabled="!hasAccess"
            class="s_input"
          ></textarea>
        </div>

        <!-- Actions -->
        <div v-if="!displayActions" class="actions_wrapper">
          <p
            v-for="(action, index) in actionOptions"
            :key="index"
            :class="[`action_item capitalize ${action.buttonLabel}`]"
            @click="action.body"
          >
            {{ action.buttonLabel }}
          </p>
        </div>
      </div>
      <div v-else class="grey text_container all_centre">
        <i class="bx bx-pointer large_icon"></i>
        <br />
        <h1>Select a request to display...</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import SButton from "@/components/SButton";
import Request from "./components/Request";
import { SlideXLeftTransition, FadeTransition } from "vue2-transitions";
import cleanObject from "@/mixins/cleanObject";
export default {
  name: "Requests",
  components: {
    SButton,
    SlideXLeftTransition,
    FadeTransition,
    Request
  },
  mixins: [cleanObject],

  data() {
    return {
      selectedRequest: {},
      filters: {
        label: "",
        date_created: "",
        status: "",
        requested_by: "",
        request_id: ""
      }
    };
  },

  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Requests", ["requests"]),
    ...mapState("Team", ["team"]),

    ...mapGetters(["adminPermission"]),
    ...mapGetters("Team", ["userLookup"]),
    displayActions() {
      let ignore = ["approved", "rejected"];
      let { status } = this.selectedRequest;

      return ignore.indexOf(status) > -1;
    },

    hasAccess() {
      return (
        this.selectedRequest.requested_by._id == this.userInformation._id ||
        this.adminPermission
      );
    },

    filtersXref() {
      return {
        requested_by: () => {
          return this.userLookup(this.filters.requested_by)?.name;
        }
      };
    },

    actionOptions() {
      let actionOptions = [];
      // If not admin and not assigned to you

      if (this.adminPermission) {
        actionOptions = ["rejected", "approved"];
      }

      let buttonLabelXref = {
        rejected: "reject",
        approved: "approve"
      };
      let actions = [];
      let actionClass = null,
        actionIcon = null;

      for (let i = 0, len = actionOptions.length; i < len; i++) {
        let actionLabel = actionOptions[i];

        switch (actionLabel) {
          case "rejected": {
            actionClass = "tertiary";
            actionIcon = "x";
            break;
          }
          case "approved": {
            actionClass = "secondary";
            actionIcon = "check";
            break;
          }

          default:
            break;
        }

        actions.push({
          status: actionLabel,
          class: actionClass,
          icon: actionIcon,
          buttonLabel: buttonLabelXref[actionLabel],
          body: () => {
            this.updateRequest({ status: actionLabel });
          }
        });
      }

      return actions;
    },
    viewDataXref() {
      let dateChange = val => {
        return this.formatDate(val);
      };

      return {
        assigned_to: val => {
          return val
            .map(x => {
              return x.name;
            })
            .join(",");
        },
        start_date: dateChange,
        end_date: dateChange,
        requested_by: val => {
          return val.name;
        }
      };
    },
    statusOptions() {
      let statusOptions = ["sent", "seen", "approved", "rejected"];
      if (this.selectedRequest?.status == "approved") {
        statusOptions.pop();
      }
      if (this.selectedRequest?.status == "rejected") {
        statusOptions.splice(2, 1);
      }
      return statusOptions;
    },
    leanAssignedTo() {
      return this.selectedRequest.assigned_to.map(assignee => {
        return assignee._id;
      });
    },

    filteredRequests() {
      let filteredRequests = [];
      let filterLabel = this.filters.label.toLowerCase();
      let filterStatus = this.filters.status.toLowerCase();
      let filterRequestedBy = this.filters.requested_by;

      let requests = [...this.requests];
      for (let i = 0, len = requests.length; i < len; i++) {
        let request = requests[i];
        if (!filterLabel.includes(request?.type?.label.toLowerCase())) {
          continue;
        }
        if (filterRequestedBy != request?.requested_by?._id) {
          continue;
        }

        if (!filterStatus.includes(request?.status?.toLowerCase())) {
          continue;
        }

        filteredRequests.push(request);
      }

      return filteredRequests.length > 0 ? filteredRequests : requests;
    }
  },

  watch: {
    propFilters: {
      immediate: true,
      deep: true,
      handler(val) {
        this.assignFilters(val);
      }
    },
    filteredRequests: {
      deep: true,
      handler(val) {
        this.initRequests(val);
      }
    }
  },

  created() {
    this.initRequests(this.filteredRequests);
  },
  activated() {
    this.handleRouting();
  },
  destroyed() {
    this.selectedRequest = {};
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Events", [
      "CREATE_EVENT_REQUEST",
      "UPDATE_EVENT_REQUEST",
      "DELETE_EVENT_REQUEST"
    ]),
    handleRouting() {
      let params = this.$route.params;
      if (params) {
        this.assignFilters(params);
      }
    },
    initRequests(requests) {
      let hasSelected = Object.keys(this.selectedRequest).length > 0;

      if (requests.length > 0) {
        if (!hasSelected) {
          this.setSelectedRequest({ request: requests[0], index: 0 });
        } else {
          let selectedIndex = requests.findIndex(request => {
            return request._id == this.selectedRequest._id;
          });
          if (selectedIndex > -1) {
            this.setSelectedRequest({
              request: requests[selectedIndex],
              index: selectedIndex
            });
          }
        }
      } else {
        if (hasSelected) {
          this.selectedRequest = {};
        }
      }
    },

    assignFilters(val = this.propFilters) {
      if (Object.keys(val).length > 0 && this.filteredRequests.length > 0) {
        for (let property in val) {
          if (
            property != "assigned_to" &&
            val[property] != this.userInformation._id
          ) {
            this.filters[property] = val[property];
          }
        }
      }
    },
    clearFilters() {
      for (let property in this.filters) {
        this.filters[property] = "";
      }
    },
    setSelectedRequest({ request, index }) {
      // If status is sent update to seen
      if (request?.status == "sent" && this.adminPermission) {
        this.updateRequest({ status: "seen" });
      }
      this.selectedRequest = Object.assign({}, this.selectedRequest, request, {
        index
      });
    },
    async deleteRequest() {
      try {
        this.DELETE_EVENT_REQUEST(this.selectedRequest.index);

        //  API request
        let apiPayload = {
          method: "DELETE",
          url: "requests/delete",
          data: {
            _id: this.selectedRequest._id
          }
        };
        await this.request(apiPayload);
        this.selectedRequest = {};
      } catch (error) {
        return Promise.reject(error);
      }
    },

    handleApprove() {
      let formPayload = {
        assigned_to: [this.selectedRequest.requested_by._id],
        type: this.selectedRequest.type._id,
        dates: [this.selectedRequest.start_date, this.selectedRequest.end_date]
      };

      this.$router.push({
        name: "events",
        params: {
          createEvent: {
            params: formPayload
          }
        }
      });
    },
    updateMessageXref(update) {
      let string = `Your request ${this.selectedRequest.type.label} has been `;
      for (let property in update) {
        string += update[property];
      }
      return string;
    },

    async updateRequest(update) {
      try {
        // Check if clicked approve
        if (update?.status == "approved" && this.adminPermission) {
          this.handleApprove();
        }

        this.selectedRequest = Object.assign({}, this.selectedRequest, update);

        this.UPDATE_EVENT_REQUEST({
          update,
          index: this.selectedRequest.index
        });

        //  API request
        update.message = this.updateMessageXref(update);
        const apiPayload = {
          method: "PUT",
          url: "requests/update",
          data: {
            _id: this.selectedRequest._id,
            requested_by: this.selectedRequest.requested_by._id,
            update,
            assigned_to: this.leanAssignedTo
          }
        };
        await this.request(apiPayload);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.requests_container {
  display: flex;
  height: 100%;
  flex: 1;
}
.requests_list {
  flex: 0.6;
}
.viewing_request {
  display: flex;
  flex: 1;
}
.requests_list,
.viewing_request {
  display: flex;
  background: white;
  margin: 10px;
  border: $border;
}
.viewing_request_subcontainer {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  position: relative;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.filters_container {
  margin: 10px;
  border-bottom: $border;
  h3 {
    margin: 10px 0;
  }
  select {
    margin-top: 10px;
  }
}
.active_filters_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.filter_unit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  max-width: fit-content;
  white-space: nowrap;
  color: white;
  background: rgba(var(--colour_primary), 0.9);
  margin: 10px;
  border-radius: 20px;
  .bx {
    margin-left: 10px;
  }
}
.requests_list_subcontainer {
  overflow-x: hidden;
  height: 100%;
  flex: 1;
}

header {
  border-bottom: $border;
  padding: 10px;
}
.details_grid {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.details_item {
  display: flex;

  border-right: $border;
  border-bottom: $border;
  border-top: $border;

  flex-direction: column;
  flex: 1;
  padding: 2%;
  &.col {
    justify-content: center;
    align-items: center;
  }
}
.actions_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
$actionitems: (
  approve: var(--success),
  reject: var(--danger)
);

.action_item {
  text-align: center;
  flex: 1;
  font-weight: bold;
  margin: 0;
  padding: 20px 0;
  cursor: pointer;
  transition: $default_transition;
  @each $key, $value in $actionitems {
    &.#{$key} {
      background: rgba($value, 0.03);
      color: rgba($value, 1);
      &:hover {
        background: rgba($value, 0.1);
      }
    }
  }
}
.timeline_wrapper {
  padding: 20px;
}
.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &::after {
    position: absolute;
    content: "";
    right: 0;
    top: 50%;
    bottom: 40%;
    left: 0;
    background: rgb(250, 250, 250);
  }
}
.time_unit {
  border-radius: 50%;
  border: $border;
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 2;
  &.active {
    border: 2px solid rgba(var(--colour_primary), 1);
    color: rgba(var(--colour_primary), 1);
    font-weight: bold;
  }
  &.completed {
    color: rgba(var(--success), 1);
    border: 2px solid rgba(var(--success), 1);
  }
  &.rejected {
    color: rgba(var(--danger), 1);
    border: 2px solid rgba(var(--danger), 1);
  }
  &.approved {
    color: rgba(var(--success), 1);
    border: 2px solid rgba(var(--success), 1);
  }
}
</style>
