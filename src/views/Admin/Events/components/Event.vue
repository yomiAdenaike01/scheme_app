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
          <div slot="content" class="content">
            {{ assignedUsers.arr.join(", ") }}
          </div>
          <p slot="trigger" class="member_name black">
            {{ assignedUsers.text }}
          </p>
        </Popover>
        <div class="tag_container">
          <el-tag
            v-if="approval.boolean"
            class="mr-1"
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
      <div v-if="displayMoreDetails" class="p-2">
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
import Popover from "@/components/Popover";
import moment from "moment";
export default {
  name: "Event",
  components: {
    Popover
  },
  props: {
    event: Object
  },

  data() {
    return {
      viewDetails: false,
      startEndTimeDiffType: "hours",
      displayViewEvent: false,
      displayMoreDetails: false
    };
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
        start: this.formatDate(startDate, format),
        end: this.formatDate(endDate, format)
      };
    },

    startAndEndTimeDiff() {
      let { startDate, endDate, type } = this.event;

      let diff = moment.duration(endDate, startDate).as("hours");
      if (diff > 23) {
        this.startEndTimeDiffType = "days";
      } else if (diff > 100) {
        this.startEndTimeDiffType = "weeks";
      }
      diff = moment.duration(endDate, startDate).as(this.startEndTimeDiffType);
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
  }
};
</script>

<style lang="scss" scoped>
.event_container {
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 300;
  line-height: 2.1em;
  opacity: 0.5;
  &.myEvent {
    opacity: 1;
  }
}

.event_times {
  align-items: center;
  display: flex;
  justify-content: center;
}
.event_details_container {
  max-width: 40%;
  min-width: 30%;
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
  font-size: 0.8em;
  text-transform: uppercase;
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
    line-height: 2.5em;
    min-width: 100%;
  }
}
</style>
