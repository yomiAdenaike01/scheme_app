<template>
  <div
    v-loading="loading"
    class="server_health_container"
    :class="[
      { healthy: instanceInformation.healthy },
      { unhealthy: !instanceInformation.healthy }
    ]"
  >
    <el-button
      v-if="!loading"
      circle
      class="disabled button_display"
      :icon="instanceInformation.healthy ? 'el-icon-check' : 'el-icon-cross'"
    ></el-button>
    <h4>{{ displayText }}</h4>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "InstanceCheck",
  data() {
    return {
      loading: true,
      instanceInformation: {}
    };
  },
  computed: {
    displayText() {
      let healthy = this.instanceInformation?.healthy;
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
          this.instanceInformation = response;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.server_health_container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: whitesmoke;
  padding: 15px;
  color: white;
  width: 100%;

  &.healthy {
    background: #99b898;
    box-shadow: inset 5px 0px 10px rgba(0, 0, 0, 0.1);
    .button_display {
      background: darken($color: #99b898, $amount: 18);
    }
  }
  &.unhealthy {
    background: $error_colour;
    background: darken($color: $error_colour, $amount: 18);
  }
}
.button_display {
  margin-right: 10px;
  border: none;
  color: white;
}
</style>
