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
                <div
                  v-for="member in group.teamMembers"
                  :key="member._id"
                  :class="{ active: selectedTeamMember._id == member._id }"
                  class="team_member_container"
                  @click="setTeamMember(member)"
                >
                  <Avatar :name="member.name" :size="20">
                    <OnlineIndicator :is-online="member.is_online" />
                  </Avatar>
                  <div class="text_content">
                    <p class="member_name">{{ member.name }}</p>
                    <small class="grey">{{ member.email }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No team members</p>
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
      <div class="viewing_container">
        <template v-if="selectedTab == 'contact_information'">
          <div
            v-for="(item, index) in teamMemberInformation[selectedTab]"
            :key="index"
          >
            <div class="data_field">
              <p>{{ item }}</p>
              {{ selectedTeamMember[item] }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- View the user details -->
    <div class="user_sidebar">
      <Avatar :name="selectedTeamMember.name" :size="80" />
      <h3>{{ selectedTeamMember["name"] }}</h3>
      <small class="grey">{{
        selectedTeamMember["user_group"]["label"]
      }}</small>
      <small class="grey">{{ selectedTeamMember["email"] }}</small>
      <div class="shortcuts_container">
        <i
          :style="{ backgroundColor: colours[8] }"
          class="bx bx-cog"
          @click="displayOverlay = true"
        ></i>
        <i :style="{ backgroundColor: colours[0] }" class="bx bx-phone"></i>
        <div
          class="message"
          @click="
            $router.push({ name: 'comms', params: { toMessage: member } })
          "
        >
          <i
            :style="{ backgroundColor: colours[1] }"
            class="bx bxl-discourse"
          ></i>
        </div>
      </div>
      <hr />
    </div>
    <!-- Edit user overlay -->
    <Overlay :display="displayOverlay" @close="displayOverlay = false">
      <Form :config="updateTeamMemberConfig" @val="updateTeamMember" />
    </Overlay>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import Avatar from "@/components/Avatar";
import OnlineIndicator from "@/components/OnlineIndicator";
import Menu from "@/components/Menu";
import Overlay from "@/components/Overlay";
import Form from "@/components/Form";

export default {
  name: "Team",
  components: {
    Avatar,
    OnlineIndicator,
    Menu,
    Overlay,
    Form
  },
  data() {
    return {
      displayOverlay: false,
      searchTeamMemberName: "",
      viewUser: false,
      selectedTab: "contact_information",
      selectedTeamMember: {}
    };
  },

  computed: {
    ...mapState(["colours", "theme", "userInformation", "clientInformation"]),
    ...mapState(["team"]),
    ...mapGetters(["getFilteredTeam"]),
    updateTeamMemberConfig() {
      return [];
    },
    teamMemberInformation() {
      return {
        contact_information: ["email", "name"],
        events_timeline: []
      };
    },
    tabItems() {
      return ["contact_information", "events_timeline", "analytics"];
    },

    groupedTeamMembers() {
      let groups = this.groupsWithUsers.filter(({ teamMembers }) => {
        return teamMembers.length > 0;
      });

      return [groups];
    },

    firstTeamMember() {
      return this.groupedTeamMembers[0][0]["teamMembers"][0];
    },

    groupsWithUsers() {
      let { user_groups } = { ...this.clientInformation };
      let userGroupArr = [];
      let team = [...this.team];
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
    searchTeamMemberName: {
      immediate: false,
      handler() {
        this.setTeamMember();
      }
    }
  },
  created() {
    this.setTeamMember();
  },
  methods: {
    ...mapMutations(["UPDATE_TEAM_MEMBER"]),
    updateTeamMember() {},
    setTeamMember(teamMember = this.firstTeamMember) {
      this.selectedTeamMember = teamMember;
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
    background: rgb(245, 245, 245);
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
.shortcuts_container {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: $border;
  > * {
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
