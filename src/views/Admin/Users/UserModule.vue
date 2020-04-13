<template>
  <div
    v-loading="loading"
    class="user_module_container"
    element-loading-text="Getting team please wait...."
  >
    <UserGroup add-new @createUserGroup="displayDialog = $event" />

    <UserGroup v-if="hasEntries(teamInformation)">
      <div class="user_groups_table_container">
        <InformationDisplay
          :display-text="{
            heading: 'All Users',
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
              :key="index"
              class="user_group_col"
            >
              <div class="user_group_container">
                <div class="icon_text_container">
                  <div class="flex_center">
                    <i class="bx bx-user user_group_icon"></i>
                    <span class="capitalize">{{ group.label }}</span>
                  </div>
                </div>
                <User
                  v-for="member in group.teamMembers"
                  :key="member._id"
                  :user-information="{ ...member, groupID: group.groupID }"
                  @viewUser="viewUser = $event"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserGroup>

    <!-- Quick actions -->
    <UserManagementActions v-if="teamInformation.length > 0" />
    <!-- User Module dialog -->
    <UserModuleDialog
      :display="displayDialog"
      @toggle="displayDialog = $event"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "UserModule",

  components: {
    User: () => import("./components/User"),
    UserGroup: () => import("./components/UserGroup"),
    UserModuleDialog: () => import("./components/UserModuleDialog"),
    UserManagementActions: () => import("./components/UserManagementActions"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },

  data() {
    return {
      displayDialog: false,
      loading: true,
      viewUser: false
    };
  },

  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["teamInformation", "groupIDs"]),
    ...mapGetters("Admin", ["getFilteredTeam"]),

    filteredGroupsWithUsers() {
      let groups = this.groupsWithUsers.filter(({ teamMembers }) => {
        return teamMembers.length > 0;
      });

      return [groups];
    },
    groupsWithUsers() {
      let { userGroups } = { ...this.clientInformation };
      let userGroupArr = [];
      let team = [...this.teamInformation];

      for (let j = 0, len = userGroups.length; j < len; j++) {
        let userGroup = { ...userGroups[j], teamMembers: [] };
        let { groupID } = userGroup;

        team.map(member => {
          if (member.groupID == groupID) {
            userGroup.teamMembers.push(member);
          }
        });
        userGroupArr.push(userGroup);
      }

      return userGroupArr;
    }
  },

  activated() {
    Promise.all([this.getEvents(), this.getTeam()])
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  },
  methods: {
    ...mapActions("Admin", ["getTeam", "getEvents"])
  }
};
</script>

<style lang="scss" scoped>
.user_module_container {
  display: flex;
  flex: 1;
  font-size: 0.9em;
  padding: 20px;
  max-height: 100%;
}
.user_groups_table_container {
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
.user_group_container {
  display: flex;
  flex: 1;
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
