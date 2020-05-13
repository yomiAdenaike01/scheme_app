<template>
  <div class="requests_container">
    <div v-if="eventRequests.length > 0" class="filter_requests_toolbar"></div>
    <div class="text_container all_centre">
      <h2>No requests</h2>
      <p>Use the button below to create a new request</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Request",
  computed: {
    ...mapState("Events", ["eventRequests"])
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Events", [
      "CREATE_REQUEST",
      "UPDATE_ONE_REQUEST",
      "DELETE_REQUEST"
    ]),
    createRequest() {
      this.CREATE_REQUEST();
    }
  }
};
</script>

<style lang="scss" scoped></style>
