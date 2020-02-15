<template>
  <div class="mb-3 event_container rounded shadow" :class="{ myEvent: isEventMine }">
    <el-row type="flex">
      <el-col class="event_details_container details_unit p-2">
        <h5 class="member_name">{{ getEventType }}</h5>
        <p class="member_name">{{ assignedToText }}</p>
        <el-tag
          class="mr-1"
          effect="dark"
          size="small"
          v-if="approval.boolean"
          :value="approval.text"
          type="success"
        >{{ approval.text }}</el-tag>
        <el-tag v-else effect="dark" size="small" type="danger">Not approved</el-tag>

        <el-tag effect="dark" size="small" class="capitalize" type="primary">
          {{
          event.timeTag
          }}
        </el-tag>
      </el-col>

      <el-col :class="['event_times flex details_unit', event.class]">
        <div class="flex_center">
          <span class="date">{{ formattedDates.start }}</span>
          <div class="flex_center columns">
            <i style="font-size:1.3em" class="el-icon el-icon-right p-0 m-0 grey"></i>
            <span class="time_diff grey">{{ startAndEndTimeDiff }} {{ startEndTimeDiffType }}</span>
          </div>
          <span class="date">{{ formattedDates.end }}</span>
        </div>
      </el-col>

      <el-col class="flex_center event_controls_wrapper">
        <Dropdown :items="eventActionItems" @method="handleEventActions" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import employeeMethods from "@/mixins/employeeMethods";
import dates from "@/mixins/dates";
import Dropdown from "@/components/Dropdown";
import ViewEventDialog from "../../Events/components/ViewEventDialog";
import moment from "moment";
export default {
  name: "Event",
  mixins: [employeeMethods, dates],

  data() {
    return {
      viewDetails: false,
      startEndTimeDiffType: "hours",
      displayViewEvent: false
    };
  },
  props: {
    event: Object
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapState("Admin", ["groupIDs", "eventTypes", "teamInformation"]),
    isEventMine() {
      return (
        this.event.assignedTo == this.userInformation._id || this.getIsAdmin
      );
    },
    eventActionItems() {
      let actions = [];
      if (
        this.event.assignedTo == this.userInformation._id ||
        this.getIsAdmin
      ) {
        actions.push(
          {
            name: "Update Event",
            command: "update_event"
          },
          {
            name: "Delete Event",
            command: "delete_event"
          }
        );
      } else {
        actions.push({
          name: "View Event",
          command: "view_event"
        });
      }
      return actions;
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
    assignedToText() {
      let { assignedTo } = this.event;
      let assignedToText;
      if (Array.isArray(assignedTo) && assignedTo.length > 1) {
        assignedToText = "Multiple Users";
      } else {
        let foundTeamMember = this.teamInformation.find(member => {
          return member._id == assignedTo[0];
        });
        if (foundTeamMember && foundTeamMember.hasOwnProperty("name")) {
          assignedToText = foundTeamMember.name;
        } else {
          assignedToText = "No team member found";
        }
      }
      return assignedToText;
    },

    formattedDates() {
      const format = "ddd-MM HH:mm";
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
      let type = this.event.type - 1;
      return this.eventTypes[type].name;
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
    handleEventActions(command) {
      switch (command) {
        case "delete_event": {
          this.deleteEvent();
          break;
        }

        case "view_event": {
          this.displayViewEvent = true;
          break;
        }
        case "update_event": {
          this.displayViewEvent = true;
          this.$router.push({ name: "schedule" });

          break;
        }

        default:
          break;
      }
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
    ViewEventDialog
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
  width: 30%;
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
</style>
