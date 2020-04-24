<template>
  <div class="requests_container">
    <div v-if="requests.length > 0" class="requests_wrapper">
      <Request
        v-for="(request, index) in requests"
        :key="request._id"
        :request="request"
        :request-index="index"
      />
    </div>
    <p v-else>No requests</p>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { SlideXLeftTransition } from "vue2-transitions";
import InformationDisplay from "@/components/InformationDisplay";
import Request from "./Request";
export default {
  name: "Requests",
  components: {
    SlideXLeftTransition,
    Request,
    InformationDisplay
  },

  data() {
    return {
      requestSearch: ""
    };
  },

  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["requests", "team"]),
    randStatus() {
      let statuses = ["sent", "seen", "approved", "rejected"];
      return statuses[Math.floor(Math.random() * statuses.length)];
    },
    filteredRequests() {
      return this.requests.filter(request => {
        return request.status == this.requestFilter;
      });
    },
    teamMembers() {
      return this.team;
    }
  },
  activated() {
    let date = new Date().toISOString();
    for (let i = 0, len = 5; i < len; i++) {
      this.UPDATE_REQUESTS({
        _id: Math.random()
          .toString(16)
          .slice(2),
        assigned_to: [{ ...this.userInformation }],
        start_date: date,
        end_date: this.initMoment().add(2, "days"),
        status: this.randStatus,
        requested_by: this.team[1],
        type: this.clientInformation.event_groups[0],
        notes:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
      });
    }
  },
  methods: {
    ...mapMutations("Admin", ["UPDATE_REQUESTS"])
  }
};
</script>

<style lang="scss" scoped>
.requests_container {
  display: flex;
  justify-content: center;
  max-height: calc(100% - 40px);
  overflow-x: hidden;
}
.requests_wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
