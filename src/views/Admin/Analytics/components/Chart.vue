<template>
  <div class="chart_containar">
    <el-card>
      <chart :chart-data="datacollection"></chart>
    </el-card>
  </div>
</template>
<script>
import Chart from "@/components/Chart";
export default {
  components: {
    Chart
  },
  data() {
    return {
      datacollection: null
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            label: "GitHub Commits",
            backgroundColor: "#f87979",
            data: [70, 20, 12, 39, 100, 40, 95, 80, 80, 20, 12, 101]
          },
          {
            label: "Monthly incomes",
            backgroundColor: "#A5CC82",
            data: [205, 408, 188, 190, 58, 200, 190, 400, 164, 254, 290, 201]
          }
        ]
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.chart_containar {
  max-width: 600px;
  max-height: 600px;
}
</style>
