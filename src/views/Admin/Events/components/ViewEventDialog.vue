<template>
  <el-dialog
    v-if="getActiveDialog('viewEvent').view"
    :visible.sync="computeDisplay"
  >
    <div class="view_event_dialog ">
      <InformationDisplay
        :display-text="{
          heading: 'View event',
          content: 'Click on more information to display details'
        }"
      ></InformationDisplay>
      <div class="info_button_container">
        <el-button
          :circle="$mq != 'lg'"
          :round="$mq == 'lg'"
          class="no_events"
          :icon="approval.icon"
          size="small"
          :type="approval.type"
          >{{
            approval.type == "success" && $mq == "lg"
              ? "Approved"
              : $mq == "lg" && approval.type != "success"
              ? "Not approved"
              : null
          }}</el-button
        >

        <el-button
          v-if="hasPermissions"
          size="small"
          plain
          round
          @click="sendReminderToUser"
        >
          {{
            event.assignedTo.length > 0
              ? truncate("Remind users of this event", 14)
              : truncate("Remind user of this event")
          }}
        </el-button>
        <el-button
          v-if="hasPermissions"
          type="danger"
          size="small"
          round
          plain
          @click="deleteEvent"
          >Delete Event</el-button
        >
      </div>
      <div class="view_dialog_information_container">
        <!-- Assigned users -->

        <h3>Assigned users</h3>

        <div
          v-if="hasEntries(event.assignedTo)"
          class="info_unit avatar_wrapper"
        >
          <div
            v-for="(member, index) in event.assignedTo"
            ref="user"
            :key="index"
            class="assigned_user_container"
          >
            <Avatar class="mr-3" :name="member" />
            <span v-if="$mq == 'lg'" class="member_name">{{ member }}</span>
          </div>

          <div v-if="canAddMoreUsers" class="add_new_user p-4 trigger">
            <el-popover>
              <div
                v-for="option in getFilteredTeam"
                :key="option._id"
                class="users_container trigger"
                :class="{
                  disabled: event.assignedToIDs.indexOf(option._id) > -1
                }"
                @click="assignNewUser(option._id)"
              >
                <span>{{ option.name }}</span>
              </div>
              <span slot="reference">
                <i class="bx bx-plus"></i> Assign new user
              </span>
            </el-popover>
          </div>
        </div>
        <div class="view_dialog_information_container">
          <h3>Event date information</h3>
          <el-popover trigger="click">
            <Form
              :config="configXref"
              submit-text="Update"
              @val="updateEvent"
            />
            <el-button
              slot="reference"
              size="mini"
              @click="selectedConfig = 'date'"
              >Update date information</el-button
            >
          </el-popover>

          <div class="info_unit">
            <span class="info_label">Event start:</span>
            <span>{{ dates.start }}</span>
            <br />
            <span class="info_label">Event end:</span>

            <span>{{ dates.end }}</span>
          </div>
        </div>
        <div class="view_dialog_information_container">
          <h3>Event type & duration</h3>
          <el-popover trigger="click">
            <Form
              :config="configXref"
              submit-text="Update"
              @val="updateEvent"
            />
            <el-button
              slot="reference"
              size="mini"
              @click="selectedConfig = 'type'"
              >Update event type information</el-button
            >
          </el-popover>

          <div class="info_unit">
            <span class="info_label">Event duration:</span>
            <span>{{ duration }} hours</span>
            <br />
            <span class="info_label">Event type:</span>
            <span class="member_name">{{ eventType }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "ViewEventDialog",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    Avatar: () => import("@/components/Avatar"),
    Form: () => import("@/components/Form")
  },
  data() {
    return {
      loading: false,
      selectedConfig: "date",
      updates: {}
    };
  },
  computed: {
    ...mapState("Admin", ["teamInformation", "eventsInformation"]),
    ...mapState(["userInformation", "dialogIndex"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
    ...mapGetters("Admin", [
      "getEventAssginedTo",
      "getFilteredTeam",
      "getUserInformation",
      "getEnabledEvents"
    ]),

    updateConfigs() {
      return [
        {
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "Start date time",
          model: "startDate",
          optional: true,
          hint: "",
          tag: "date"
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "End date time",
          model: "endDate",
          optional: true,
          hint: "",
          tag: "date"
        },
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getEnabledEvents,
          model: "type",
          validType: "number",
          tag: "type",
          optional: true
        }
      ];
    },
    configXref() {
      return this.updateConfigs.filter(({ tag }) => {
        return tag == this.selectedConfig;
      });
    },

    canAddMoreUsers() {
      return this.event.assignedToIDs.length < this.teamInformation.length;
    },

    event() {
      return this.dialogIndex.viewEvent.data;
    },
    isEventToday() {
      return (
        this.initMoment(this.event.startDate).diff(this.initMoment(), "hours") <
        24
      );
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
      let { assignedToIDs } = this.event;
      assignedToIDs = [...assignedToIDs];
      let assignedToEmails = assignedToIDs.map(assignee => {
        let { email } = this.teamInformation.find(member => {
          return member._id == assignee;
        });
        return { assignee, email };
      });
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
      return this.event?.assignedTo?.some(() => {
        return this.userInformation._id;
      });
    },
    hasPermissions() {
      return this.getIsAdmin;
    },
    computeDisplay: {
      get() {
        return this.getActiveDialog("viewEvent").view;
      },
      set() {
        this.closeDialog("viewEvent");
      }
    }
  },
  methods: {
    ...mapActions([
      "request",
      "genEmail",
      "genPromptBox",
      "closeDialog",
      "getApiNotification"
    ]),
    ...mapActions("Admin", ["getEvents", "updateEvents"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX", "UPDATE_NOTIFICATIONS"]),

    updateEvent(updateInformation) {
      if (Object.values(updateInformation).length > 0) {
        this.loading = true;
        this.updateEvents({ update: updateInformation, id: this.event.id })
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        return this.UPDATE_NOTIFICATIONS({
          type: "error",
          message: "You must add data to the inputs to make changes to an event"
        });
      }
    },

    getOneEmail(id) {
      return this.getEmail.findIndex(assignee => {
        return assignee.id == id;
      }).email;
    },

    // Currently locks database still keeping function for later rework button is hidden
    dropUserFromEvent(userName) {
      // Cannot be the last one
      const newLen = this.event.assignedToIDs.length;
      if (newLen >= 1) {
        let userID = this.getUserInformation(userName, "name")?._id;
        this.request({
          method: "DELETE",
          url: "events/user",
          data: {
            eventID: this.event.id,
            userID
          }
        })
          .then(() => {
            this.getEvents();
            // Notify user they have been dropped
            this.getApiNotification({
              type: "attention",
              title: "Event Update",
              message: "You have been removed from an event",
              for: userID
            });
          })
          .catch(err => {
            return err;
          });
      } else {
        this.genPromptBox({
          boxType: "confirm",
          title: "Confirm",
          text:
            "You cannot remove the last user from an event doing so will remove the event, press this notification if you want to do so",
          confirm: "Yes"
        }).then(() => {
          this.deleteEvent();
        });
      }
    },
    assignNewUser(userID) {
      this.request({
        method: "PUT",
        url: "events/user",
        data: {
          eventID: this.event.id,
          userID
        }
      }).then(() => {
        this.getEvents();
      });
    },
    deleteEvent() {
      this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text: "Are you sure you want to delete this event ?",
        confirm: "Yes"
      }).then(() => {
        this.request({
          method: "DELETE",
          url: "events/delete",
          data: {
            _id: this.event.id
          }
        }).then(() => {
          this.getEvents();
          this.closeDialog("viewEvent");
          this.notifyAssignees();
        });
      });
    },
    notifyAssignees() {
      let assignedToIDs = this.event.assignedToIDs;
      let removalMessage = `You have an event on ${this.dates.start} to ${this.dates.end} has been deleted by ${this.userInformation.name}`;
      this.genEmail({
        subject: "Event removal",
        to: this.getEmail,
        context: {
          body: removalMessage
        }
      });

      for (
        let index = 0, len = assignedToIDs.length;
        index < assignedToIDs.length;
        index++
      ) {
        let assignee = assignedToIDs[i];
        this.getApiNotification({
          type: "attention",
          title: "Event removal",
          for: assignee,
          message: removalMessage
        });
      }
    },
    sendReminderToUser() {
      let contentMessage = `You have an event on ${this.dates.start} to ${this.dates.end}. Sent from ${this.userInformation.name}`;
      let assignedTo = [...this.event.assignedToIDs, this.userInformation._id];
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
      }).then(() => {
        this.getEvents();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.title_button_container {
  text-align: left;
}
.info_button_container {
  display: flex;
  justify-content: center;
  margin: -10px 0 10px 0;
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
  border: 1.2px solid whitesmoke;
  border-radius: 5px;
  margin: 1em;
  max-width: 100%;
  padding: 1em;
  &.no_border {
    border: none;
  }
}
.view_dialog_information_container {
  padding: 20px;
  .el-button {
    margin-bottom: 20px;
  }
}
h4,
h3 {
  margin: 10px 0;
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
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
}
.remove_icon {
  transition: 0.5 ease opacity;
  will-change: opacity;
  opacity: 0;
  visibility: hidden;
}
.assigned_user_container {
  display: flex;
  align-items: center;
  margin: 20px 0;

  &.cloked_in {
    opacity: 0.5;
  }
}
.users_container {
  padding: 10px;
  &:hover {
    background: whitesmoke;
  }
}
.add_new_user {
  border: 2px whitesmoke dashed;
  border-radius: $border_radius;
  padding: 10px;
  &:hover {
    border-color: darken($color: whitesmoke, $amount: 10);
  }
}
</style>
