<template>
  <div>
    <Shift v-for="shift in userShifts" :shift="userShifts" :key="shift._id" />
  </div>
</template>

<script>
import Shift from "./../../Dashboard/components/Shift";
import { mapState } from "vuex";
export default {
  name: "TeamShiftInfo",
  computed: {
    ...mapState(["currentUser"]),
    ...mapState("Admin", ["shifts"]),
    userShifts() {
      let { _id } = this.currentUser;
      return this.shifts.all.filter(shift => {
        return shift.assignedTo == _id;
      });
    }
  },
  components: {
    Shift
  }
};
</script>

<style></style>
