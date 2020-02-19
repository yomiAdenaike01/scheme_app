<template>
  <el-dialog :visible.sync="computeDisplay">
    <Title
      title="View Event"
      subtitle="Click on more information to display details"
    ></Title>
    <div class="info_button_container flex flex--end">
      <el-button
        :circle="$mq == 'lg'"
        class="no_events"
        :icon="approval.icon"
        :type="approval.type"
      ></el-button>
      <el-button
        v-if="hasPermissions"
        size="small"
        type="primary"
        plain
        @click="sendReminderToUser"
        round
        >{{
          event.assignedTo.length > 0
            ? truncate("Remind users of this event", 14)
            : truncate("Remind user of this event")
        }}</el-button
      >
      <el-button
        type="danger"
        size="small"
        v-if="hasPermissions"
        @click="deleteEvent"
        round
        plain
        >Delete Event</el-button
      >
    </div>
    <div class="info_container p-3">
      <h3 class="mb-3">Assigned users</h3>
      <div class="info_unit avatar_wrapper">
        <div
          v-for="(member, index) in event.assignedTo"
          :key="index"
          class="no_events mb-2 flex align-center"
        >
          <Avatar class="mr-3" :name="member"></Avatar>
          <span v-if="$mq == 'lg'" class="member_name">{{ member }}</span>
        </div>
      </div>

      <h3 class="mb-3 mt-3">Event date information</h3>

      <div class="info_unit">
        <span class="info_label">Event start:</span>
        <span>{{ dates.start }}</span>
        <br />
        <span class="info_label">Event end:</span>

        <span>{{ dates.end }}</span>
      </div>
      <h3 class="mt-4 mb-2">Event type & duration</h3>

      <div class="info_unit">
        <span class="info_label">Event duration:</span>
        <span>{{ duration }} hours</span>
        <br />
        <span class="info_label">Event type:</span>
        <span class="member_name">{{ eventType }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";
import moment from "moment";
import Dropdown from "@/components/Dropdown";
import Avatar from "@/components/Avatar";
export default {
  name: "ViewEventDialog",
  data() {
    return {
      loading: false
    };
  },
  props: {
    event: {
      type: Object,
      default: () => {
        return {};
      }
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("Admin", ["teamInformation", "eventsInformation"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getEventAssginedTo"]),
    eventType() {
      return this.event.type;
    },
    duration() {
      return Math.round(this.event.endTimeMinutes / 60);
    },
    approval() {
      let approval = {
        icon: "el-icon-check",
        type: "success"
      };

      if (this.event.isApproved.admin != 1) {
        approval = {
          icon: "el-icon-cross",
          type: "danger"
        };
      }

      return approval;
    },
    getEmail() {
      let { assignedToRaw } = this.event;
      assignedToRaw = [...assignedToRaw];
      let assignedToEmails = assignedToRaw.map(assignee => {
        let { email } = this.teamInformation.find(member => {
          return member._id == assignee;
        });
        return email;
      });
      assignedToEmails.push("adenaikeyomi@gmail.com");
      return assignedToEmails;
    },

    dates() {
      let start = this.formatDate(this.event.startDate);
      let end = this.formatDate(this.event.endDate);
      return {
        start,
        end
      };
    },

    hasPermissions() {
      let result = false;
      if (
        this.userInformation._id == this.event.assignedTo ||
        this.getIsAdmin
      ) {
        result = true;
      }

      if (this.getIsAdmin) {
        result = true;
      }

      return result;
    },
    computeDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  },
  methods: {
    ...mapActions(["request", "genEmail", "genPromptBox"]),

    deleteEvent() {
      this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text: "Are you sure you want to delete this event ?",
        confirm: "Yes"
      })
        .then(response => {
          this.request({
            method: "DELETE",
            url: "events/delete",
            data: {
              id: this.event.id
            }
          })
            .then(response => {
              this.computeDisplay = false;
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          return err;
        });
    },
    sendReminderToUser() {
      let contentMessage = `You have an event on ${this.dates.start} to ${this.dates.end}`;
      let assignedTo = [...this.event.assignedToRaw, this.userInformation._id];

      this.genEmail({
        subject: "Reminder",
        to: this.getEmail,
        context: {
          body: contentMessage
        },
        notification: {
          type: "reminder",
          title: contentMessage,
          for: assignedTo,
          message: contentMessage
        }
      })
        .then(response => {
          return response;
        })
        .catch(err => {
          return err;
        });
    }
  },

  components: {
    Title,
    Dropdown,
    Avatar
  }
};
</script>
<style lang="scss" scoped>
.title_button_container {
  text-align: left;
}
.info_label {
  margin-right: 10px;
}
.info_unit {
  border: $border;
  line-height: 2em;
  padding: 20px;
}
.view_event_dialog_item {
  margin: 1em;
  border: 1.2px solid whitesmoke;
  padding: 1em;
  border-radius: 5px;
  max-width: 100%;
  &.no_border {
    border: none;
  }
}
h4 {
  margin-bottom: 10px;
}
.view_event_col {
  margin: 1em;
}

.mobile {
  .info_button_container {
    flex-direction: column;
    &/deep/ > * {
      margin: 10px 0;
    }
    .avatar_wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
