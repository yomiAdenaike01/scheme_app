<template>
  <Overlay v-model="display">
    <div class="view_event_container">
      <!-- Required actions -->
      <!-- Title -->
      <div class="text_container all_centre">
        <h2>{{ event.title }}</h2>

        <div v-if="isApproved" class="check_container">
          <i class="bx bx-check"></i>
        </div>
      </div>
      <!-- Assigned_to -->
      <div class="text_container all_centre">
        <small class="grey">Right click on team member to remove.</small>
      </div>

      <div class="avatar_container">
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
      <!-- Create new assignee -->
      <el-popover v-model="displayPopover" trigger="click" placement="bottom">
        <div slot="reference" class="add_team_member trigger grey">
          <span><i class="bx bx-plus"></i> Add team member to event</span>
        </div>
        <div
          v-for="member in getFilteredTeam"
          :key="member._id"
          class="assignee"
          :class="{ disabled: isAssigned(member) > -1 }"
          @click="addTeamMember(member)"
        >
          <span>{{ member.name }}</span>
        </div>
      </el-popover>
      <!-- Information -->
      <div class="categories trigger">
        <div
          v-for="(value, key) in informationXref"
          :key="
            Math.random()
              .toString(16)
              .slice(2)
          "
          class="category_container"
          @click="updateKey = key"
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
            v-if="enableUpdates[key]"
            class="plain rounded active"
            @click="updateKey = key"
            >update {{ makePretty(key) }}</s-button
          >
          <collapse-transition mode="out-in">
            <div v-if="updateKey == key" class="form_wrapper">
              <h5>Update information</h5>
              <!-- Update event type -->
              <select
                v-if="key == 'event_type'"
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
                v-else
                :value="[event.start, event.end]"
                type="daterange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                @input="updateDate"
              >
              </el-date-picker>
            </div>
          </collapse-transition>
        </div>
      </div>

      <div
        v-if="displaySave"
        class="save_container trigger"
        @click="updateEvent"
      >
        <s-button class="secondary expanded">
          <p>Save changes</p>
        </s-button>
      </div>
    </div>
  </Overlay>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import Overlay from "@/components/Overlay";
import Avatar from "@/components/Avatar";
import SButton from "@/components/SButton";
import Form from "@/components/Form";
import { CollapseTransition } from "vue2-transitions";
export default {
  name: "ViewEventOverlay",
  components: {
    Overlay,
    Avatar,
    SButton,
    Form,
    CollapseTransition
  },
  data() {
    return {
      event: {},
      displayPopover: false,
      displaySave: false,
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
    isApproved() {
      let res = false;

      return res;
    },

    formConfig() {
      let formConfig = {
        dates: [
          {
            component_type: "date-picker",
            input_type: "date-time-range",
            model: "dates",
            label: "Timings",
            start_placeholder: "Start datetime",
            end_placeholder: "End datetime"
          }
        ],
        event_type: [
          {
            component_type: "select",
            options: this.clientInformation.event_groups,
            model: "type",
            label: "Label"
          }
        ]
      };
      return formConfig[this.updateKey];
    },

    enableUpdates() {
      return {
        dates: true,
        event_type: true
      };
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
          },
          startTimeMinutes: val => {
            return parseInt(val) / 60;
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
  watch: {
    event: {
      deep: true,
      handler(val) {
        console.log(val);
        this.displaySave = true;
      }
    }
  },
  created() {
    this.initEvent();
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    ...mapMutations("Events", ["UPDATE_EVENT"]),
    updateDate(e) {
      this.event.start = e[0];
      this.event.end = e[1];
    },
    updateEventType(e) {
      let eventType = e.target.value;
      this.event.type = this.clientInformation.event_groups.find(x => {
        return x._id == eventType;
      });
    },
    handlePopover(key) {
      this.$set(this.popovers, key, true);
      for (let property in this.popovers) {
        if (property != key) {
          this.$set(this.popovers, property, false);
        }
      }
      this.updateKey = key;
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
            data: { _id: this.event._id },
            method: "DELETE"
          };

          await this.request(apiPayload);
        }
      } catch (error) {
        console.error(error);
      }
    },
    dropTeamMember(e, member) {
      e.preventDefault();

      if (this.assigned.length - 1 > 0) {
        let memberIndex = this.assigned.findIndex(x => {
          return x._id == member._id;
        });
        if (memberIndex > -1) {
          this.event.assigned_to.splice(memberIndex, 1);
        }
      } else {
        this.deleteEvent();
      }
    },
    addTeamMember(member) {
      this.event.assigned_to.push(member);
    },
    initEvent() {
      this.event = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.overlayIndex.viewEvent.payload))
      );
    },
    viewTeamMember(assignee) {
      if (assignee._id != this.userInformation._id) {
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
        // Update local event
        let apiPayload = {
          url: "events/update",
          data: this.event,
          method: "PUT"
        };

        this.UPDATE_EVENT(this.event);
        await this.request(apiPayload);
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
  padding: 10px;
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
.assignee {
  padding: 10px;
  cursor: pointer;
  &:hover {
    background: rgba(var(--colour_secondary), 0.06);
    color: rgba(var(--colour_secondary), 1);
    border-top: 1px solid rgba(var(--colour_secondary), 1);
  }
}
.save_container {
  display: flex;
  flex: 1;
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
  // background: rgba(var(--success), 0.2);
  border: 1.3px solid rgba(var(--success), 1);
  color: rgba(var(--success), 0.7);
}
</style>
