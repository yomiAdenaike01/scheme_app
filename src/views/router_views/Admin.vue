<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Admin",
  data() {
    return {
      adminInterval: null
    };
  },
  computed: {
    ...mapState(["preferences"])
  },
  deactivated() {
    clearInterval(this.adminInterval);
  },
  activated() {
    this.adminInterval = setInterval(() => {
      this.getTeam();
      this.getNotifications();
      this.getShifts();
    }, 5000);
  },
  methods: {
    ...mapActions("Admin", ["getTeam", "getShifts"]),
    ...mapActions(["getNotifications"])
  }
};
</script>

<style></style>
