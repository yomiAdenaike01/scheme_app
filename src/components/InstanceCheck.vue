<template>
  <div
    v-loading="loading"
    class="instance_check_container"
    :class="[
      { healthy: checkResult.healthy },
      { unhealthy: !checkResult.healthy }
    ]"
  >
    <s-button
      v-if="!loading"
      class="disabled button_display rounded "
      :class="checkResult.healthy ? 'secondary' : 'tertiary'"
      :icon="checkResult.healthy ? 'check' : 'x'"
    >
      {{ displayText }}
    </s-button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "InstanceCheck",
  components: {
    SButton: () => import("@/components/SButton")
  },
  data() {
    return {
      loading: true,
      checkResult: {}
    };
  },
  computed: {
    displayText() {
      let healthy = this.checkResult?.healthy;
      if (healthy) {
        return "Your cloud instance is healthy";
      } else {
        return "Server error detected please contact your admin";
      }
    }
  },
  created() {
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
          this.checkResult = response;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.instance_check_container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
