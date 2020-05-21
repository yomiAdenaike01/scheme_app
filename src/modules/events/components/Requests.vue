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
        <!-- Header -->
        <header>
          <h1 class="capitalize">{{ selectedRequest.type.label }}</h1>
        </header>

        <section>
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

          <!-- Timeline -->
          <div class="timeline_wrapper">
            <h3>Status timeline</h3>
            <div class="timeline">
              <div
                v-for="(status, index) in statusOptions"
                :key="`${status}${index}`"
              >
                <div class="time_unit capitalize">{{ status }}</div>
              </div>
            </div>
          </div>
        </section>
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
    actionOptions() {},
    viewDataXref() {
      return ["assigned_to", "notes", "requested_by"];
    },
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
  overflow-x: hidden;
  max-height: 97%;
}
.filters_container {
  margin: 10px;
  select {
    margin-top: 10px;
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
.timeline {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 30px;
  border-bottom: $border;
}
</style>
