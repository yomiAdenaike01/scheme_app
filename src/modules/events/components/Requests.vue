<template>
  <div class="requests_container">
    <div class="requests_list">
      <div
        v-if="filteredRequests.length > 0"
        class="requests_list_subcontainer"
      >
        <!-- Filters -->
        <div class="filters_container">
          <input
            v-model="filters.label"
            class="s_input no_border_radius"
            placeholder="Search request type"
          />
          <select
            v-model="filters.status"
            class="s_input no_border_radius capitalize"
          >
            <option value="" disabled selected hidden>Filter by status</option>
            <option
              v-for="(option, index) in statusOptions"
              :key="index"
              :value="option"
              >{{ makePretty(option) }}</option
            >
          </select>
        </div>
        <!-- Requests -->
        <div
          v-for="(request, index) in filteredRequests"
          :key="request._id"
          :class="[
            `request trigger `,
            { active: selectedRequest._id == request._id }
          ]"
          @click="updateRequest(request, index)"
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
        {{ selectedRequest }}
      </div>
      <div v-else class="grey text_container all_centre">
        <i class="bx bx-eye large_icon"></i>
        <h1>No request selected</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "Requests",
  data() {
    return {
      selectedRequest: {},
      filters: {
        label: "",
        date_created: ""
      }
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Events", ["eventRequests"]),
    ...mapGetters(["adminPermission"]),
    statusOptions() {
      return ["sent", "approved", "rejected"];
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

      let requests = [...this.eventRequests];
      for (let i = 0, len = requests.length; i < len; i++) {
        let request = requests[i];
        if (!filterLabel.includes(request.type.label.toLowerCase())) {
          continue;
        }

        filteredRequests.push(request);
      }

      return filteredRequests.length > 0
        ? filteredRequests
        : this.eventRequests;
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Events", [
      "CREATE_REQUEST",
      "UPDATE_ONE_REQUEST",
      "DELETE_REQUEST"
    ]),
    updateRequest(request, index) {
      this.selectedRequest = request;
      this.UPDATE_ONE_REQUEST({
        ...request,
        index
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$requests: (
  sent: var(--purple),
  rejected: var(--danger),
  approved: var(--success)
);

.requests_container {
  display: flex;
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
.filters_container {
  margin: 10px;
  select {
    margin-top: 10px;
  }
}
.requests_list_subcontainer {
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
.viewing_request_subcontainer {
  padding: 10px;
}
</style>
