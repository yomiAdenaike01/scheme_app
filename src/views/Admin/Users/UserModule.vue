<template>
  <div
    v-loading="loading"
    class="user_module_container"
    element-loading-text="Getting team please wait...."
  >
    <UserGroup
      v-if="getIsAdmin"
      add-new
      @createUserGroup="displayDialog = $event"
    />

    <UserGroup>
      <div class="user_groups_table_container">
        <Title title="User Groups" subtitle="Manage and contact users here" />

        <div v-if="hasEntries(getFilteredTeam)" class="row_wrapper">
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
                  :user-information="{ ...member, groupID: group.value }"
                  @viewUser="viewUser = $event"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no_content_container flex_center">
          <InformationDisplay
            :display-text="{
              heading: '',
              content: '',
              textAlign: 'center',
              headingAlign: 'center'
            }"
          >
            <i slot="header" class="bx bx-user"></i>
            <el-button
              slot="information"
              @click="displayDialog = !displayDialog"
              >Open user management dialog</el-button
            >
          </InformationDisplay>
        </div>
      </div>
    </UserGroup>

    <!-- Quick actions -->
    <UserManagementActions v-if="getIsAdmin && teamInformation.length > 0" />
    <!-- User Module dialog -->
    <UserModuleDialog
      :display="displayDialog"
      @toggle="displayDialog = $event"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import User from "./components/User";
import UserModuleDialog from "./components/UserModuleDialog";
import UserGroup from "./components/UserGroup";
import UserManagementActions from "./components/UserManagementActions";

import Title from "@/components/Title";
import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "UserModule",

  components: {
    Title,
    User,
    UserGroup,
    UserModuleDialog,
    UserManagementActions,
    InformationDisplay
  },

  data() {
    return {
      displayDialog: false,
      loading: true,
      viewUser: false
    };
  },

  activated() {
    Promise.all([this.getEvents(), this.getTeam()])
      .then(response => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },

  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["teamInformation", "groupIDs"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getFilteredTeam"]),

    filteredGroupsWithUsers() {
      let groups = this.groupsWithUsers.filter(({ label, teamMembers }) => {
        return label != "System Administrator" && teamMembers.length > 0;
      });

      return [groups];
    },
    groupsWithUsers() {
      let { userGroups } = { ...this.clientInformation };
      let userGroupArr = [];
      let team = [...this.teamInformation];

      for (let j = 0, len = userGroups.length; j < len; j++) {
        let userGroup = { ...userGroups[j], teamMembers: [] };
        let { value } = userGroup;

        team.map(member => {
          if (member.groupID == value) {
            userGroup.teamMembers.push(member);
          }
        });
        userGroupArr.push(userGroup);
      }

      return userGroupArr;
    }
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
  height: 100%;
  overflow-x: hidden;
}
.row_wrapper {
  padding-top: 20px;
  display: flex;
  flex: 1;
}
.user_group_row {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.user_group_container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.user_group_col {
  display: flex;
  flex: 1;
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
