<template>
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
          <div
            v-for="(request, index) in filteredRequests"
            :key="request._id"
            :class="[
              `request trigger `,
              { active: selectedRequest._id == request._id }
            ]"
            @click="setSelectedRequest(request, index)"
          >
            <!-- Dates -->
            <div class="dates_container">
              <span>{{ formatDate(request.start_date, "DD-MM YYYY") }}</span>
            </div>

            <!-- Details -->
            <div :class="`details_container ${request.status}`">
              <h2 class="capitalize">{{ request.type.label }}</h2>
              <strong class="status capitalize">{{ request.status }}</strong>

              <p v-if="request.requested_by._id != userInformation._id">
                {{ request.requested_by.name }}
              </p>

              <ul>
                <li v-for="(value, key) in dateFieldsXref" :key="key">
                  <span class="capitalize">{{ makePretty(key) }}</span> :{{
                    value(request[key])
                  }}
                </li>
              </ul>
            </div>
          </div>
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
          <h3>Status timeline</h3>
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
            v-for="(value, index) in viewDataXref"
            :key="index"
            class="details_item"
          >
            <h2 class="grey capitalize">{{ makePretty(value) }}</h2>
            <span>{{ selectedRequest[value] }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions_wrapper">
          <s-button
            v-for="(action, index) in actionOptions"
            :key="index"
            :class="[`expanded capitalize ${action.class}`]"
            :icon="action.icon"
            @click="action.body()"
          >
            {{ action.buttonLabel }}
          </s-button>
        </div>
      </div>
      <div v-else class="grey text_container all_centre">
        <i class="bx bx-pointer large_icon"></i>
        <br />
        <h1>Select a request to display</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import SButton from "@/components/SButton";
import { SlideXLeftTransition, FadeTransition } from "vue2-transitions";
export default {
  name: "Requests",
  components: {
    SButton,
    SlideXLeftTransition,
    FadeTransition
  },
  data() {
    return {
      selectedRequest: {},
      filters: {
        label: "",
        date_created: "",
        status: "",
        requested_by: ""
      }
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Events", ["eventRequests"]),
    ...mapState("Team", ["team"]),

    ...mapGetters(["adminPermission"]),
    ...mapGetters("Team", ["userLookup"]),

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

        if (this.selectedRequest.status == "approved") {
          actionOptions = ["rejected"];
        }
        if (this.selectedRequest.status == "rejected") {
          actionOptions = ["approved"];
        }
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
      return ["assigned_to", "notes", "requested_by"];
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

    dateFieldsXref() {
      let dateFormat = "DD-MM YYYY";
      let body = val => {
        return this.formatDate(val, dateFormat);
      };
      let dateKeys = ["start_date", "end_date", "date_created"];
      let dateXref = {};
      for (let i = 0, len = dateKeys.length; i < len; i++) {
        dateXref[dateKeys[i]] = body;
      }
      return dateXref;
    },

    filteredRequests() {
      let filteredRequests = [];
      let filterLabel = this.filters.label.toLowerCase();
      let filterStatus = this.filters.status.toLowerCase();
      let filterRequestedBy = this.filters.requested_by;

      let requests = [...this.eventRequests];
      for (let i = 0, len = requests.length; i < len; i++) {
        let request = requests[i];
        if (!filterLabel.includes(request.type.label.toLowerCase())) {
          continue;
        }
        if (filterRequestedBy != request.requested_by._id) {
          continue;
        }

        if (!filterStatus.includes(request.status.toLowerCase())) {
          continue;
        }

        filteredRequests.push(request);
      }

      return filteredRequests.length > 0 ? filteredRequests : requests;
    }
  },

  watch: {
    filteredRequests: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          let index = 0;
          this.setSelectedRequest(val[index], index);
        }
      }
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Events", [
      "CREATE_REQUEST",
      "UPDATE_ONE_REQUEST",
      "DELETE_REQUEST"
    ]),
    clearFilters() {
      for (let property in this.filters) {
        this.filters[property] = "";
      }
    },
    setSelectedRequest(request, index) {
      let mergedObject = {
        ...request,
        index
      };

      if (request?.status == "sent") {
        this.UPDATE_ONE_REQUEST({
          ...mergedObject,
          status: "seen"
        });
        this.selectedRequest = { status: "seen", ...mergedObject };
      }

      this.selectedRequest = mergedObject;
    },
    deleteRequest() {
      this.DELETE_REQUEST(this.selectedRequest.index);
      if (this.selectedRequest.index == 0) {
        this.selectedRequest = {};
      }
      // If there is a request above
      let aboveIndex = this.selectedRequest.index - 1,
        belowIndex = this.selectedRequest.index + 1;
      if (this.filteredRequests[aboveIndex]) {
        this.selectedRequest = this.filteredRequests[aboveIndex];
      }
      if (this.filteredRequests[belowIndex]) {
        this.selectedRequest = this.filteredRequests[belowIndex];
      }
    },
    updateRequest(update) {
      let updatedRequest = Object.assign(this.selectedRequest, update);
      this.UPDATE_ONE_REQUEST(updatedRequest);
    }
  }
};
</script>

<style lang="scss" scoped>
$requests: (
  sent: var(--purple),
  seen: var(--blue),
  rejected: var(--danger),
  approved: var(--success)
);

.requests_container {
  display: flex;
  height: 100%;
  flex: 1;
}
.requests_list {
  flex: 0.6;
}
.viewing_request {
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
  max-height: 97%;
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
.request {
  flex: 1;
  border-top: $border;

  border-bottom: $border;
  transition: $default_transition;
  margin: 20px 0;
  display: flex;
}
.dates_container {
  font-size: 1.3em;
  padding: 10px;
  flex: 0.1;
}
.details_container {
  flex: 1;
  padding: 10px;
  @each $key, $value in $requests {
    &.#{$key} {
      background: rgba($value, 0.08);
      border-left: 5px solid rgba($value, 1);

      &:hover,
      &.active {
        background: rgba($value, 0.1);
      }
      .status {
        color: rgba($value, 1);
      }
    }
  }
}
ul {
  padding: 10px 0;
}

header {
  border-bottom: $border;
  padding: 10px;
}
.details_grid {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  overflow-x: hidden;
}
.details_item {
  display: flex;
  border: $border;
  flex-direction: column;
  flex: 1;
  padding: 2%;
}
.actions_wrapper {
  display: flex;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  &/deep/ .button_container {
    flex: 1;
    font-size: 1.2em;

    margin: 0px 1px;
  }
}
.timeline_wrapper {
  padding: 10px;
}
.timeline {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: $border;
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
