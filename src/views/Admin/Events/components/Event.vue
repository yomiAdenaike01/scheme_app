<template>
  <div
    class="mb-3 event_container rounded shadow"
    :class="{ myEvent: isEventMine }"
    @click="displayMoreDetails = !displayMoreDetails"
  >
    <el-row type="flex">
      <el-col class="event_details_container details_unit p-2">
        <h4 class="member_name">{{ getEventType }}</h4>
        <Popover>
          <div class="content" slot="content">
            {{ assignedUsers.arr.join(", ") }}
          </div>
          <p slot="trigger" class="member_name black">
            {{ assignedUsers.text }}
          </p>
        </Popover>
        <div class="tag_container">
          <el-tag
            class="mr-1"
            v-if="approval.boolean"
            :value="approval.text"
            type="success"
            >{{ approval.text }}</el-tag
          >
          <el-tag v-else effect="dark" type="danger">Not approved</el-tag>

          <el-tag class="capitalize" type="primary">{{ event.timeTag }}</el-tag>
        </div>
      </el-col>

      <el-col
        v-if="$mq == 'lg'"
        :class="['event_times flex details_unit', event.class]"
      >
        <div class="flex_center">
          <span class="date">{{ formattedDates.start }}</span>
          <div class="flex_center columns">
            <i
              style="font-size:1.3em"
              class="el-icon el-icon-right p-0 m-0 grey"
            ></i>
            <span class="time_diff grey"
              >{{ startAndEndTimeDiff }} {{ startEndTimeDiffType }}</span
            >
          </div>
          <span class="date">{{ formattedDates.end }}</span>
        </div>
      </el-col>

      <el-col v-if="$mq == 'lg'" class="flex_center event_controls_wrapper">
        <i
          class="el-icon-arrow-right more_details_indicator"
          :class="{ displayMore: displayMoreDetails }"
        ></i>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <div class="p-2" v-if="displayMoreDetails">
        <el-button
          type="danger"
          plain
          size="small"
          class="w-100"
          @click="deleteEvent"
          >Delete event</el-button
        >
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import employeeMethods from "@/mixins/employeeMethods";
import dates from "@/mixins/dates";
import Dropdown from "@/components/Dropdown";
import ViewEventDialog from "../../Events/components/ViewEventDialog";
import moment from "moment";
import Popover from "@/components/Popover";
export default {
  name: "Event",
  mixins: [employeeMethods, dates],

  data() {
    return {
      viewDetails: false,
      startEndTimeDiffType: "hours",
      displayViewEvent: false,
      displayMoreDetails: false
    };
  },
  props: {
    event: Object
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getGroupName", "getEventAssignedTo"]),
    ...mapState("Admin", ["groupIDs", "teamInformation"]),
    isEventMine() {
      return (
        this.event.assignedTo.some(e => {
          return e == this.userInformation._id;
        }) || this.getIsAdmin
      );
    },

    approval() {
      let approved = this.event.isApproved.admin == 1;
      return {
        boolean: approved,
        text: approved ? "Approved" : "Not Approved"
      };
    },
    eventTypeText() {
      let { type } = this.event;
      return this.eventTypes[type - 1].name;
    },
    assignedUsers() {
      return this.getEventAssignedTo(this.event.assignedTo);
    },

    formattedDates() {
      const format = "dddd DD MMM HH:mm";
      let { startDate, endDate } = this.event;
      return {
        start: moment(startDate).format(format),
        end: moment(endDate).format(format)
      };
    },

    startAndEndTimeDiff() {
      let { startDate, endDate, type } = this.event;

      let diff = this.duration(endDate, startDate).as("hours");
      if (diff > 23) {
        this.startEndTimeDiffType = "days";
      } else if (diff > 100) {
        this.startEndTimeDiffType = "weeks";
      }
      diff = this.duration(endDate, startDate).as(this.startEndTimeDiffType);

      return Math.floor(diff);
    },
    getEventType() {
      return this.getGroupName("event", this.event.type).name;
    },
    getgroupID() {
      return this.convertgroupID(this.event.user);
    }
  },
  methods: {
    ...mapActions(["request"]),
    confirmDeleteEvent() {
      return this.$confirm("Are you sure you want to delete this event ? ");
    },

    async deleteEvent() {
      try {
        let confirmEvent = await this.confirmDeleteEvent();
        let deleteRequest = await this.request({
          method: "DELETE",
          url: "events/delete",
          data: { id: this.event._id }
        });
        await Promise.all([confirmEvent, deleteRequest]);
      } catch (error) {
        return error;
      }
    }
  },
  components: {
    Dropdown,
    ViewEventDialog,
    Popover
  }
};
</script>

<style lang="scss" scoped>
.event_container {
  border-radius: 10px;
  line-height: 2.1em;
  font-weight: 300;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.5;
  &.myEvent {
    opacity: 1;
  }
}

.event_times {
  display: flex;
  justify-content: center;
  align-items: center;
}
.event_details_container {
  min-width: 30%;
  max-width: 40%;
  &/deep/ {
    .el-tag {
      min-width: 100px;
      text-align: center;
    }
  }
}

.details_unit {
  border-right: 1px solid #e6e6e6;
  padding: 0 10px;
}

.approval_wrapper {
  text-transform: uppercase;
  font-size: 0.8em;
}
.event_controls_wrapper {
  width: 10%;
}
.date {
  margin: 0 40px;
}
.approved {
  color: green;
}
.more_details_indicator {
  transition: $default_transition transform;
  will-transform: rotate;
  &.displayMore {
    transform: rotate(90deg);
  }
}

.mobile {
  .event_details_container {
    min-width: 100%;
    line-height: 2.5em;
  }
}
</style>
