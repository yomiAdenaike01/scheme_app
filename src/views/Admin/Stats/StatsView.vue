<template>
  <el-col class="m-4">
    <Title
      title="This Week"
      subtitle="View a small summary of the metrics here."
    />
    <div class="flex_center">
      <el-col type="flex" v-for="(content, key) in weeklyTotals" :key="key">
        <el-card class="m-1" shadow="none">
          <div class="flex_center columns">
            <strong>
              {{
                content.result.hasOwnProperty("name")
                  ? content.result.name
                  : content.result
              }}
            </strong>
            <Title :subtitle="content.label" />
          </div>
        </el-card>
      </el-col>
    </div>
  </el-col>
</template>

<script>
import Title from "@/components/Title";
import Chart from "@/components/Chart";
import moment from "moment";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "StatsView",
  data() {
    return {
      weeklyTotals: {}
    };
  },
  created() {
    this.request({
      method: "GET",
      url: "reports/weekly"
    })
      .then(response => {
        this.weeklyTotals = response;
      })
      .catch(error => {
        console.log(error);
      });
  },
  computed: {
    ...mapState(["clientInformation"]),
    today() {
      let now = moment();
      return {
        now,
        nowISO: now.toISOString()
      };
    },
    practiceChartData() {
      return {
        data: {
          labels: ["January", "February", "March"],
          datasets: [
            {
              label: "Data One",
              data: [40, 20, 50]
            },
            {
              label: "Data Two",
              data: [40, 50, 50]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };
    }
  },
  methods: {
    ...mapActions(["request"])
  },
  components: {
    Title,
    Chart
  }
};

/**
 * Hours this week
 * Hours this month
 * On leave
 * On shift
 * On holiday
 *
 */
</script>

<style></style>
