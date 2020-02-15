<template>
  <el-dialog :visible.sync="computeDisplay">
    <Title title="View Event" subtitle="Click on more information to display details">
      <MoreInformation index="admin" instruction="view_event" />
    </Title>
    <el-row type="flex" v-loading="loading">
      <!-- FIRST COLUMN -->

      <el-col class="view_event_col">
        <!-- Assigned to (tags)-->
        <div class="view_event_dialog_item">
          <h4>Assigned to</h4>
          <el-tag
            class="m-1"
            type="info"
            :closable="computeRemoveEvent.canDelete"
            v-for="(teamMember, index) in renderAssignedTo"
            :key="index"
            @close="removeTeamMemberFromEvent(teamMember)"
            :id="teamMember['id']"
          >{{ teamMember["name"] }}</el-tag>
        </div>
        <!-- Event type -->

        <el-col class="view_event_dialog_item">
          <h4>Event / Event type</h4>

          <!-- Conditional drop down to change the event type (if yours) -->
          <Dropdown
            :icon="false"
            v-if="computeRemoveEvent.canDelete"
            :items="returnEventTypes(event.type, 'command')"
            @method="handleChangetype"
            position="right"
          >
            <el-button round size="small">{{ event.type }}</el-button>
          </Dropdown>

          <el-button
            round
            v-else
            size="small"
            :type="renderButtonTypes.type"
          >{{ renderButtonTypes.type.text }}</el-button>
        </el-col>

        <!-- Approval -->
        <el-col class="view_event_dialog_item">
          <h4>Event / Event approval</h4>
          <el-button
            circle
            :icon="renderButtonTypes.approval.icon"
            :type="renderButtonTypes.approval.type"
          ></el-button>
        </el-col>
      </el-col>

      <!-- SECOND COLUMN -->
      <el-col class="view_event_col">
        <!-- Date content-->

        <div class="view_event_dialog_item">
          <h4>Start date</h4>
          <p class="mb-2">{{ renderDateContent.start }}</p>
        </div>
        <div class="view_event_dialog_item">
          <h4>End date</h4>
          <p>{{ renderDateContent.end }}</p>
        </div>
      </el-col>
    </el-row>
    <div class="view_event_dialog_item no_border flex_center">
      <!-- Edit event button -->
      <!-- <el-button
        class="flex-1"
        
        v-if="computeRemoveEvent.canDrop || computeRemoveEvent.canDelete"
        >Edit event</el-button
      >-->
      <!-- Remove event or delete event button -->
      <el-button
        plain
        type="danger"
        class="flex-1"
        @click="renderDeleteButtonContent['method']"
      >{{ renderDeleteButtonContent["text"] }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";
import MoreInformation from "@/components/MoreInformation";
import moment from "moment";
import Dropdown from "@/components/Dropdown";
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
    ...mapState("Admin", ["teamInformation"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),

    computeDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    },
    renderButtonTypes() {
      let { type } = this.event;
      let isApproved = this.returnIsApproved;
      let buttonContent = {
        type: {
          type: "",
          text: ""
        },
        approval: {
          type: "danger",
          icon: "el-icon-close"
        }
      };

      if (isApproved) {
        buttonContent["approval"] = {
          type: "success",
          icon: "el-icon-check"
        };
      }

      switch (type) {
        case 4: {
          buttonContent["type"] = {
            type: "info",
            text: "Time Off"
          };
          break;
        }

        case 1: {
          buttonContent["type"] = {
            type: "primary",
            text: "Normal Event"
          };
          break;
        }

        case 3: {
          buttonContent["type"] = {
            type: "warning",
            text: "Holiday"
          };
          break;
        }

        case 5: {
          buttonContent["type"] = {
            type: "success",
            text: "Sick Leave"
          };
          break;
        }

        case 2: {
          buttonContent["type"] = {
            type: "plain",
            text: "Locumn"
          };
        }

        default: {
          break;
        }
      }
      return buttonContent;
    },
    returnIsApproved() {
      let { admin } = this.event.isApproved;
      let approved = false;
      if (admin == 1) {
        approved = true;
      }
      return approved;
    },

    renderDateContent() {
      let { startDate, endDate } = this.event;
      const format = "DD/MM/YYYY HH:mm";
      startDate = moment(startDate).format(format);
      endDate = moment(endDate).format(format);
      return {
        start: startDate,
        end: endDate
      };
    },

    // Render the content of the button when a user can remove or drop of a event

    renderDeleteButtonContent() {
      let { canDelete, canDrop } = this.computeRemoveEvent;
      let buttonContent = {
        text: "",
        method: ""
      };
      if (canDelete) {
        buttonContent.method = () => {
          this.loading = true;
          this.deleteEvent(this.returnEventID);
          this.loading = false;
          this.closeDialog();
        };
        buttonContent.text = "Delete event";
      }
      return buttonContent;
    },

    computeRemoveEvent() {
      let eventRemoval = {
        canDelete: false,
        canDrop: false
      };

      let { name } = this.userInformation;
      let { is_pickup } = this.event;
      let foundUser;

      name = name.trim().toLowerCase();

      let { assignedTo } = this.event;

      if (Array.isArray(this.event)) {
        foundUser = assignedTo.find((assignee, index) => {
          return assignee._id == this.teamInformation[index]._id;
        });
      }

      if (foundUser) {
        foundUser["name"] = foundUser["name"].toLowerCase();
      }

      if (this.getIsAdmin) {
        eventRemoval["canDelete"] = true;
      } else if (foundUser.name == name) {
        eventRemoval["canDelete"] = true;

        if (is_pickup) {
          eventRemoval["canDrop"] = true;
        }
      }
      return eventRemoval;
    },
    renderAssignedTo() {
      let { assignedTo } = this.event;
      let team = this.teamInformation;
      let mappedTeamMemberNames;

      // Loop assigned to and replace them with names

      const len = assignedTo.length;
      mappedTeamMemberNames = [];
      // Return the team member names if its an array

      for (let i = 0; i < len; i++) {
        let assignedTeamMember = assignedTo[i];
        const teamLen = team.length;

        for (let j = 0; j < teamLen; j++) {
          let teamMember = team[j];
          let teamMemberID = teamMember._id;

          if (
            assignedTeamMember &&
            teamMemberID &&
            assignedTeamMember == teamMemberID
          ) {
            mappedTeamMemberNames.push({
              name: teamMember["name"],
              id: teamMemberID
            });
          }
        }
      }

      return mappedTeamMemberNames;
    },

    returnEventID() {
      return this.event.id;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["deleteEvent", "updateEvent"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),

    closeDialog() {
      this.$nextTick(() => {
        this.loading = false;
        this.$emit("toggle", false);
        this.$emit("refreshEvent", null);
      });
    },

    // Just update the event without their name
    async removeTeamMemberFromEvent({ name, id }) {
      // Confirm that this is what they want
      try {
        let confirmEventPrompt = {
          message: `Are you sure that you want to remove ${name} from this event ?`,
          title: "Confirm Update"
        };

        let response = await this.confirmEventChanges(confirmEventPrompt);

        let eventTeamMembers = [];

        const len = this.renderAssignedTo.length;

        for (let i = 0; i < len; i++) {
          let teamMemberAssignedToEvent = this.renderAssignedTo[i];

          teamMemberAssignedToEvent = teamMemberAssignedToEvent["id"];

          if (teamMemberAssignedToEvent == id) {
            continue;
          }

          eventTeamMembers.push(teamMemberAssignedToEvent);
        }

        if (response == "confirm") {
          this.loading = true;
          await this.updateEvent({
            update: { assignedTo: eventTeamMembers },
            id: this.returnEventID
          });

          this.closeDialog();
        }
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    /**
     * For deletion: (NOT DONE YET)
     *   "Are you sure you want to delete the event/event ?",
        "Delete Confirmation"
     */
    async confirmEventChanges({ message, title }) {
      return await this.$confirm(message, title);
    },

    // View the user that the event is assigned to
    toggleViewTeamMember() {
      this.UPDATE_VIEW_TEAM_MEMBER({ view: true, id: this.event.assignedTo });
    },
    async handleChangetype(type) {
      this.loading = true;
      await this.updateEvent({
        id: this.returnEventID,
        update: { type }
      });
      this.loading = false;
      this.closeDialog();
    }
  },

  components: {
    Title,
    MoreInformation,
    Dropdown
  }
};
</script>
<style lang="scss" scoped>
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
</style>
