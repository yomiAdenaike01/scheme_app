<template>
  <div
    ref="chart_container"
    class="chart_container"
    :class="{ no_chart: series.length == 0 }"
    :style="{
      height: `${chartHeight + 20}px`
    }"
  >
    <ApexChart
      v-if="series.length > 0"
      :type="chartOptions.chart.type"
      :options="chartOptions"
      :series="series"
      :height="chartHeight"
    />
    <div v-else class="text_container grey all_centre">
      <i class="large_icon bx bx-bar-chart-alt-2"></i>
      <h1>
        No chart data found
      </h1>
    </div>
  </div>
</template>

<script>
import ApexChart from "vue-apexcharts";
import { mapState } from "vuex";

export default {
  name: "Chart",
  components: {
    ApexChart
  },

  props: {
    username: {
      type: String
    },
    textContent: {
      type: Object,
      default: () => {
        return {
          title: {
            text: "Title",
            align: "left"
          },
          subtitle: {
            text: "Subtitle",
            align: "left"
          }
        };
      }
    },

    series: {
      type: Array,
      default: () => [
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ]
    },
    xAxis: {
      type: Object,
      default: () => {
        return {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00",
            "2018-09-19T01:30:00",
            "2018-09-19T02:30:00",
            "2018-09-19T03:30:00",
            "2018-09-19T04:30:00",
            "2018-09-19T05:30:00",
            "2018-09-19T06:30:00"
          ]
        };
      }
    },
    miscOptions: {
      type: Object,
      default: () => {
        return {
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth"
          },
          fill: {
            type: "gradient",
            gradient: {
              opacityFrom: 0.6,
              opacityTo: 0.8
            }
          }
        };
      }
    },
    chartAesthetic: {
      type: Object,
      default: () => {
        return {
          type: "area",
          height: 950,
          stacked: false
        };
      }
    },
    legend: {
      type: Object,
      default: () => {
        return { position: "top", horizontalAlign: "left" };
      }
    }
  },
  computed: {
    ...mapState(["colours", "userInformation"]),
    chartHeight() {
      let chartHeight = 600;
      if (Object.keys(this.$refs).length > 0) {
        chartHeight = this.$refs.chart_container.parentElement.height / 2;
      }
      return chartHeight;
    },
    chartOptions() {
      let chartColours = [...this.colours].splice(0, this.series.length);
      if (this.series.length == 1) {
        chartColours = [
          this.colours[this.username.length % this.colours.length]
        ];
      }
      return {
        chart: {
          ...this.chartAesthetic,
          zoom: {
            enabled: false
          }
        },
        ...this.miscOptions,
        xaxis: this.xAxis,
        colors: chartColours,
        legend: this.legend,
        title: this.textContent.title,
        subtitle: this.textContent.subtitle
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.chart_container {
  flex: 1;
  border: $border;
  padding: 0 20px;
  &.no_chart {
    flex: 1;
    display: flex;
  }
}
</style>
