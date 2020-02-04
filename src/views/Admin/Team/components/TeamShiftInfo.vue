<template>
  <div>
    <div v-if="userShifts.length > 0">
      <h5 class="mb-2">All Shifts</h5>
      <Shift v-for="shift in userShifts" :shift="shift" :key="shift._id" />
    </div>
    <Nocontent v-bind="noContent" v-else>
      <el-button v-if="getIsAdmin" @click="$router.push({ name: 'schedule' })">
        Go to schedule
      </el-button>
    </Nocontent>
  </div>
</template>

<script>
import Shift from "./../../Dashboard/components/Shift";
import { mapState, mapGetters } from "vuex";
import Nocontent from "@/components/Nocontent"
export default {
  name: "TeamShiftInfo",
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["shifts", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin"]),
    noContent() {
      return {
        text:
          "No shifts are detected for this user, you can create a shift for them below",
        icon: "el-icon-s-management"
      };
    },
    userShifts() {
      let { id } = this.viewTeamMember;
      return this.shifts.all.filter(shift => {
        return shift.assignedTo == id;
      });
    }
  },
  components: {
    Shift,
    Nocontent
  }
};
</script>

<style></style>
