<template>
  <div
    ref="chart_container"
    class="chart_container"
    :style="{
      height: `${chartHeight + 20}px`
    }"
  >
    <ApexChart
      :type="chartOptions.chart.type"
      :options="chartOptions"
      :series="series"
      :height="chartHeight"
    />
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
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
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
    ...mapState(["colours"]),
    chartHeight() {
      let chartHeight = 600;
      if (Object.keys(this.$refs).length > 0) {
        chartHeight = this.$refs.chart_container.clientHeight;
      }
      return chartHeight;
    },
    chartOptions() {
      return {
        chart: {
          ...this.chartAesthetic,
          zoom: {
            enabled: false
          }
        },
        ...this.miscOptions,
        xaxis: this.xAxis,
        colors: [...this.colours].splice(0, this.series.length),
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
}
</style>
