<template>
  <div class="reports_container">
    <h1>Reports</h1>
    <MoreInformation index="admin" instruction="report" />
  </div>
</template>

<script>
import Tabs from "@/components/Tabs";
import MoreInformation from "@/components/MoreInformation";
import moment from "moment";
import { mapState } from "vuex";
export default {
  name: "Reports",
  computed: {
    ...mapState("Admin", ["team", "shifts"]),
    ...mapState(["userInformation"]),
    renderReportsConfig(){
      
    },
    tabs() {
      return [
        {
          label: ""
        },
        {
          label: ""
        }
      ];
    },
    renderTotalShiftTimeThisMonth() {
      let lastMonth = moment().subtract(1, "month");
      const len = this.shifts.length;
      let statistics = {
        totalHours: "",
        totalMins: "",
        totalDays: "",
        totalWeeks: ""
      };
      for (let i = 0; i < len; i++) {
        let shift = this.shifts[i];
        let { startDate, endDate } = shift;

        startDate = moment(startDate).seconds();
        endDate = moment(endDate).seconds();

        statistics.totalHours = moment(startDate - endDate).toISOString();
      }
      return stastics;
    }
  },
  components: {
    Tabs,
    MoreInformation
  }
};
</script>

<style>
</style>