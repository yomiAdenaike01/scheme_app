<template>
  <s-dialog
    v-if="getActiveDialog('viewEvent').view"
    v-model="computeDisplay"
    backdrop-type="dark"
    :display="computeDisplay"
  >
    <div class="view_event_dialog">
      <InformationDisplay
        :display-text="{
          heading: 'View event',
          content: 'Click on more information to display details'
        }"
      ></InformationDisplay>
      <div class="info_button_container">
        <s-button no-trigger shadow colour-scheme="secondary" icon="check">{{
          approvalButtonConfig.content
        }}</s-button>

        <s-button
          v-if="hasPermissions"
          colour-scheme="tertiary"
          icon="x"
          shadow
          @click="deleteEvent('Are you sure you want to delete this event ? ')"
          >Delete Event</s-button
        >
      </div>
      <!-- Required actions -->

      <div
        v-if="userInformation.user_group.enable_event_rejection"
        class="view_dialog_information_container"
      >
        <h3>Actions</h3>
        <!-- Reject event -->
        <div class="info_unit">
          <el-button
            :disabled="notice_periodExceeded"
            round
            class="full_width"
            plain
            @click="rejectEvent"
            >Reject event</el-button
          >
        </div>
      </div>

      <div class="view_dialog_information_container">
        <!-- Assigned users -->

        <h3>Assigned users</h3>

        <div class="info_unit avatar_wrapper">
          <div
            v-if="event.assigned_to.length > 0"
            class="assigned_users_container"
          >
            <div
              v-for="(member, index) in event.assigned_to"
              ref="user"
              :key="index"
            >
              <Avatar
                :size="70"
                class="assigned_user"
                :name="member.name"
                multiple
                @click="viewUser(member)"
              >
                <div class="floating_item" @click="removeUser(member)">x</div>
              </Avatar>
            </div>
          </div>

          <p v-else>There are no users assigned to this event.</p>

          <div v-if="canAddMoreUsers" class="add_new_user trigger">
            <el-popover trigger="click">
              <div
                v-for="option in getFilteredTeam"
                :key="option._id"
                class="users_container trigger"
                :class="{
                  disabled:
                    event.assigned_to.findIndex(assignee => {
                      return assignee._id == option._id;
                    }) > -1
                }"
                @click="assignNewUser(option)"
              >
                <span>{{ option.name }}</span>
              </div>
              <s-button slot="reference" flat>
                <span>Assign new user</span>
              </s-button>
            </el-popover>
          </div>
        </div>
        <div class="view_dialog_information_container">
          <h3>Event date information</h3>
          <el-popover trigger="click">
            <Form
              :config="configXref"
              submit-text="Update"
              class="full_width"
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
              class="full_width"
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
            <span class="member_name">{{ event.type.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </s-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "ViewEventDialog",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    Avatar: () => import("@/components/Avatar"),
    Form: () => import("@/components/Form"),
    SButton: () => import("@/components/SButton"),
    SDialog: () => import("@/components/SDialog")
  },
  data() {
    return {
      loading: false,
      selectedConfig: "date",
      updates: {},
      popover: {
        team: false
      }
    };
  },
  computed: {
    ...mapState("Admin", ["team", "events", "eventRef"]),
    ...mapState(["userInformation", "dialogIndex"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
    ...mapGetters("Admin", ["getFilteredTeam", "getValidEventTypes"]),
    notice_periodExceeded() {
      return this.initMoment(
        this.event?.notice_period ??
          this.initMoment(this.event.start).subtract(1, "days")
      ).isSame(this.initMoment(), "day");
    },
    approvalButtonConfig() {
      let buttonConfig = {
        type: "danger",
        content: "Not approved",
        circle: this.$mq != "lg",
        round: this.$mq == "lg"
      };
      if (this.approval) {
        buttonConfig.type = "success";
        buttonConfig.content = "Approved";
      }
      if (!this.getIsAdmin && this.notice_periodExceeded) {
        buttonConfig.disabled = true;
        buttonConfig.content =
          "You cannot disapprove this event as it is past the notice period";
      }
      return buttonConfig;
    },
    canRejectEvent() {
      return this.userInformation.user_group.enable_event_rejection;
    },
    currentEventIndex() {
      return this.events.findIndex(event => {
        return event._id == this.event._id;
      });
    },
    updateConfigs() {
      return [
        {
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "Start date time",
          model: "start_date",
          optional: true,
          hint: "",
          tag: "date"
        },
        {
          "component-type": "date-picker",
          "input-type": "date-time",
          placeholder: "End date time",
          model: "end_date",
          optional: true,
          hint: "",
          tag: "date"
        },
        {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getValidEventTypes,
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
      return this.event.assigned_to.length < this.team.length;
    },

    event() {
      return this.dialogIndex.viewEvent.data;
    },

    duration() {
      return Math.round(this.event.endTimeMinutes / 60);
    },
    canReject() {
      return (
        this.event.assigned_to.findIndex(assignee => {
          return assignee.user_group.enable_event_rejection == true;
        }) == -1
      );
    },

    approval() {
      // How many users can reject the event
      let canRejectCount = 0,
        hasApprovedCount = 0,
        isCreatorAdmin =
          this.event?.created_by?.user_group?.label.toLowerCase() ===
          "system administrator";
      for (let i = 0, len = this.event.assigned_to; i < len; i++) {
        let assignee = this?.event?.assigned_to[i];
        if (assignee?.user_group?.enabledEventRejection) {
          canRejectCount++;
        }
      }
      for (let i = 0, len = this.event.is_approved; i < len; i++) {
        let assignee = this.event.is_approved[i];
        if (assignee?.user_group?.enable_event_rejection) {
          hasApprovedCount++;
        }
      }
      // If there is a user that can reject an event
      return canRejectCount === hasApprovedCount && isCreatorAdmin;
    },

    dates() {
      let start = this.formatDate(this.event.start_date);
      let end = this.formatDate(this.event.end_date);
      return {
        start,
        end
      };
    },
    isEventMine() {
      return this.event?.assigned_to?.some(() => {
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
    ...mapMutations("Admin", [
      "UPDATE_EVENT",
      "ADD_USER_TO_EVENT",
      "REMOVE_USER_FROM_EVENT",
      "DELETE_EVENT",
      "CREATE_EVENT",
      "UPDATE_APPROVE_EVENT",
      "UPDATE_REJECT_EVENT"
    ]),
    ...mapMutations(["UPDATE_DIALOG_INDEX", "UPDATE_NOTIFICATIONS"]),
    viewUser(user) {
      this.UPDATE_DIALOG_INDEX({
        dialog: "profile",
        data: user
      });
    },
    hasAdminApproved() {
      return this.event.is_approved.find(approvee => {
        return (
          approvee.user_group.label.toLowerCase().trim() ==
          "system administrator"
        );
      });
    },
    approvalController() {
      // only disapprove if you have approved and have
      let canMakeAction = this.canRejectEvent;
    },
    approveEvent() {
      this.UPDATE_APPROVE_EVENT({
        eventIndex: this.currentEventIndex,
        userID: this.userInformation._id
      });
      this.request({
        method: "PUT",
        url: "events/users/approve",
        data: { eventID: this.event._id }
      }).catch(() => {
        this.UPDATE_REJECT_EVENT(this.eventRef);
      });
    },
    rejectEvent() {
      // remove from is_approved array
      this.UPDATE_REJECT_EVENT({
        eventIndex: this.currentEventIndex,
        userID: this.userInformation._id
      });
      this.request({
        method: "DELETE",
        url: "events/user/approve",
        data: { eventID: this.event._id }
      }).catch(() => {
        this.UPDATE_APPROVE_EVENT(this.eventRef);
      });
    },
    updateEvent(update) {
      if (Object.values(update).length > 0) {
        this.UPDATE_EVENT({
          eventIndex: this.currentEventIndex,
          payload: update
        });
        this.request({
          method: "PUT",
          url: "events/update",
          data: { update, _id: this.event._id }
        }).catch(() => {
          this.UPDATE_EVENT(this.eventRef);
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
    removeUser(user) {
      let userIndex = this.event.assigned_to.findIndex(assignee => {
        return assignee._id == user._id;
      });
      if (this.event.assigned_to.length - 1 == 0) {
        this.deleteEvent(
          "This is the last user on the event, if you delete this user it will delete the event. Are you sure you want to delete this event ? "
        );
      } else {
        this.REMOVE_USER_FROM_EVENT({
          eventIndex: this.currentEventIndex,
          userIndex
        });
        this.request({
          method: "DELETE",
          url: "events/user",
          data: { eventID: this.event._id, userID: user._id }
        }).catch(() => {
          this.ADD_USER_TO_EVENT(this.eventRef);
        });
      }
    },
    assignNewUser(user) {
      this.ADD_USER_TO_EVENT({
        eventIndex: this.currentEventIndex,
        payload: user
      });
      this.request({
        url: "events/user",
        data: { eventID: this.event._id, userID: user._id },
        method: "PUT"
      }).catch(() => {
        this.REMOVE_USER_FROM_EVENT(this.eventRef);
      });
    },
    deleteEvent(msg = "Are you sure you want to delete this event ?") {
      this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text: msg,
        confirm: "Yes"
      }).then(() => {
        // Delete event
        this.DELETE_EVENT(this.currentEventIndex);
        this.request({
          method: "DELETE",
          url: "events/delete",
          data: {
            _id: this.event._id
          }
        })
          .then(() => {
            this.notifyAssignees();
          })
          .catch(() => {
            this.CREATE_EVENT({ restore: true, ...this.eventRef });
          });
        this.closeDialog("viewEvent");
      });
    },
    notifyAssignees() {
      let assigned_to = this.event.assigned_to;
      let removalMessage = `You have an event on ${this.dates.start} to ${this.dates.end} has been deleted by ${this.userInformation.name}`;
      this.genEmail({
        subject: "Event removal",
        to: this.getEmail,
        context: {
          body: removalMessage
        }
      });

      for (
        let index = 0, len = assigned_to.length;
        index < assigned_to.length;
        index++
      ) {
        let assignee = assigned_to[i];
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
      let assigned_to = [...this.event.assigned_to, this.userInformation._id];
      this.genEmail({
        subject: "Reminder",
        to: this.getEmail,
        context: {
          body: contentMessage
        },
        notification: {
          type: "reminder",
          title: contentMessage,
          for: assigned_to,
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
.avatar_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.assigned_users_container {
  display: flex;
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

.users_container {
  padding: 10px;
  &:hover {
    background: whitesmoke;
  }
}

.assigned_user {
  .member_name {
    opacity: 0;
    transition: $default_transition opacity;
    will-change: opacity;
    text-align: center;
  }
  .floating_item {
    @include floating_item;
    opacity: 0;
    transition: $default_transition opacity;
    will-change: opacity;
  }
  &:hover {
    .floating_item,
    .member_name {
      opacity: 1;
    }
  }
}
.add_new_user {
  /deep/ .button_container {
    margin: 12px;
  }
}
</style>
