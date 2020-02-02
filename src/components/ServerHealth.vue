<template>
  <div
    class="server_health_container"
    v-loading="validStatus"
    :class="[
      { pending: validStatus },
      { healthy: serverHealth.status == 200 },
      { unhealthy: serverHealth.status == 500 }
    ]"
  >
    {{ serverHealth }}
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ServerHealth",
  created() {},
  computed: {
    ...mapState(["serverHealth"]),
    validStatus() {
      return Object.keys(this.serverHealth).length > 0;
    },
    displayStatus() {
      let { status } = this.serverHealth;
      if (status == 200) {
        return "Server is healthy";
      } else {
        return "Errors found in server please contact your administrator";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.server_health_container {
  padding: 20px;
  width: 100%;
  background: whitesmoke;
  &.healthy {
    background: green;
  }
}
</style>
