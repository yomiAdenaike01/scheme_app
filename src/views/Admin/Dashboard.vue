<template>
  <el-container>
    <el-main></el-main>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import dates from "@/mixins/dates";
export default {
  name: "Dashboard",
  data() {
    return {
      activeName: "shifts"
    };
  },
  mixins: [dates],
  computed: {
    ...mapState(["shifts", "requests"]),
    returnShifts() {
      const shifts = this.shifts;
      const len = shifts.length;
      let shiftsDates = {
        week: [],
        today: [],
        upcoming: []
      };
      for (let i = 0; i < len; i++) {
        const shift = shifts[i];
        const startDate = shift.startDate;
        if (this.isThisWeek(startDate)) {
          shiftsDates.week.push(shift);
        } else if (this.isToday(startDate)) {
          shiftsDates.today.push(startDate);
        } else if (this.isFuture(startDate, true, null)) {
          shiftsDates.upcoming.push(shift);
        }
      }
      // for (let property in shiftsDates) {
      //   let arr = shiftsDates[property];
      //   if (arr.length <= 0) {
      //     delete shiftsDates[property];
      //   }
      // }
      return shiftsDates;
    }
  }
};
</script>

<style></style>
