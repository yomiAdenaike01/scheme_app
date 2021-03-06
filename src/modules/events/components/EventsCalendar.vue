<template>
  <div class="cal_container">
    <div class="sort_by_container">
      <s-button
        class="primary rounded"
        @click="$emit('updateOverlays', { overlay: 'events', display: true })"
      >
        {{ adminPermission ? "Groups & Event management" : "Create request" }}
      </s-button>
      <SortBy
        v-model="eventType"
        filter-text="All event types"
        :items="[{ label: 'all event types', value: 0 }, ...eventGroups]"
      />
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
      eventsXref: {},
      eventType: "all event groups",
      userGroup: "",
      editEvents: false
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Events", ["events"]),
    ...mapGetters(["adminPermission"]),
    eventGroups() {
      let eventGroups = this.clientInformation?.event_groups;
      return eventGroups?.map(group => {
        return {
          label: group.label,
          value: group._id
        };
      });
    },
    calEvents() {
      let filterEvents = this.eventType.toLowerCase();
      if (this.events.length > 0) {
        let dateFormat = "YYYY-MM-DD hh:mm";
        let events = [...this.events];
        var _events = [];

        for (let i = 0, len = events.length; i < len; i++) {
          let event = events[i];

          if (Object.values(events[i]).length > 0) {
            let firstAssignee = event?.assigned_to?.[0];
            var content = `${firstAssignee?.name ?? "Unassigned"}`;

            if (event?.assigned_to?.length - 1 > 0) {
              content = `${content} +${parseInt(
                event?.assigned_to?.length - 1
              )} others`;
            }
            var eventClass = "";

            if (event?.assigned_to.length == 0) {
              eventClass = "no_assignee";
            }
            if (event?.assigned_to.length == 1) {
              eventClass = "alone";
            }
          }

          if (
            filterEvents != "all event groups" &&
            event?.type.label.toLowerCase() != filterEvents
          ) {
            continue;
          }

          _events.push({
            title: `${event?.type?.label} event`,
            heading: event?.type?.label,
            content,
            start: this.formatDate(event?.start_date, dateFormat),
            end: this.formatDate(event?.end_date, dateFormat),
            is_approved: event?.is_approved,
            assigned_to: event?.assigned_to,
            type: event?.type,
            _id: event._id,
            deleteadble: true,
            notice_period: event?.notice_period,
            created_by: event?.created_by,
            event_index: i,
            ...event
          });
        }
      }
      return _events;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    createEventHere({ date }) {
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
      this.UPDATE_OVERLAY_INDEX({
        display: true,
        overlay: "viewEvent",
        payload: {
          ...this.events[eventIndex],
          event_index: eventIndex
        }
      });
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

.bar_incidator {
  border: 1px solid whitesmoke;
  border-radius: 5px;
  margin-bottom: 40px;
  padding: 20px;
  text-align: center;
}
</style>
