<template>
  <div class="analytics_container">
    <h1>Analytics</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Analytics",
  computed: {
    ...mapState("Events", ["events"]),
    ...mapState("Team", ["team"]),
    totalHours() {
      return [{}];
    }
  }
};
</script>

<style lang="scss" scoped>
.analytics_container {
  padding: 20px;
}
</style>
