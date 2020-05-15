<template>
  <div class="team_container">
    <div class="team_sidebar">
      <div v-if="team.length > 0" class="team_group_container">
        <div class="filter_team_members">
          <i class="bx bx-search"></i>
          <input
            v-model="searchTeamMemberName"
            class="s_input"
            type="text"
            placeholder="Search team members"
          />
          <i
            v-if="searchTeamMemberName.length > 0"
            class="bx bx-x trigger"
            @click="clearSearch"
          ></i>

          <i
            v-if="hasPermission"
            class="bx bx-plus"
            @click="
              displayOverlay = true;
              mode = 'create';
            "
          ></i>
        </div>

        <div v-if="groupedTeamMembers.length > 0" class="row_wrapper">
          <div
            v-for="(count, i) in groupedTeamMembers"
            :key="`${count}${i}`"
            class="user_group_row"
          >
            <div
              v-for="(group, index) in count"
              :key="`${group.groupID}${index}`"
              class="user_group_col"
            >
              <div
                :key="
                  `${group.groupID}${Math.random()
                    .toString(16)
                    .slice(2)}`
                "
                class="team_wrapper"
              >
                <div class="icon_text_container">
                  <div class="divider"></div>
                  <span class="capitalize">{{ group.label }}</span>
                  <div class="divider"></div>
                </div>
                <div v-if="group.teamMembers.length > 0">
                  <div
                    v-for="(member, index) in group.teamMembers"
                    :key="member._id"
                    :class="{
                      active: selectedTeamMember._id == member._id
                    }"
                    class="team_member_container"
                    @click="setTeamMember(member, index)"
                  >
                    <Avatar :name="member.name" :size="40">
                      <OnlineIndicator :is-online="member.is_online" />
                    </Avatar>
                    <div class="text_content">
                      <p class="member_name">{{ member.name }}</p>
                      <small class="grey">{{ member.email }}</small>
                    </div>
                    <i
                      v-if="member._id == userInformation._id"
                      class="is_user_badge bx bxs-badge-check"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="view_team_member">
      <Menu
        mode="tabs"
        :tab-items="tabItems"
        :active-tab="selectedTab"
        @changeTab="selectedTab = $event"
      />

      <div
        v-if="selectedTab == 'events_timeline'"
        class="tab_content_container"
      >
        <RelatedEvent
          v-for="event in relatedEvents"
          :key="event._id"
          :event="event"
        />
        <div
          v-if="relatedEvents.length == 0"
          class="no_related_events text_container all_centre"
        >
          <h2>
            {{
              isCurrentUser
                ? "You have no events assigned to you"
                : "No events for this user"
            }}
          </h2>

          <s-button
            class="plain rounded"
            @click="$router.push({ name: 'events' })"
            >Go to events</s-button
          >
        </div>
      </div>

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
        <i
          v-if="hasPermission"
          :style="{ backgroundColor: colours[8] }"
          class="bx bx-cog"
          @click="
            displayOverlay = true;
            mode = 'update';
          "
        ></i>
        <i
          v-if="!isCurrentUser"
          :style="{ backgroundColor: colours[0] }"
          class="bx bx-phone"
        ></i>

        <i
          v-if="!isCurrentUser"
          :style="{ backgroundColor: colours[1] }"
          class="bx bxl-discourse"
          @click="
            $router.push({ name: 'comms', params: { toMessage: member } })
          "
        ></i>
        <i
          v-if="hasPermission"
          :style="{ backgroundColor: colours[4] }"
          class="bx bx-trash"
          @click="
            mode = 'delete';
            handleTeamMember();
          "
        ></i>
      </div>

      <hr />
      <div
        class="activity_wrapper"
        :class="{ display_center: selectedUserActivity.length == 0 }"
      >
        <div v-if="selectedUserActivity.length > 0" v-loading="loading">
          <h3>Activity feed</h3>
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

import Avatar from "@/components/Avatar";
import OnlineIndicator from "@/components/OnlineIndicator";
import Menu from "@/components/Menu";
import SButton from "@/components/SButton";

import Analytics from "./components/Analytics";
import TeamOverlay from "./components/TeamOverlay";
import ActivityLog from "./components/ActivityLog";
import RelatedEvent from "./components/RelatedEvent";

export default {
  name: "Team",
  components: {
    Avatar,
    OnlineIndicator,
    Menu,
    SButton,
    Analytics,

    ActivityLog,
    TeamOverlay,
    RelatedEvent
  },
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
      loading: false
    };
  },

  computed: {
    ...mapState(["colours", "theme", "userInformation", "clientInformation"]),
    ...mapState("Team", ["team"]),
    ...mapState("Events", ["events"]),
    ...mapGetters("Team", ["getFilteredTeam"]),

    ...mapGetters(["getIsAdmin"]),
    isCurrentUser() {
      return this.selectedTeamMember._id == this.userInformation._id;
    },

    relatedEvents() {
      let relatedEvents = [];

      if (this.events.length > 0) {
        let sortedEvents = [...this.events].sort((a, b) => {
          return new Date(a.start_date) - new Date(b.start_date);
        });
        for (let i = 0, len = sortedEvents.length; i < len; i++) {
          let event = sortedEvents[i];
          if (Object.values(event).length > 0) {
            let isAssingnedToEvent =
              event.assigned_to.findIndex(assignee => {
                return assignee._id == this.selectedTeamMember._id;
              }) > -1;
            if (isAssingnedToEvent) {
              let { start_date, end_date, type } = event;
              start_date = this.initMoment(start_date);
              end_date = this.initMoment(end_date);

              relatedEvents.push({ start_date, end_date, type });
            }
          }
        }
      }
      return relatedEvents;
    },

    hasPermission() {
      return this.isCurrentUser || this.getIsAdmin;
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
          "component-type": "text",
          model: "name",
          placeholder: "First and lastname",
          noLabel: true
        },

        {
          "component-type": "text",
          model: "phoneNumber",
          placeholder: "Phone number",
          noLabel: true
        },
        {
          "component-type": "text",
          model: "email",
          placeholder: "Email address",
          noLabel: true
        },
        {
          model: "user_group",
          "component-type": "select",
          options: this.getUserGroups,
          noLabel: true,
          placeholder: "Assign to user group"
        },
        {
          "component-type": "text",
          "input-type": "textarea",
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
          create: {
            method: "POST",
            url: "users/register",
            data: {
              client_id: this.clientInformation._id,
              admin_gen: true,
              ...this.inputtedTeamMemberData
            }
          },
          update: {
            method: "PUT",
            url: "users/update",
            data: {
              _id: this.selectedTeamMember._id,
              update: this.inputtedTeamMemberData
            }
          },
          delete: {
            method: "DELETE",
            url: "users/delete",
            data: { _id: this.selectedTeamMember._id }
          }
        },
        methods: {
          create: {
            mutation: "CREATE_TEAM_MEMBER",
            data: {
              _id: Math.random()
                .toString(16)
                .slice(2),
              ...this.inputtedTeamMemberData
            }
          },
          update: {
            mutation: "UPDATE_ONE_TEAM_MEMBER",
            data: {
              index: this.selectedTeamMemberIndex,
              payload: this.inputtedTeamMemberData
            }
          },
          delete: {
            mutation: "DELETE_TEAM_MEMBER",
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
    handleTeamMember(e) {
      if (e) {
        this.inputtedTeamMemberData = e;
      }
      // Update team member from form
      let methodXref = this.handleTeamMemberXref.methods[this.mode];
      let requestXref = this.handleTeamMemberXref.requestPayloads[this.mode];
      this[methodXref.mutation](methodXref.data);
      this.request(requestXref)
        .then(response => {
          // If create mutation replace the team member at the index
          if (this.mode == "create") {
            this.UPDATE_ONE_TEAM_MEMBER({
              index: this.team.length - 1,
              payload: response
            });
          }
        })
        .catch(() => {
          this.displayOverlay = true;
        });
      this.closeOverlay();
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
.team_sidebar {
  border-right: $border;
}
.team_group_container {
  display: flex;
  flex: 0.2;
  min-width: 300px;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
}
.filter_team_members {
  display: flex;
  align-items: center;
  border-bottom: $border;
  padding: 10px;
  .bx {
    font-size: 1.4em;
    color: #999;
    flex: 0.01;
  }
}
.s_input {
  padding: 10px;
  flex: 1;
  border: none;
}
.row_wrapper {
  padding-top: 20px;
  display: flex;
  flex: 1;
}
.user_group_row {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.is_user_badge {
  font-size: 1.3em;
  margin-left: 20px;
}
.team_wrapper {
  display: flex;
  flex: 1;
  max-height: fit-content;
  flex-direction: column;
}
.user_group_col {
  display: flex;
  padding: 10px;
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
.icon_text_container {
  display: flex;
  align-items: center;
  .divider {
    flex: 1;
    height: 2px;
    background: whitesmoke;
  }
  span {
    text-transform: capitalize;
    justify-content: flex-start;
    padding: 0 10px;
  }
  color: #222;
  font-size: 0.9em;
  padding: 10px 0px;
}

.team_member_container {
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 50px;
  max-height: fit-content;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: $default_transition background;
  &:hover,
  &.active {
    background: rgb(248, 248, 248);
  }
}
.text_content {
  margin-left: 20px;
}
p {
  padding: 0;
  margin: 0;
}
.member_name {
  text-transform: capitalize;
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
.title_container {
  display: flex;
  align-items: center;
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