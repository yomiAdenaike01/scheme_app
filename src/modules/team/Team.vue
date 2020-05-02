<template>
  <div class="team_container">
    <TeamOverlay
      :display="overlays.manageTeam"
      @close="overlays.manageTeam = false"
    />

    <TeamGroup add-new @createTeamGroup="overlays.manageTeam = $event" />

    <TeamGroup v-if="team.length > 0">
      <div class="team_group_container">
        <TextDisplay
          :display-text="{
            heading: 'All teams',
            content:
              'Here is a list of all users, select one to view their information'
          }"
        />

        <div class="row_wrapper">
          <div
            v-for="(count, i) in filteredGroupsWithUsers"
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
                  <div class="flex_center">
                    <i class="bx bx-user user_group_icon"></i>
                    <span class="capitalize">{{ group.label }}</span>
                  </div>
                </div>

                <TeamMember
                  v-for="member in group.teamMembers"
                  :key="member._id"
                  :member-information="{ ...member, groupID: group.groupID }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeamGroup>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import TeamGroup from "./components/TeamGroup";
import TeamMember from "./components/TeamMember";
import TeamOverlay from "./components/TeamOverlay";
import TextDisplay from "@/components/TextDisplay";

export default {
  name: "Team",
  components: {
    TeamMember,
    TeamGroup,
    TeamOverlay,
    TextDisplay
  },
  data() {
    return {
      globalOverlayName: "profile",
      overlays: {
        manageTeam: false
      },
      viewUser: false
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState(["team"]),
    ...mapGetters(["getFilteredTeam"]),

    filteredGroupsWithUsers() {
      let groups = this.groupsWithUsers.filter(({ teamMembers }) => {
        return teamMembers.length > 0;
      });

      return [groups];
    },

    groupsWithUsers() {
      let { user_groups } = { ...this.clientInformation };
      let userGroupArr = [];
      let team = [...this.team];

      for (let j = 0, len = user_groups.length; j < len; j++) {
        let userGroup = { ...user_groups[j], teamMembers: [] };
        let clientGroupID = userGroup?._id;

        team.map(member => {
          if (clientGroupID == member.user_group._id) {
            userGroup.teamMembers.push(member);
          }
        });
        userGroupArr.push(userGroup);
      }
      return userGroupArr;
    }
  }
};
</script>

<style lang="scss" scoped>
.team_container {
  display: flex;
  flex: 1;
  font-size: 0.9em;
  padding: 20px;
  max-height: 100%;
}
.team_group_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: calc(100% - 100px);
  overflow-x: hidden;
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
  flex: 1;
  margin-top: 20px;
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
  background: rgb(250, 250, 250);
  border-radius: 10px;
  color: #222;
  font-size: 0.9em;
  padding: 10px 0px;
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
