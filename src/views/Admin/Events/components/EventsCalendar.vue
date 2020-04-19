<template>
  <div class="cal_container">
    <VueCal
      ref="eventsCalendar"
      v-loading="loading"
      :events="calEvents"
      :on-event-click="viewEvent"
      events-on-month-view="short"
      :cell-click-hold="false"
      editable-events
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
export default {
  name: "EventsCalendar",
  data() {
    return {
      view: false,
      loading: false,
      event: {}
    };
  },

  computed: {
    ...mapState("Admin", ["events", "team", "eventFilters"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),

    calEvents() {
      let dateFormat = "YYYY-MM-DD hh:mm";
      return [...this.events].map(event => {
        let firstAssignee = event.assignedTo[0];
        let content = `${firstAssignee.name}'s ${event.type.label} event`;
        if (event.assignedTo.length - 1 > 0) {
          content = `${content} +${parseInt(
            event.assignedTo.length - 1
          )} others`;
        }

        return {
          title: `${event.type.label} event`,
          content,
          start: this.formatDate(event.startDate, dateFormat),
          end: this.formatDate(event.endDate, dateFormat),
          class: `${event.type.label}`,
          isApproved: event.isApproved,
          assignedTo: event.assignedTo,
          type: event.type,
          _id: event._id
        };
      });
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS", "UPDATE_DIALOG_INDEX"]),

    viewEvent(event) {
      this.UPDATE_DIALOG_INDEX({
        view: true,
        dialog: "viewEvent",
        data: event
      });
    }
  },
  components: {
    VueCal
  }
};
</script>

<style lang="scss" scoped>
.cal_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  max-height: calc(100% - 20px);
  overflow: auto;
  &/deep/ {
    .vuecal__now-line {
      color: $element_colour;
    }

    .vuecal__event {
      background: #ecf5ff;
      border-top: 2px solid $element_colour;
      color: $element_colour;
      font-size: 0.8em;
      padding: 1em;
      text-transform: capitalize;

      &.holiday {
        background: #fef0f0;
        border-top: 2px solid #f56c6c;
        color: #f56c6c;
      }
      &.time_off,
      &.sick_leave {
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
