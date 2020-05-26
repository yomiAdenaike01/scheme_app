<template>
  <div class="team_container">
    <TeamMembers
      v-if="team.length > 0"
      :team-members="groupedTeamMembers"
      :selected="selectedTeamMember"
      :has-permission="hasPermission"
      @selected="setTeamMember($event.member, $event.index)"
      @search="searchTeamMemberName = $event"
      @view="
        mode = $event.mode;
        displayOverlay = $event.displayOverlay;
      "
    />

    <div class="view_team_member">
      <Menu
        mode="tabs"
        :tab-items="tabItems"
        :active-tab="selectedTab"
        @changeTab="selectedTab = $event"
      />
      <!-- Related events -->
      <div
        v-if="selectedTab == 'events_timeline'"
        class="tab_content_container"
      >
        <div
          v-if="relatedEvents.length == 0"
          class="grey no_related_events text_container all_centre"
        >
          <i class="bx bx-calendar large_icon"></i>
          <h2>
            {{
              isCurrentUser
                ? "You have no events assigned to you"
                : "No events for this user"
            }}
          </h2>
        </div>
        <div v-else>
          <input
            v-model="filters.userGroup"
            type="text"
            placeholder="Filter by event type"
            class="s_input no_border_radius"
          />

          <!-- Related events -->
          <RelatedEvent
            v-for="event in relatedEvents"
            :key="event._id"
            :event="event"
          />
        </div>
      </div>
      <!-- Anayltics -->
      <Analytics
        v-if="selectedTab == 'analytics'"
        :selected-team-member="selectedTeamMember"
      />
    </div>
    <!-- View the user details -->
    <div
      v-if="Object.values(selectedTeamMember).length > 0"
      class="user_sidebar"
    >
      <Avatar :name="selectedTeamMember.name" :size="80" />
      <h3>{{ selectedTeamMember.name }}</h3>
      <small class="grey">{{ selectedTeamMember.user_group.label }}</small>
      <small class="grey">{{ selectedTeamMember.email }}</small>

      <div class="shortcuts_container">
        <el-popover
          v-for="(shortcut, index) in shortcuts"
          :key="index"
          trigger="hover"
          placement="top"
        >
          <i
            slot="reference"
            :class="`bx bx${shortcut.icon}`"
            :style="{ backgroundColor: shortcut.bg }"
            @click="shortcut.click"
          ></i>
          <div class="text_container all_centre">
            <strong class="capitalize">{{ shortcut.label }}</strong>
          </div>
        </el-popover>
      </div>

      <hr />
      <!-- Activity log -->
      <div
        v-loading="activityLoading"
        class="activity_wrapper"
        :class="{ display_center: selectedUserActivity.length == 0 }"
      >
        <div
          v-if="selectedUserActivity.length > 0"
          v-loading="loading"
          class="activity_subcontainer"
        >
          <div class="title_bar">
            <h3>Activity feed</h3>
            <i class="bx bx-x-circle trigger" @click="deleteActivityLog"></i>
          </div>
          <ActivityLog
            v-for="activity in selectedUserActivity"
            :key="activity._id"
            :activity="activity"
            :date-created="initMoment(activity.date_created).calendar()"
          />
        </div>
        <div v-else class="text_container all_centre">
          <h3>No recent activity found</h3>
        </div>
      </div>
      <TeamOverlay
        :mode="mode"
        :display-overlay="displayOverlay"
        :selected-team-member="selectedTeamMember"
        @close="displayOverlay = false"
        @clearSearch="clearSearch"
        @handleTeamMember="handleTeamMember"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import Analytics from "./components/Analytics";
import TeamOverlay from "./components/TeamOverlay";
import TeamMembers from "./components/TeamMembers";
import RelatedEvent from "./components/RelatedEvent";
import ActivityLog from "./components/ActivityLog";

import genID from "@/mixins/genID";

import Avatar from "@/components/Avatar";
import OnlineIndicator from "@/components/OnlineIndicator";
import Menu from "@/components/Menu";
import SButton from "@/components/SButton";

export default {
  name: "Team",
  components: {
    Avatar,
    OnlineIndicator,
    Menu,
    SButton,
    Analytics,
    RelatedEvent,
    ActivityLog,
    TeamMembers,
    TeamOverlay
  },
  mixins: [genID],
  data() {
    return {
      displayOverlay: false,
      mode: "create",
      searchTeamMemberName: "",
      viewUser: false,
      selectedTab: "events_timeline",
      selectedTeamMember: {},
      inputtedTeamMemberData: {},
      selectedTeamMemberIndex: 0,
      selectedUserActivity: [],
      loading: false,
      activityLoading: false,
      filters: {
        userGroup: ""
      }
    };
  },

  computed: {
    ...mapState(["colours", "theme", "userInformation", "clientInformation"]),
    ...mapState("Team", ["team"]),
    ...mapState("Events", ["events"]),
    ...mapGetters("Team", ["getFilteredTeam"]),
    ...mapGetters(["adminPermission", "groupLookup"]),

    shortcuts() {
      let condition = !this.isCurrentUser;

      let shortcuts = [
        {
          icon: "-question-mark",
          condition,
          label: "Requests",

          click: () => {
            this.$router.push({
              name: "events",
              params: {
                view: "requests",
                teamMember: this.selectedTeamMember
              }
            });
          }
        },
        {
          icon: "-cog",
          condition: this.hasPermission,
          label: "settings",

          click: () => {
            this.displayOverlay = true;
            this.mode = "update";
          }
        },
        {
          icon: "-task",
          label: "Tasks",

          condition,
          click: () => {
            this.$router.push({
              name: "tasks",
              params: { user: this.selectedTeamMember }
            });
          }
        },
        {
          icon: "l-discourse",
          label: "View messages",

          condition,
          click: () => {
            this.$router.push({
              name: "comms",
              params: { toMessage: this.selectedTeamMember }
            });
          }
        },
        {
          icon: "-trash",
          label: "Delete account",

          condition: this.hasPermission,
          click: () => {
            this.mode = "delete";
            this.handleTeamMember();
          }
        }
      ];
      return shortcuts.filter((shortcut, index) => {
        shortcut.bg = this.colours[index];
        return shortcut.condition;
      });
    },

    isCurrentUser() {
      return this.selectedTeamMember._id == this.userInformation._id;
    },

    relatedEvents() {
      let events = [...this.events];
      let relatedEvents = [];

      if (events.length > 0) {
        for (let i = 0, len = events.length; i < len; i++) {
          let event = Object.assign({}, events[i]);
          let _start_date = event.start_date,
            _end_date = event.end_date;

          let isAssingnedToEvent = event.assigned_to.some(assignee => {
            return assignee._id == this.selectedTeamMember._id;
          });

          if (isAssingnedToEvent) {
            let timeCode = this.determineTimeCode({
              start_date: _start_date,
              end_date: _end_date
            });

            event.time_code = {
              label: this.makePretty(timeCode),
              value: timeCode
            };

            event.start_time = this.formatDate(_start_date, "hh:mm");
            event.end_time = this.formatDate(_end_date, "hh:mm");
            event.start_date = this.formatDate(event.start_date, "DD-MM YYYY");
            event.end_date = this.formatDate(event.start_date, "DD-MM YYYY");

            relatedEvents.push(event);
          }
        }
      }
      return relatedEvents;
    },

    hasPermission() {
      return this.isCurrentUser || this.adminPermission;
    },

    headings() {
      return {
        name: `
        <h3>Personal information</h3>
        `,
        phoneNumber: `
        <h3>Contact information</h3>
        `,
        user_group: `<h3>Misc information</h3/>`
      };
    },
    teamMemberFormConfig() {
      return [
        {
          component_type: "text",
          model: "name",
          placeholder: "First and lastname",
          noLabel: true
        },

        {
          component_type: "text",
          model: "phoneNumber",
          placeholder: "Phone number",
          noLabel: true
        },
        {
          component_type: "text",
          model: "email",
          placeholder: "Email address",
          noLabel: true
        },
        {
          model: "user_group",
          component_type: "select",
          options: this.getUserGroups,
          noLabel: true,
          placeholder: "Assign to user group"
        },
        {
          component_type: "text",
          input_type: "textarea",
          model: "notes",
          placeholder: "Notes",
          noLabel: true
        }
      ];
    },

    tabItems() {
      return ["events_timeline", "analytics"];
    },

    groupedTeamMembers() {
      let groups = this.groupsWithUsers.filter(({ teamMembers }) => {
        return teamMembers.length > 0;
      });

      return [groups];
    },

    firstTeamMember() {
      return this.groupedTeamMembers[0][0]?.teamMembers[0];
    },
    handleTeamMemberXref() {
      return {
        requestPayloads: {
          create: async ({ success, error }) => {
            try {
              let req = await this.request({
                method: "POST",
                url: "users/register",
                data: {
                  client_id: this.clientInformation._id,
                  admin_gen: true,
                  ...this.inputtedTeamMemberData
                }
              });
              success(req);
            } catch (err) {
              error(err);
            }
          },
          update: async ({ success, error }) => {
            try {
              let req = await this.request({
                method: "PUT",
                url: "users/update",
                data: {
                  _id: this.selectedTeamMember._id,
                  update: this.inputtedTeamMemberData
                }
              });
              success(req);
            } catch (err) {
              error(err);
            }
          },
          delete: async ({ success, error }) => {
            try {
              let req = await this.request({
                method: "DELETE",
                url: "users/delete",
                data: { _id: this.selectedTeamMember._id }
              });
              success(req);
            } catch (err) {
              error(err);
            }
          }
        },
        methods: {
          create: {
            mutation: payload => {
              payload.user_group = this.clientInformation.user_groups.find(
                group => {
                  return group._id == payload.user_group;
                }
              );

              this.CREATE_TEAM_MEMBER(payload);
            },
            data: {
              _id: this.genID(),
              ...this.inputtedTeamMemberData
            }
          },
          update: {
            mutation: ({ index, payload }) => {
              if (payload?.user_group) {
                payload.user_group = this.groupLookup(
                  "user",
                  payload.user_group
                );
              }

              if (this.selectedTeamMember._id != this.userInformation._id) {
                this.UPDATE_ONE_TEAM_MEMBER({ index, payload });
              } else {
                this.UPDATE_USER_INFORMATION(payload);
              }
            },
            data: {
              index: this.selectedTeamMemberIndex,
              payload: this.inputtedTeamMemberData
            }
          },
          delete: {
            mutation: payload => {
              this.DELETE_TEAM_MEMBER(payload);
            },
            data: { index: this.selectedTeamMemberIndex }
          }
        }
      };
    },

    groupsWithUsers() {
      let { user_groups } = { ...this.clientInformation };
      let userGroupArr = [];
      let team = [...this.team, this.userInformation];
      let nameFilter = this.searchTeamMemberName.toLowerCase();

      for (let i = 0, len = user_groups.length; i < len; i++) {
        let userGroup = { ...user_groups[i], teamMembers: [] };
        let clientGroupID = userGroup?._id;
        for (let j = 0, jlen = team.length; j < jlen; j++) {
          let member = team[j];
          if (clientGroupID == member.user_group._id) {
            if (!member.name.toLowerCase().includes(nameFilter)) {
              continue;
            }
            userGroup.teamMembers.push(member);
          }
        }
        userGroupArr.push(userGroup);
      }
      return userGroupArr;
    }
  },
  watch: {
    selectedTeamMember() {
      this.getAuditLog();
    },
    searchTeamMemberName: {
      immediate: false,
      handler() {
        this.setTeamMember();
      }
    }
  },

  created() {
    let routeTeamMember = this.$route.params?.user;
    let routeTab = this.$route.params?.tab;
    if (routeTeamMember) {
      this.searchTeamMemberName = routeTeamMember;
    } else {
      this.setTeamMember();
    }
    if (routeTab) {
      this.selectedTab = routeTab;
    }
    this.loading = true;
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Team", [
      "UPDATE_ONE_TEAM_MEMBER",
      "DELETE_TEAM_MEMBER",
      "CREATE_TEAM_MEMBER"
    ]),
    async deleteActivityLog() {
      this.activityLoading = true;
      let apiPayload = {
        method: "DELETE",
        url: "services/logs/delete"
      };
      try {
        await this.request(apiPayload);
        this.activityLoading = false;
        this.selectedUserActivity = [];
      } catch (error) {
        this.activityLoading = false;
      }
    },
    toggleOverlay(val) {
      this.displayOverlay = val;
    },
    determineTimeCode({ start_date, end_date }) {
      let now = this.initMoment(),
        startDate = this.initMoment(start_date),
        endDate = this.initMoment(end_date);

      let timeXref = {
        [endDate.isAfter(now)]: "completed",
        [startDate.isAfter(now)]: "upcoming"
      };
      return timeXref[true] ? timeXref[true] : "in_progress";
    },
    getAuditLog() {
      this.loading = true;
      this.request({
        method: "GET",
        url: "services/logs",
        params: { user_id: this.selectedTeamMember._id }
      }).then(response => {
        this.loading = false;
        this.selectedUserActivity = response;
      });
    },
    async handleTeamMember(e) {
      if (e) {
        this.inputtedTeamMemberData = Object.assign({}, e);
      }
      // Update team member from form
      let methodXref = this.handleTeamMemberXref.methods[this.mode];
      let requestXref = this.handleTeamMemberXref.requestPayloads[this.mode];

      // Run xref methods
      methodXref.mutation(methodXref.data);
      try {
        await requestXref({
          success: res => {
            if (this.mode == "create") {
              this.UPDATE_ONE_TEAM_MEMBER({
                index: this.team.length - 1,
                payload: res
              });
            }
          },
          error: err => {
            console.log(err);
            this.toggleOverlay(false);
          }
        });
      } catch (error) {
        this.toggleOverlay(false);
      }
    },
    clearSearch() {
      this.searchTeamMemberName = "";
    },
    setTeamMember(teamMember = this.firstTeamMember, index = 0) {
      if (teamMember) {
        this.selectedTeamMember = teamMember;
        this.selectedTeamMemberIndex = this.team.findIndex(member => {
          return member._id == teamMember._id;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.team_container {
  display: flex;
  flex: 1;
  font-size: 0.9em;
  max-height: 100%;
  background: white;
}

.is_user_badge {
  font-size: 1.3em;
  margin-left: 20px;
}

.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.user_group_icon {
  font-size: 1.2em;
  margin-right: 10px;
}

.view_team_member {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.data_field {
  flex: 1;
}
.user_sidebar {
  display: flex;
  flex: 0.2;
  flex-direction: column;
  border-left: $border;
  padding: 20px;
  h5,
  h4,
  h3 {
    margin: 0;
  }
  h3 {
    margin-top: 10px;
  }
  &:first-child {
    margin: 10px 0 50px 0;
  }
}
.no_related_events {
  p {
    margin-bottom: 5px;
  }
}
.shortcuts_container {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: $border;
  * {
    cursor: pointer;
    margin: 0 5px;
  }
  i {
    opacity: 0.9;

    border-radius: 50%;
    padding: 10px;
    color: white;
    &:hover {
      opacity: 1;
    }
  }
}

.activity_wrapper {
  display: flex;
  flex: 1;
  padding: 20px;
  background: rgb(250, 250, 250);
  &.display_center {
    justify-content: center;
    align-items: center;
  }
}
.activity_wrapper {
  overflow-x: hidden;
  max-height: calc(100% - 200px);
}
.title_container {
  display: flex;
  align-items: center;
}

.title_bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  h3 {
    margin: 0;
  }
}
/*

   __  __       _     _ _
  |  \/  | ___ | |__ (_) | ___
  | |\/| |/ _ \| '_ \| | |/ _ \
  | |  | | (_) | |_) | | |  __/
  |_|  |_|\___/|_.__/|_|_|\___|


*/
.mobile {
  .user_container {
    flex-direction: column;
  }
  /deep/ {
    .el-card {
      margin: 0;
    }
  }
}
</style>
