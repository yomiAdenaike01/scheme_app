<template>
  <div class="cal_container">
    <SortBy
      v-model="eventType"
      :items="[
        { label: 'adenaike', value: 1 },
        { label: 'yomi', value: 0 }
      ]"
    />
    <VueCal
      ref="eventsCalendar"
      v-loading="loading"
      :events="calEvents"
      :on-event-click="viewEvent"
      events-on-month-view="short"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import VueCal from "vue-cal";
import SortBy from "@/components/SortBy";
import "vue-cal/dist/vuecal.css";
export default {
  name: "EventsCalendar",
  components: {
    VueCal,
    SortBy
  },
  data() {
    return {
      view: false,
      loading: false,
      eventsXref: {},
      eventType: ""
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Events", ["events"]),
    calEvents() {
      if (this.events.length > 0) {
        let dateFormat = "YYYY-MM-DD hh:mm";
        return [...this.events].map(event => {
          if (Object.values(event).length > 0) {
            let firstAssignee = event?.assigned_to?.[0];
            let content = `${firstAssignee?.name ?? "Unassigned"}`;
            if (event?.assigned_to?.length - 1 > 0) {
              content = `${content} +${parseInt(
                event?.assigned_to?.length - 1
              )} others`;
            }
            let eventClass = "";
            if (event?.assigned_to.length == 0) {
              eventClass = "no_assignee";
            }
            if (event?.assigned_to.length == 1) {
              eventClass = "alone";
            }

            return {
              title: `${event?.type?.label} event`,
              heading: event?.type?.label,
              content,
              start: this.formatDate(event?.start_date, dateFormat),
              end: this.formatDate(event?.end_date, dateFormat),
              class: eventClass,
              is_approved: event?.is_approved,
              assigned_to: event?.assigned_to,
              type: event?.type,
              _id: event._id,
              notice_period: event?.notice_period,
              created_by: event?.created_by
            };
          } else {
            return;
          }
        });
      } else {
        return [];
      }
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_SYSTEM_NOTIFICATION", "UPDATE_OVERLAY_INDEX"]),

    viewEvent(event) {
      this.UPDATE_OVERLAY_INDEX({
        view: true,
        overlay: "viewEvent",
        data: event
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cal_filters {
  padding: 10px;
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
      background: #ecf5ff;
      border-top: 2px solid $element_colour;
      border-right: 2px solid white;
      color: $element_colour;
      font-size: 0.8em;
      padding: 1em;
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
