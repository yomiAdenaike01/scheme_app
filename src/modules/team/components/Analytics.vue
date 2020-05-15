<template>
  <div v-loading="loading" class="analytics_container">
    <div class="filters_container">
      <!-- Filters -->
      <SortBy
        v-model="dataSet"
        icon="bx-bar-chart"
        :items="dataSets"
        filter-text="Select a dataset"
      />
      <!-- Select date -->
      <div class="filters_tools_container">
        <div class="date_inputs_container">
          <input
            type="date"
            class="input_date"
            :value="filters.date_range"
            @input="changeDate"
          />
          <input
            type="date"
            class="input_date"
            :value="filters.date_range"
            @input="changeDate($event, 1)"
          />
        </div>

        <s-button
          class="only_icon secondary"
          icon="refresh"
          @click="
            mode = 'dashboard';
            getGraph();
          "
        />
      </div>
      <!-- Select status for tasks -->
    </div>
    <div v-if="mode == 'dashboard'" class="data_container">
      <!-- Value is an array of objects -->
      <div v-loading="dataItems[dataSet].length == 0" class="data_item_wrapper">
        <div
          v-for="(dataUnit, index) in dataItems[dataSet]"
          :key="index"
          class="data_item"
        >
          <!-- Each data unit is an object -->
          <div
            v-for="(_value, _key) in dataUnit"
            :key="`${(_value, _key)}`"
            class="data_item_text"
          >
            <!-- Day , week value -->
            <h3 class="time_container">
              {{ formatDate(_value.times.start, "DD-MM-YYYY") }} -
              {{ formatDate(_value.times.end, "DD-MM-YYYY") }}
            </h3>
            <h3 class="title">
              {{ _key == "day" ? "Today" : `This ${_key}` }}
            </h3>

            <h1 class="grey">{{ _value.events }}</h1>
          </div>
        </div>
      </div>
      <!-- Charts -->
      <div class="data_item_container">
        <Chart
          v-loading="chartLoading"
          :username="selectedTeamMember.name"
          v-bind="chartData"
        />
      </div>
    </div>
    <div v-if="mode == 'custom'" class="custom_container">
      {{ $data }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { FadeTransition } from "vue2-transitions";

import Chart from "./Chart";

import SortBy from "@/components/SortBy";
import SButton from "@/components/SButton";

export default {
  name: "Analytics",
  components: {
    FadeTransition,
    Chart,
    SortBy,
    SButton
  },
  props: {
    selectedTeamMember: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      loading: true,
      filters: {},
      mode: "dashboard",
      chartData: {},
      chartLoading: false,
      dataSets: [
        { label: "Events", value: 1 },
        { label: "Tasks", value: 0 }
      ],
      dataSet: "events",
      dataItems: {
        events: [],
        tasks: []
      },
      timeStepArr: ["day", "week", "month", "year"],
      urlKeys: ["events", "tasks"]
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters("Team", ["userLookup"]),
    globalIntervalID() {
      return `analytics_${this.selectedTeamMember._id}`;
    }
  },
  watch: {
    selectedTeamMember: {
      immediate: true,
      async handler() {
        await this.initAnalytics();
        await this.getGraph();
      }
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL", "DELETE_GLOBAL_INTERVAL"]),
    getGraph() {
      this.chartLoading = true;
      this.request({
        url: `analytics/${this.dataSet}/graph`,
        params: { time_step: "year", user: this.selectedTeamMember._id },
        method: "GET"
      }).then(response => {
        let chartData = {
          textContent: {
            title: {
              text: `Events in hours`,
              align: "left"
            },
            subtitle: {
              text: "Data",
              align: "left"
            }
          },
          xAxis: {
            type: "datetime",
            categories: []
          },
          series: []
        };
        for (let i = 0, len = response.length; i < len; i++) {
          let responseItem = response[i];
          chartData.xAxis.categories = responseItem.categories;
          chartData.series.push({
            data: responseItem.data,
            name: this.selectedTeamMember.name
          });
        }
        this.chartData = chartData;
        this.chartLoading = false;
      });
    },
    initAnalytics() {
      this.mode = "dashboard";
      return new Promise((resolve, reject) => {
        try {
          this.dataItems = {
            events: [],
            tasks: []
          };
          this.getAnalytics().then(() => {
            this.loading = false;
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateDataSet({ dataSet, key, data }) {
      this.dataItems[dataSet].push({ [key]: data });
    },
    async getAnalytics() {
      try {
        for (let i = 0, len = this.timeStepArr.length; i < len; i++) {
          let time_step = this.timeStepArr[i];

          let eventCount = await this.fetchAnalytics(
            this.selectedTeamMember._id,
            time_step,
            this.dataSet
          );

          this.updateDataSet({
            dataSet: this.dataSet,
            key: time_step,
            data: eventCount
          });
        }
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    fetchAnalytics(
      user = this.selectedTeamMember._id,
      time_step = "week",
      urlKey = "events",
      callback
    ) {
      return new Promise((resolve, reject) => {
        let payload = {
          url: `analytics/${urlKey}`,
          method: "GET",
          params: { user, time_step }
        };
        if (this.mode != "dashboard") {
          if (Object.values(this.filters).length > 0) {
            delete payload.params.time_step;
          }
          for (let property in this.filters) {
            if (!payload.parmas?.property) {
              payload.params[property] = this.filters[property];
            }
          }
        }
        this.request(payload)
          .then(response => {
            if (callback) {
              callback.success(response);
            }
            resolve(response);
          })
          .catch(err => {
            if (callback) {
              callback.error(err);
            }
            reject(err);
          });
      });
    },
    getCutsomData() {
      this.mode = "custom";
      this.fetchAnalytics(this.selectedTeamMember._id, null, "events", {
        success: res => {
          this.dataItems[this.dataSet] = res;
        },
        error: error => {
          console.error(error);
        }
      });
    },
    changeDate({ target }, index = 0) {
      this.filters.date_range.splice(
        index,
        0,
        new Date(target.value).toISOString()
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.analytics_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
}
.filters_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(var(--colour_primary), 0.01);
  border-bottom: $border;
}
.filters_tools_container {
  display: flex;
  align-items: center;
  > * {
    margin: 0 5px;
  }
}
.data_item_container {
  display: flex;
  flex: 1;
}
.data_item_wrapper {
  flex-wrap: wrap;
  display: flex;
  flex: 1;
  margin: 10px;
}

.data_item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 0 10px;
  border: $border;
  .title {
    text-transform: capitalize;
  }
  .grey {
    font-size: 2em;
  }
}
.time_container {
  padding: 5px;
  border-radius: 40px;
  background: rgb(220, 220, 220);
  margin-bottom: 20px;
  color: white;
  font-size: 1em;
}
.data_item_text {
  text-align: center;
}
.data_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px;
}

.date_inputs_container {
  padding: 10px;
  background: rgb(240, 240, 240);
  border-radius: 20px;
  .input_date {
    border: none;
    background: transparent;
  }
}
</style>
