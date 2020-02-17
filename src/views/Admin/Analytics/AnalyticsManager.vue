<template>
  <div>
    <div class="chart_container">
      <chart :chart-data="analyticsData"></chart>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Chart from "@/components/Chart.js";
export default {
  name: "AnalyticsManager",
  data() {
    return {
      analyticsData: {}
    };
  },
  activated() {
    this.request({
      method: "GET",
      url: "analytics/events",
      data: {}
    })
      .then(({ events }) => {
        console.log(events);
        this.analyticsData = events;
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    ...mapState("Admin", ["analyticsPresentation"])
  },
  methods: {
    ...mapActions(["request"])
  },
  components: {
    Chart
  }
};
</script>

<style lang="scss" scoped>
.chart_container {
  width: 400px;
}
</style>
