<template>
  <div class="featurerequest_container">
    <FeatureRequest
      v-for="request in featureRequests[currentIndex]"
      :key="request._id"
      :request="request"
    />
  </div>
</template>

<script>
import FeatureRequest from "./components/FeatureRequest";
import { mapActions } from "vuex";
export default {
  name: "FeatureRequest",
  data() {
    return {
      featureRequests: {}
    };
  },
  computed: {
    currentIndex() {
      return "all";
    }
  },
  activated() {
    this.request({
      url: "user/feature",
      method: "GET"
    })
      .then(response => {
        this.featureRequests = response;
      })
      .catch(err => {
        return err;
      });
  },
  methods: {
    ...mapActions(["request"])
  },
  components: {
    FeatureRequest
  }
};
</script>

<style scoped lang="scss"></style>
