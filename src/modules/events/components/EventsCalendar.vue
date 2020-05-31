<template>
  <div class="cal_container">
    <div class="sort_by_container">
      <s-button
        class="primary rounded"
        @click="$emit('updateOverlays', { overlay: 'events', display: true })"
      >
        {{ adminPermission ? "Groups & Event management" : "Create request" }}
      </s-button>
    </div>

    <VueCal
      ref="eventsCalendar"
      v-loading="loading"
      :events="calEvents"
      :on-event-click="viewEvent"
      events-on-month-view="short"
      cell-contextmenu
      :cell-click-hold="false"
      @cell-contextmenu="createEventHere"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import VueCal from "vue-cal";
import SortBy from "@/components/SortBy";
import SButton from "@/components/SButton";

import "vue-cal/dist/vuecal.css";
export default {
  name: "EventsCalendar",
  components: {
    VueCal,
    SortBy,
    SButton
  },
  data() {
    return {
      view: false,
      loading: false,

      editEvents: false
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Events", ["events"]),
    ...mapState("Team", ["team"]),
    ...mapGetters(["adminPermission"]),

    calEvents() {
      let localEvents = [];
      let apiEvents = [...this.events];

      if (apiEvents.length > 0) {
        for (let i = 0, len = apiEvents.length; i < len; i++) {
          let apiEvent = apiEvents[i];

          let formattedEvent = this.convertToVueCal(apiEvent, i);

          formattedEvent = Object.assign(formattedEvent, apiEvent);

          localEvents.push(formattedEvent);
        }
      }
      return localEvents;
    },
    convertToVueCal() {
      return (apiEvent, i) => {
        let dateFormat = "YYYY-MM-DD hh:mm";

        let firstAssignee = apiEvent.assigned_to[0];
        let content = `${firstAssignee?.name ?? "Unassigned"}`;

        if (apiEvent.assigned_to.length - 1 > 0) {
          content = `${content} +${parseInt(
            apiEvent.assigned_to.length - 1
          )} others`;
        }

        let formattedEvent = {
          title: `${apiEvent.type.label} event`,
          heading: apiEvent.type.label,
          content,
          start: this.formatDate(apiEvent.start_date, dateFormat),
          end: this.formatDate(apiEvent.end_date, dateFormat),
          deleteadble: true,
          event_index: i
        };
        return formattedEvent;
      };
    }
  },
  methods: {
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),

    createEventHere({ date }) {
      // Select the start and end of day
      let startOfDay = new Date(new Date(date).setHours(9, 0)).toISOString();
      let endOfDay = new Date(new Date(date).setHours(17, 0)).toISOString();

      date = [startOfDay, endOfDay];

      this.$emit("updateOverlays", { overlay: "events", display: true });
      this.$emit("quickCreate", { dates: date });
    },

    viewEvent(event) {
      let eventIndex = this.events.findIndex(x => {
        return x._id == event._id;
      });

      let defaultPayload = {
        display: true,
        overlay: "viewEvent"
      };

      let overlayIndexPayload = Object.assign(defaultPayload, {
        payload: this.events[eventIndex]
      });

      this.UPDATE_OVERLAY_INDEX(overlayIndexPayload);
    }
  }
};
</script>

<style lang="scss" scoped>
.cal_filters {
  padding: 10px;
}
.sort_by_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
.cal_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
  &/deep/ {
    .vuecal__now-line {
      color: $element_colour;
    }

    .vuecal__event {
      background: rgba(var(--colour_secondary), 0.1);
      border-top: 2px solid rgba(var(--colour_secondary), 1);
      border-right: none;
      border-left: none;
      padding: 1em 0;
      text-transform: capitalize;

      &.alone {
        background: #fef0f0;
        border-top: 2px solid #f56c6c;
        color: #f56c6c;
      }
      &.no_assignee {
        background: #fdf6ec;
        border-top: 2px solid #f2c678;
        color: #f2c678;
      }
    }
    .el-icon-circle-close {
      color: red;
    }
    .el-icon-circle-check {
      color: green;
    }
    .vuecal__title-bar {
      background: none;
      margin: 1em 0;
      .vuecal__title {
        button {
          color: #999;
        }
      }
    }
  }
}
</style>
