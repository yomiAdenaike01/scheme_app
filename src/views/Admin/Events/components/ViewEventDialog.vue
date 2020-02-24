<template>
  <el-dialog :visible.sync="computeDisplay" v-if="getActiveDialog('viewEvent')">
    <Title title="View event" subtitle="Click on more information to display details"></Title>
    <div class="info_button_container flex flex--end">
      <el-button
        :circle="$mq != 'lg'"
        :round="$mq == 'lg'"
        class="no_events"
        :icon="approval.icon"
        size="small"
        :type="approval.type"
      >{{approval.type == 'success' && $mq == 'lg' ? 'Approved' : $mq == 'lg' && approval.type != 'success' ? 'Not approved' : null}}</el-button>
      <el-button
        round
        plain
        size="small"
        @click="clockIn"
        v-if="isEventMine && isEventToday && !hasClockedIn"
      >Clock In</el-button>

      <el-button v-if="hasPermissions" size="small" plain @click="sendReminderToUser" round>
        {{
        event.assignedTo.length > 0
        ? truncate("Remind users of this event", 14)
        : truncate("Remind user of this event")
        }}
      </el-button>
      <el-button
        type="danger"
        size="small"
        v-if="hasPermissions"
        @click="deleteEvent"
        round
        plain
      >Delete Event</el-button>
    </div>
    <div class="info_container p-3">
      <!-- Assigned users -->

      <h3 class="mb-3">Assigned users</h3>

      <div class="info_unit avatar_wrapper" v-if="hasEntries(event.assignedTo)">
        <div
          ref="user"
          v-for="(member, index) in event.assignedTo"
          :key="index"
          :class="['assigned_user_container mb-2 flex align-center',{clocked_in:hasClockedIn}]"
        >
          <el-button
            v-if="hasClockedIn"
            circle
            icon="el-icon-check"
            type="success"
            class="no_events mr-2"
            size="mini"
          ></el-button>
          <Avatar class="mr-3" :name="member" />
          <span v-if="$mq == 'lg'" class="member_name">{{ member }}</span>
          <el-button
            class="remove_icon ml-4"
            size="mini"
            round
            @click="dropUserFromEvent(member)"
          >Drop user</el-button>
        </div>

        <div class="add_new_user p-4 trigger" v-if="canAddMoreUsers">
          <Popover>
            <div
              class="p-3 popover_item trigger"
              :class="{no_events:event.assignedToRaw.indexOf(option._id) > -1}"
              v-for="option in getFilteredTeam"
              @click="assignNewUser(option._id)"
              :key="option._id"
              slot="content"
            >
              <span>{{option.name}}</span>
            </div>
            <span slot="trigger">
              <i class="bx bx-plus"></i> Assign new user
            </span>
          </Popover>
        </div>
      </div>

      <!-- Assign a user -->
      <div class="no_users" v-else>
        <Nocontent v-bind="noAssignedUsers" />
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
import Popover from "@/components/Popover";
export default {
  name: "ViewEventDialog",
  data() {
    return {
      loading: false
    };
  },

  computed: {
    ...mapState("Admin", ["teamInformation", "eventsInformation"]),
    ...mapState(["userInformation", "dialogIndex"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
    ...mapGetters("Admin", [
      "getEventAssginedTo",
      "getFilteredTeam",
      "getUserInformation"
    ]),
    noAssignedUsers() {
      return {
        text:
          "You have encountered a critical server error, to proceed please contact support so that this can be fixed",
        icon: "el-icon-warning-outline",
        buttonText: "Hello"
      };
    },

    canAddMoreUsers() {
      return this.event.assignedToRaw.length - 1 == this.teamInformation.length;
    },

    event() {
      return this.dialogIndex.viewEvent.data;
    },
    isEventToday() {
      return moment(this.event.startDate).diff(moment(), "hours") < 24;
    },
    hasClockedIn() {
      return this.event.clockedIn.some(assingnee => {
        return assingnee == this.userInformation._id;
      });
    },
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
    isEventMine() {
      return this.event.assignedTo.some(event => {
        return this.userInformation._id;
      });
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
        return this.getActiveDialog("viewEvent");
      },
      set(val) {
        this.closeDialog("viewEvent");
      }
    }
  },
  methods: {
    ...mapActions(["request", "genEmail", "genPromptBox", "closeDialog"]),
    ...mapActions("Admin", ["getEvents"]),

    ...mapMutations(["UPDATE_DIALOG_INDEX"]),

    dropUserFromEvent(userName) {
      // Cannot be the last one
      const newLen = this.event.assignedToRaw.length - 1;
      if (newLen > 1) {
        let userID = this.getUserInformation(userName, "name")._id;
        this.request({
          method: "DELETE",
          url: "events/user",
          data: {
            eventID: this.event.id,
            userID
          }
        })
          .then(response => {
            this.$forceUpdate();
            this.getEvents();
          })
          .catch(err => {
            return err;
          });
      } else {
        this.UPDATE_NOTIFICATIONS({
          message:
            "You cannot remove the last user from an event doing so will remove the event, press this notification if you want to do so.",
          title: "Removal warning",
          type: "warning",
          onClick: () => {
            this.deleteEvent();
          }
        });
      }
    },
    assignNewUser(userID) {
      this.request({
        method: "POST",
        url: "events/user",
        data: {
          eventID: this.event.id,
          userID
        }
      })
        .then(response => {
          this.getEvents();
          return response;
        })
        .catch(err => {
          return err;
        });
    },
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
              this.getEvents();
              this.closeDialog("viewEvent");
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
    },
    clockIn() {
      this.request({
        method: "POST",
        url: "events/clockin",
        data: {
          id: this.event._id,
          user: this.userInformation._id
        }
      })
        .then(response => {
          this.getEvents();
        })
        .catch(err => {
          return err;
        });
    }
  },

  components: {
    Title,
    Dropdown,
    Avatar,
    Popover
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
.remove_icon {
  opacity: 0;
}
.assigned_user_container {
  &:hover {
    .remove_icon {
      opacity: 1;
    }
  }
  &.cloked_in {
    opacity: 0.5;
  }
}
.add_new_user {
  border-radius: $border_radius;
  border: 2px whitesmoke dashed;
}
</style>
