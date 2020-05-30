<template>
  <Overlay v-model="display">
    <div class="view_event_container">
      <!-- Approval -->
      <div class="text_container all_centre">
        <div v-if="isApproved" class="check_container">
          <i class="bx bx-check"></i>
        </div>
        <!-- Title -->
        <h2>{{ event.type.label }}</h2>
      </div>
      <!-- Qr code -->
      <div v-if="beforeStart" class="qr_container text_container all_centre">
        <small class="grey">Scan with our companion app to clock in</small>
        <qrcode-vue :value="event._id" level="H"></qrcode-vue>
        <s-button
          icon="printer"
          class="mini rounded primary"
          @click="printQRCode"
          >Print QR code</s-button
        >
      </div>
      <!-- Assigned_to -->
      <div v-if="adminPermission" class="text_container all_centre">
        <small class="grey">Right click on team member to remove.</small>
      </div>

      <div v-if="assigned.length > 0" class="avatar_container">
        <Avatar
          v-for="assignee in assigned"
          :key="assignee._id"
          :name="assignee.name"
          :size="70"
          group
          @click.native="viewTeamMember(assignee)"
          @contextmenu.native="dropTeamMember($event, assignee)"
        />
      </div>
      <!-- If no assignees -->
      <p v-else class="grey text_container all_centre">
        No team members assigned
      </p>
      <!-- Create new assignee -->
      <el-popover
        v-if="adminPermission"
        v-model="displayPopover"
        trigger="click"
        placement="bottom"
      >
        <div slot="reference" class="add_team_member trigger grey">
          <span><i class="bx bx-plus"></i> Add team member to event</span>
        </div>
        <div
          v-for="member in getFilteredTeam"
          :key="member._id"
          class="popover_item"
          :class="{ disabled: isAssigned(member) > -1 }"
          @click="addTeamMember(member)"
        >
          <span>{{ member.name }}</span>
        </div>
      </el-popover>
      <!-- Information -->
      <div class="categories">
        <div
          v-for="(value, key) in informationXref"
          :key="
            Math.random()
              .toString(16)
              .slice(2)
          "
          class="category_container"
        >
          <span class="capitalize grey">{{ makePretty(key) }}</span>
          <p
            v-for="(method, eventKey) in value"
            :key="eventKey"
            class="capitalize"
          >
            {{ langXref[eventKey] ? langXref[eventKey] : makePretty(eventKey) }}
            :
            {{ method(event[eventKey]) }}
          </p>
          <s-button
            v-if="enableUpdates.indexOf(key) > -1 && adminPermission"
            class="plain rounded active"
            @click="updateKeyValue(key)"
            >update {{ makePretty(key) }}</s-button
          >
          <div
            v-if="
              adminPermission &&
                updateKey == key &&
                enableUpdates.indexOf(key) > -1
            "
            class="form_wrapper"
          >
            <h5>Update information</h5>
            <!-- Update event type -->
            <select
              v-if="updateKey == 'event_type'"
              class="s_input"
              :value="event.type._id"
              @input="updateEventType"
            >
              <option
                v-for="option in clientInformation.event_groups"
                :key="option._id"
                :value="option._id"
                >{{ option.label }}</option
              >
            </select>
            <!-- date picker -->
            <el-date-picker
              v-if="updateKey == 'dates'"
              :value="[event.start, event.end]"
              type="daterange"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              @input="updateDate"
            >
            </el-date-picker>
          </div>
        </div>
      </div>

      <div class="button_container">
        <s-button
          v-if="adminPermission"
          class="secondary expanded"
          @click="updateEvent"
        >
          <p>Save changes</p>
        </s-button>
      </div>
      <s-button v-if="canReject" class="primary expanded" @click="rejectEvent">
        <p>Reject</p>
      </s-button>
      <s-button
        v-if="adminPermission && beforeStart"
        class="primary expanded"
        @click="deleteEvent"
      >
        <p>Delete</p>
      </s-button>
    </div>
  </Overlay>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import Overlay from "@/components/Overlay";
import Avatar from "@/components/Avatar";
import SButton from "@/components/SButton";
import Form from "@/components/Form";
import QrcodeVue from "qrcode.vue";

export default {
  name: "ViewEventOverlay",
  components: {
    Overlay,
    Avatar,
    SButton,
    Form,
    QrcodeVue
  },
  data() {
    return {
      event: {},
      displayPopover: false,
      updateKey: "",
      popovers: {
        event_type: false,
        dates: false
      }
    };
  },
  computed: {
    ...mapState("Team", ["team"]),
    ...mapState(["userInformation", "overlayIndex", "clientInformation"]),
    ...mapGetters(["adminPermission"]),
    ...mapGetters("Team", ["getFilteredTeam"]),
    propertiesToEdit() {
      return ["assigned_to", "start", "end"];
    },
    beforeStart() {
      return this.initMoment(new Date()).isBefore(this.event.start);
    },
    updateApiPayload() {
      let update = {
        assigned_to: this.depopulatedAssigned,
        type: this.event.type._id,
        start_date: new Date(this.event.start).toISOString(),
        end_date: new Date(this.event.end).toISOString()
      };

      return {
        url: "events/update",
        method: "PUT",
        data: update
      };
    },
    depopulatedAssigned() {
      return this.assigned.map(e => {
        return e._id;
      });
    },
    loaded() {
      return Object.values(this.event).length > 0;
    },

    isApproved() {
      return this.event.created_by.user_group.is_admin;
    },

    currentUserIndex() {
      return this.assigned.findIndex(x => {
        return this.userInformation._id == x._id;
      });
    },

    canReject() {
      // Can reject is within the assigned to and can reject events
      // Can also reject is the start date hasnt already
      let canReject = this.userInformation.user_group.enable_event_rejection;
      let assigned = this.currentUserIndex > -1;

      return canReject && assigned && this.beforeStart && !this.adminPermission;
    },

    enableUpdates() {
      return ["dates", "event_type"];
    },
    langXref() {
      return {
        startTimeMinutes: "Hours"
      };
    },

    informationXref() {
      return {
        dates: {
          start: val => {
            return this.formatDate(val);
          },
          end: val => {
            return this.formatDate(val);
          }
        },
        event_type: {
          type: val => {
            return val.label;
          }
        },
        created_by: {
          created_by: val => {
            return val.name;
          }
        }
      };
    },
    assigned() {
      return this.event.assigned_to;
    },
    viewEvent() {
      return this.overlayIndex.viewEvent;
    },

    index() {
      return this.event.event_index;
    },

    display: {
      get() {
        return this.viewEvent.display;
      },
      set() {
        this.UPDATE_OVERLAY_INDEX({
          overlay: "viewEvent",
          display: false
        });
      }
    }
  },

  created() {
    this.initEvent();
  },

  methods: {
    ...mapActions(["request", "notify"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    ...mapMutations("Events", ["UPDATE_EVENT", "DELETE_EVENT"]),
    async rejectEvent() {
      try {
        // api payload
        let apiPayload = {
          methods: "DELETE",
          url: "events/user/delete",
          data: { event_id: this.event._id, user_id: this.userInformation._id }
        };
        // remove their name from the array
        this.event.assigned_to.splice(this.currentUserIndex, 1);

        // notify the admin who created that you have rejected it
        const rejectMessage = `${this.userInformation.name} has rejected a ${this.event.type.label} event`;
        const forUsers = [this.event.created_by._id];

        this.createNotification(rejectMessage, forUsers);

        // Remove user from the assigned to
        this.event.assigned_to.splice(this.currentUserIndex, 1);
        await this.request(apiPayload);
      } catch (error) {
        console.error(error);
      }
    },
    updateKeyValue(key) {
      if (this.enableUpdates.indexOf(key) > -1) {
        if (this.updateKey == key) {
          this.updateKey = "";
        } else {
          this.updateKey = key;
        }
      }
    },
    updateDate(e) {
      this.event.start = e[0];
      this.event.end = e[1];
      this.updateKey = "";
    },
    updateEventType(e) {
      let eventType = e.target.value;
      this.event.type = this.clientInformation.event_groups.find(x => {
        return x._id == eventType;
      });
      this.updateKey = "";
    },
    closeOverlay() {
      this.display = false;
    },

    isAssigned(member) {
      return this.assigned.findIndex(x => {
        return x._id == member._id;
      });
    },
    async deleteEvent() {
      try {
        let confirm = await this.$confirm(
          "Are you sure you want to delete this event",
          "Delete event"
        );

        if (confirm) {
          this.DELETE_EVENT(this.index);

          let apiPayload = {
            url: "events/delete",
            data: { event_id: this.event._id },
            method: "DELETE"
          };
          let notificationMessage = `
          A ${this.event.type.label} event has been deleted
          `;

          this.createNotification(
            notificationMessage,
            this.depopulatedAssigned
          );

          await this.request(apiPayload);
          this.closeOverlay();
        }
      } catch (error) {
        console.error(error);
      }
    },
    dropTeamMember(e, member) {
      e.preventDefault();
      if (this.adminPermission) {
        if (this.assigned.length - 1 > 0) {
          let memberIndex = this.assigned.findIndex(x => {
            return x._id == member._id;
          });
          if (memberIndex > -1) {
            // mark as deleted
            this.event.assigned_to.splice(memberIndex, 1);
          }
        } else {
          this.deleteEvent();
        }
      }
    },
    addTeamMember(member) {
      this.event.assigned_to.push(member);
      this.displayPopover = false;
    },
    initEvent() {
      this.event = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.overlayIndex.viewEvent.payload))
      );
    },
    viewTeamMember(assignee) {
      if (assignee._id != this.userInformation._id && this.adminPermission) {
        this.display = false;
        this.$router.push({
          name: "team",
          params: {
            teamMember: assignee.name
          }
        });
      }
    },
    printQRCode() {
      window.print();
    },
    async updateEvent() {
      try {
        // Send notififcation to new assignees
        this.handleNewAssignees();
        let updateEventPayload = {};
        // check what has changed and whether it is in the scope of properties that are allowed to be changed
        for (let property in this.viewEvent.payload) {
          if (this.propertiesToEdit.indexOf(property) > -1) {
            if (this.viewEvent.payload[property] != this.event[property]) {
              updateEventPayload[property] = this.event[property];
            }
          }
        }
        return console.log(updateEventPayload);

        this.UPDATE_EVENT(updateEventPayload);
        await this.request(this.updateApiPayload);
      } catch (error) {
        console.error(error);
      }
    },
    async createNotification(message, forUsers) {
      try {
        await this.notify({
          payload: { event_id: this.event._id },
          type: "event",
          for: forUsers,
          message
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async handleNewAssignees() {
      try {
        let newAssignees = [];

        // Find out who is new
        let origAssigned = this.overlayIndex.viewEvent.payload.assigned_to;
        // if they are not in the original assigned then they are new
        for (let i = 0, len = this.assigned.length; i < len; i++) {
          let assignee = this.assigned[i];
          let assigneeID = assignee._id;

          for (let j = 0, jlen = origAssigned.length; j < jlen; j++) {
            let origAssignee = origAssigned[j];
            let origAssigneeID = origAssignee._id;

            if (origAssigneeID != assigneeID) {
              newAssignees.push(assigneeID);
            }
          }
        }
        // Create notification for each person
        if (newAssignees.length > 0) {
          await this.createNotification(
            "You have been assigned to a new event",
            newAssignees
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.view_event_container {
  overflow-x: hidden;
  position: relative;
}
.avatar_container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.text_container {
  margin: 10px;
  padding: 10px;
}
.add_team_member {
  border: $border;
  padding: 10px;
  text-align: center;
  margin-top: 20px;
}
.qr_container > * {
  margin: 20px 0;
}
.category_container {
  border: $border;
  margin: 10px;
  padding: 10px 20px;
  border-radius: 3px;
}
.form_wrapper {
  margin: 20px 0;
  padding: 10px;
  flex: 1;
}
.check_container {
  border-radius: 50%;
  margin: 20px;
  border: $border;
  font-size: 2.3em;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: rgba(var(--success), 0.2);
  border: 1.3px solid rgba(var(--success), 1);
  color: rgba(var(--success), 0.7);
}
</style>
