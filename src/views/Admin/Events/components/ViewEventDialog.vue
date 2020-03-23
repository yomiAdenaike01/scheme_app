<template>
  <el-dialog v-if="getActiveDialog('viewEvent')" :visible.sync="computeDisplay">
    <div class="view_event_dialog p-3">
      <Title
        title="View event"
        subtitle="Click on more information to display details"
      ></Title>
      <div class="info_button_container flex flex--end">
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
          v-if="isEventMine && isEventToday && !hasClockedIn"
          round
          plain
          size="small"
          @click="clockIn"
          >Clock in</el-button
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
      <div class="info_container p-3">
        <!-- Assigned users -->

        <h3 class="mb-3">Assigned users</h3>

        <div
          v-if="hasEntries(event.assignedTo)"
          class="info_unit avatar_wrapper"
        >
          <div
            v-for="(member, index) in event.assignedTo"
            ref="user"
            :key="index"
            :class="[
              'assigned_user_container mb-2 flex align-center',
              { clocked_in: hasClockedIn }
            ]"
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
              >Drop user</el-button
            >
          </div>

          <div v-if="canAddMoreUsers" class="add_new_user p-4 trigger">
            <Popover>
              <div
                v-for="option in getFilteredTeam"
                :key="option._id"
                slot="content"
                class="p-3 popover_item trigger"
                :class="{
                  no_events: event.assignedToIDs.indexOf(option._id) > -1
                }"
                @click="assignNewUser(option._id)"
              >
                <span>{{ option.name }}</span>
              </div>
              <span slot="trigger">
                <i class="bx bx-plus"></i> Assign new user
              </span>
            </Popover>
          </div>
        </div>

        <h3 class="mb-3 mt-3">Event date information</h3>
        <Popover trigger="click">
          <Form
            slot="content"
            :config="configXref"
            submit-text="Update"
            @val="updateEvent"
          />
          <el-button
            slot="trigger"
            size="mini"
            class="mb-2"
            @click="selectedConfig = 'date'"
            >Update date information</el-button
          >
        </Popover>

        <div class="info_unit">
          <span class="info_label">Event start:</span>
          <span>{{ dates.start }}</span>
          <br />
          <span class="info_label">Event end:</span>

          <span>{{ dates.end }}</span>
        </div>
        <h3 class="mt-4 mb-2">Event type & duration</h3>
        <Popover trigger="click">
          <Form
            slot="content"
            :config="configXref"
            submit-text="Update"
            @val="updateEvent"
          />
          <el-button
            slot="trigger"
            size="mini"
            class="mb-2"
            @click="selectedConfig = 'type'"
            >Update event type information</el-button
          >
        </Popover>

        <div class="info_unit">
          <span class="info_label">Event duration:</span>
          <span>{{ duration }} hours</span>
          <br />
          <span class="info_label">Event type:</span>
          <span class="member_name">{{ eventType }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";

import Title from "@/components/Title";
import Avatar from "@/components/Avatar";
import Popover from "@/components/Popover";
import Form from "@/components/Form";

export default {
  name: "ViewEventDialog",
  components: {
    Title,
    Avatar,
    Popover,
    Form
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
    noAssignedUsers() {
      return {
        text:
          "You have encountered a critical server error, to proceed please contact support so that this can be fixed",
        icon: "el-icon-warning-outline",
        buttonText: "Hello"
      };
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
      return this.event.assignedTo.some(event => {
        return this.userInformation._id;
      });
    },
    hasPermissions() {
      return this.getIsAdmin;
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
    ...mapActions([
      "request",
      "genEmail",
      "genPromptBox",
      "closeDialog",
      "genNotification"
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
          .then(response => {
            this.getEvents();
            // Notify user they have been dropped
            this.genNotification({
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
        this.UPDATE_NOTIFICATIONS({
          message:
            "You cannot remove the last user from an event doing so will remove the event, press this notification if you want to do so.",
          title: "Removal warning",
          type: "warning",
          duration: 6000,
          onClick: () => {
            this.deleteEvent();
          }
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
              _id: this.event.id
            }
          })
            .then(response => {
              this.getEvents();
              this.closeDialog("viewEvent");
              this.notifyAssignees();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          return err;
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
        this.genNotification({
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
