<template>
  <transition name="el-fade-in">
    <div
      v-loading="loading"
      class="server_health_container flex_center"
      :class="[
        { healthy: serverInformation.healthy },
        { unhealthy: !serverInformation.healthy }
      ]"
    >
      {{ displayText }}
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "InstanceCheck",
  data() {
    return {
      loading: true,
      serverInformation: {}
    };
  },
  computed: {
    displayText() {
      let healthy = this.serverInformation?.healthy;
      if (healthy) {
        return "Your cloud instance is healthy";
      } else {
        return "Server error detected please contact your admin";
      }
    }
  },
  activated() {
    this.checkInstance();
  },
  methods: {
    ...mapActions(["request"]),
    checkInstance() {
      this.request({
        method: "GET",
        url: "/healthcheck"
      })
        .then(response => {
          this.loading = false;
          this.serverInformation = response;
        })
        .catch(error => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.server_health_container {
  background: whitesmoke;
  padding: 15px;
  text-align: center;
  color: white;
  width: 100%;
  &.healthy {
    background: #99b898;
    // background-image: linear-gradient(
    //   150deg,
    //   $element_colour 10%,
    //   #80d0c7 200%
    // );
    box-shadow: inset 5px 0px 10px rgba(0, 0, 0, 0.1);
  }
  &.unhealthy {
    background: $error_colour;
  }
}
</style>
