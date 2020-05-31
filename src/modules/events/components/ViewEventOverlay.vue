<template>
  <Overlay v-model="display">
    <div class="view_event_container">
      <!-- Approval -->
      <div class="header_container text_container all_centre">
        <!-- Pin code -->
        <div  v-if="currentUserIndex > -1 || adminPermission" class="pins_container">
          <input
          v-for="(digit,digitIndex) in event.clock_in_code"
          :key="digit"
            v-model="pinCode[digitIndex]"
            :disabled="isCorrectCode || adminPermission"
            type="text"
            :placeholder="adminPermission ? digit : ''"
            maxlength="1"
            class="pin"
          >
          </div>
      
          <fade-transition>
          <s-button v-if="isCorrectCode" icon="check" class="secondary rounded mini no_cap" @click="clockIn">Pin is correct click to clock in</s-button>
          </fade-transition>
        </div>
     
      </div>

      <!-- Assigned_to -->
      <div v-if="adminPermission" class="text_container all_centre">
        <h2>{{ event.type.label }}</h2>

        <small class="grey">Right click on team member to remove.</small>
      </div>

      <div v-if="assigned.length > 0" class="avatar_container">
        <Avatar
          v-for="assignee in assigned"
          :key="assignee._id"
          :name="assignee.name"
          :title="hasClockedIn(assignee) ? 'Clocked in' : 'Not clocked in'"
          :size="70"
          :group="assigned.length > 1"
          @click.native="viewTeamMember(assignee)"
          @contextmenu.native="dropTeamMember($event, assignee)"
        >
            <i :class="[`clock_in_indicator bx bx-${hasClockedIn(assignee) ? 'check' : 'x'}`,{clocked_in:hasClockedIn(assignee)}]"></i>
        </Avatar>
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
import { FadeTransition } from "vue2-transitions";
import cleanObject from "@/mixins/cleanObject"
export default {
  name: "ViewEventOverlay",
  components: {
    Overlay,
    Avatar,
    SButton,
    Form,
    FadeTransition
  },
  mixins:[cleanObject],
  data() {
    return {
      event: {},
      displayPopover: false,
      displayEnterPin: false,
      updateKey: "",
      pinCode:{},
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
 
    isCorrectCode(){
      let enteredCode = Object.values(this.pinCode);
      return this.event.clock_in_code == enteredCode.join('')
    },
    canClockIn() {
      // can clock in 30 minutes before the event
      // is now 30 minutes before the event
      let timeCapBefore = this.initMoment(new Date()).subtract(30, "minutes");
      let momentStart = this.initMoment(this.event.start);
      return momentStart.isBefore(timeCapBefore);
    },
    propertiesToEdit() {
      let clearedProperties = this.cleanObject(["assigned_to", "start", "end",'type'],this.event,true);
  
     let dateFunc = (val) => {
return new Date(val).toISOString();
}
     let xref = {
       assigned_to:()=>{
         return this.depopulatedAssigned
       },
       start:dateFunc,
       end:dateFunc,
       type:(val)=>{
         return val._id
       }
     }
     for(let property in xref){
       clearedProperties[property] = xref[property](this.event[property])
     }
     
     return clearedProperties;
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
  destroyed(){
    clearInterval(this.durationInterval);
  },
  created() {
    this.initEvent();
  },

  methods: {
    ...mapActions(["request", "notify"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    ...mapMutations("Events", ["UPDATE_EVENT", "DELETE_EVENT"]),
    hasClockedIn(assginee) {
      return this.event.clocked_in.findIndex(x=>x._id == assginee._id) > -1;
    },
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
    async clockIn(){
      // push user to clock in
      let user = this.userInformation;
      this.event.clocked_in.push({_id:user._id,name:user.name})
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
.header_container{
  margin:40px 0;
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
  border: $border;
  font-size: 2.3em;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.3px solid rgba(var(--success), 1);
  color: rgba(var(--success), 0.7);
}

.pins_container {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.pin {
  border-radius: 10px;
  max-width: 50px;
  text-align: center;
  border: 2px solid rgb(220, 220, 220);
  padding: 10px;
  font-size: 2em;
  margin: 0 5px;
}
.clock_in_indicator{
  position: absolute;
  bottom:-3px;
  right:-10px;
  font-size: .9em;
  background:rgba(var(--danger), 1);
  
  &.clocked_in{
  background:rgba(var(--success), 1);
  }
  border-radius: 50%;
  border:3px  solid white;
}
</style>
