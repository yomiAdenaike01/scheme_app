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
            initAnalytics();
          "
        />
      </div>
      <!-- Select status for tasks -->
    </div>
    <div v-if="mode == 'dashboard'" class="data_container">
      <div
        v-for="(value, key) in dataItems"
        :key="key"
        :class="`data_item_container ${key}`"
      >
        <!-- Value is an array of objects -->
        <div v-if="value.length > 0" class="data_item_wrapper">
          <div
            v-for="(dataUnit, index) in value"
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
              <h3 class="title">This {{ _key }}</h3>

              <h1 class="grey">{{ _value.events }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="mode == 'custom'" class="custom_container">
      {{ $data }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { FadeTransition } from "vue2-transitions";
import SortBy from "@/components/SortBy";
import SButton from "@/components/SButton";
export default {
  name: "Analytics",
  components: {
    FadeTransition,
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
      loading: false,
      filters: {},
      mode: "dashboard",
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
    globalIntervalID() {
      return `analytics_${this.selectedTeamMember._id}`;
    }
  },
  watch: {
    async selectedTeamMember() {
      await this.initAnalytics();
    }
  },
  async created() {
    await this.initAnalytics();
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL", "DELETE_GLOBAL_INTERVAL"]),
    initAnalytics() {
      this.loading = true;
      this.mode = "dashboard";
      return new Promise((resolve, reject) => {
        try {
          this.dataItems = {
            events: [],
            tasks: []
          };
          this.getAnalytics();
          this.loading = false;
          resolve();
        } catch (error) {
          reject(error);
          this.loading = false;
        }
      });
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
          this.dataItems[this.dataSet].push({ [time_step]: eventCount });
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
}
.filters_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(var(--colour_primary), 0.03);
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
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}
.data_item {
  display: flex;
  flex: 1;
  min-width: 400px;
  justify-content: center;
  align-items: center;
  padding: 30px;
  margin: 10px;
  max-height: 300px;
  box-shadow: $box_shadow;
  .title {
    text-transform: capitalize;
  }
  .grey {
    font-size: 2em;
  }
}
.time_container {
  padding: 10px;
  border-radius: 40px;
  background: rgb(220, 220, 220);

  color: white;
  font-size: 1em;
}
.data_item_text {
  text-align: center;
}
.data_container {
  display: flex;
  flex: 1;
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
