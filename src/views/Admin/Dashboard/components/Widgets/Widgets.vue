<template>
  <el-col class="m-4">
    <!-- Task progress container -->
    <el-card shadow="none">
      <div class="tasks_widget_container flex_center columns">
        <p class="light txt_center mb-1">Total Task Progress</p>
        <small class="grey">Total percentage of all completed tasks</small>
        <el-progress class="mb-3 mt-3" :width="200" type="circle" :percentage="progressIndicator"></el-progress>

        <el-button plain size="small" @click="$router.push({ name: 'utilities' })">View Tasks</el-button>
      </div>
    </el-card>

    <!-- Metrics widgets -->
    <el-row type="flex" class="flex_center">
      <el-col class="metrics_summary_container" v-for="(content, key) in weeklyTotals" :key="key">
        <el-card class="mt-1 ml-2 h-100 flex_center" shadow="none">
          <div class="flex_center columns">
            <h3 class="m-0 p-0">
              {{
              content.result.hasOwnProperty("name")
              ? content.result.name
              : content.result
              }}
            </h3>
            <Title defaultClass="m-0" :subtitle="content.label" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import Title from "@/components/Title";
import moment from "moment";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "Widgets",

  data() {
    return {
      weeklyTotals: {}
    };
  },

  created() {
    this.request(
      {
        method: "GET",
        url: "reports/weekly"
      },
      false
    )
      .then(response => {
        this.weeklyTotals = response;
      })
      .catch(error => {
        console.log(error);
      });
  },
  computed: {
    ...mapState(["clientInformation", "userInformation"]),
    ...mapState("Admin", ["tasks"]),
    hasGcal() {
      return this.userInformation.gcalToken;
    },
    errorDisplay() {
      return {
        text:
          "You have not integrated google calendar with scheme cloud click the button to sync",
        icon: "el-icon-warning-outline"
      };
    },

    progressIndicator() {
      const {
        completedCount,
        totalCount,
        tasksRemaining
      } = this.tasksCategorised;

      let percentageComplete = Math.round((completedCount / totalCount) * 100);

      if (isNaN(percentageComplete)) {
        percentageComplete = 0;
      }

      return percentageComplete;
    },

    tasksCategorised() {
      let tasks = [];
      let completedtasks = [];

      if (this.tasks.length > 0) {
        tasks = this.tasks;

        completedtasks = tasks.filter(task => {
          return task.state == "complete";
        });
      }
      return {
        completedCount: completedtasks.length,
        totalCount: tasks.length,
        tasksRemaining: tasks.length - completedtasks.length
      };
    },
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
    Title
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

<style lang="scss" scoped>
.metrics_summary_container {
  height: 300px;
}
.tasks_widget_container {
  line-height: 2em;
}
</style>
