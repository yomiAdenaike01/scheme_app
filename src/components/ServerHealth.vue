<template>
  <transition name="el-fade-in">
    <div
      v-loading="loading"
      class="p-1 server_health_container flex_center"
      :class="[
        { healthy: serverHealth.healthy },
        { unhealthy: !serverHealth.healthy }
      ]"
    >
      {{ displayText }}
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ServerHealth",
  computed: {
    ...mapState(["serverHealth"]),
    loading() {
      return Object.keys(this.serverHealth).length == 0;
    },
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
    background: $success_colour;
  }
  &.unhealthy {
    background: $error_colour;
  }
}
</style>
