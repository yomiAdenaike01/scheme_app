<template>
  <el-col class="m-4">
    <!-- Task progress container -->
    <el-card shadow="none">
      <div class="tasks_widget_container flex_center columns">
        <p class="light txt_center mb-1">Total Task Progress</p>
        <small class="grey">Total percentage of all completed tasks</small>
        <el-progress
          class="mb-3 mt-3"
          :width="200"
          type="circle"
          :percentage="progressIndicator"
        ></el-progress>

        <el-button
          plain
          size="small"
          @click="$router.push({ name: 'utilities' })"
          >View Tasks</el-button
        >
      </div>
    </el-card>

    <!-- Metrics widgets -->
    <div class="flex_center">
      <el-col
        class="metrics_summary_container"
        type="flex"
        v-for="(content, key) in weeklyTotals"
        :key="key"
      >
        <el-card class="m-1 h-100 flex_center" shadow="none">
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
    </div>
    <el-card
      shadow="none"
      class="flex_center columns google_cal_sync_container"
    >
      <Nocontent v-if="!hasGcal" v-bind="errorDisplay">
        <el-button size="mini" plain @click="configGoogleCal"
          >Configure Google calendar</el-button
        >
      </Nocontent>
      <div class="flex_center columns" v-else>
        <el-button
          class="no_events medium_icon"
          circle
          type="success"
          icon="el-icon-check"
        ></el-button>
        <br />
        <p>Successfully synced with google calendar</p>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import Title from "@/components/Title";
import Nocontent from "@/components/Nocontent";
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
      return Object.keys(this.userInformation.gcalToken).length > 0;
    },
    errorDisplay() {
      return {
        text:
          "You have encountered a critical server error, to proceed please contact support so that this can be fixed",
        icon: "el-icon-warning-outline",
        buttonText: "Hello"
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
    ...mapActions(["request"]),
    configGoogleCal() {
      this.request({
        method: "POST",
        url: "services/googlecal",
        data: { id: this.userInformation._id, returnPath: window.location.href }
      })
        .then(response => {
          window.location.href = response;
          // console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    Title,
    Nocontent
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
