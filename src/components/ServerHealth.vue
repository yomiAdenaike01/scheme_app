<template>
  <transition name="el-fade-in">
    <div
      class="p-2 server_health_container flex_center"
      :class="[
        { healthy: serverHealth.healthy },
        { unhealthy: !serverHealth.healthy }
      ]"
    >{{ displayText }}</div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ServerHealth",
  computed: {
    ...mapState(["serverHealth"]),

    displayText() {
      let { healthy } = this.serverHealth;
      if (healthy) {
        return "Your cloud instance is healthy";
      } else {
        return "Server error detected please contact your admin";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.server_health_container {
  width: 100%;
  background: whitesmoke;
  color: white;
  &.healthy {
    background: #99B898   ;
   // background-image: linear-gradient(
    //   150deg,
    //   $element_colour 10%,
    //   #80d0c7 200%
    // );
  }
  &.unhealthy {
    background: $error_colour;
  }
}
</style>
