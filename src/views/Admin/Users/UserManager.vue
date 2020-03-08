<template>
  <el-row
    type="flex"
    class="user_container p-4"
    v-loading="loading"
    element-loading-text="
      Getting
    team please wait....
    "
  >
    <UserGroup
      v-if="getIsAdmin"
      addNew
      @createUserGroup="displayDialog = $event"
    />

    <UserGroup>
      <div>
        <Title title="User Groups" subtitle="Manage and contact users here" />

        <div v-if="hasEntries(getFilteredTeam)">
          <el-row
            v-for="(count, i) in filteredGroupsWithUsers"
            :key="`${count}${i}`"
          >
            <el-col
              :span="$mq != 'lg' ? 12 : 8"
              v-for="(group, index) in count"
              :key="index"
            >
              <div class="p-4 m-1 user_group_container">
                <div
                  class="icon_text_container flex flex--space-between align-center mb-3 pl-3 pr-3"
                >
                  <div class="flex_center">
                    <i class="bx bx-user user_group_icon"></i>
                    <span class="capitalize">{{ group.label }}</span>
                  </div>
                </div>
                <User
                  v-for="member in group.teamMembers"
                  :data="{ ...member, groupID: group.value }"
                  :key="member._id"
                  @viewUser="viewUser = $event"
                />
              </div>
            </el-col>
          </el-row>
          {{ filteredGroupsWithUsers }}
        </div>
        <div v-else class="h-100 no_content_container flex_center">
          <Nocontent
            class="pr-4 pl-4"
            :moreInformation="
              getIsAdmin
                ? null
                : {
                    index: 'admin',
                    instruction: 'team_viewing',
                    hoverPosition: 'bottom-end'
                  }
            "
            text="No team members detected, click the button below to go to user management."
            icon="bx bx-user-circle"
          >
            <el-button
              round
              type="primary"
              @click="$router.push({ name: 'user' })"
              size="mini"
              >Create Team Member</el-button
            >
          </Nocontent>
        </div>
      </div>
    </UserGroup>

    <!-- Quick actions -->
    <QuickActions v-if="getIsAdmin" />
    <!-- User manager dialog -->
    <UserManagerDialog
      :display="displayDialog"
      @toggle="displayDialog = $event"
    />
  </el-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import User from "./components/User";
import UserManagerDialog from "./components/UserManagerDialog";
import UserGroup from "./components/UserGroup";
import Title from "@/components/Title";
import QuickActions from "./components/QuickActions";
import Popover from "@/components/Popover";
import Nocontent from "@/components/Nocontent";
export default {
  name: "UserManager",
  activated() {
    Promise.all([this.getEvents(), this.getTeam()])
      .then(response => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
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
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getFilteredTeam"]),
    noContent() {
      return {
        text: "",
        icon: "el-icon-warning-outline",
        buttonText: "Hello"
      };
    },
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
    ...mapActions("Admin", ["getTeam", "getEvents"]),

    logChanges(e) {
      console.log(e);
    }
  },
  components: {
    Title,
    User,
    UserGroup,
    UserManagerDialog,
    QuickActions,
    Popover,
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.user_container {
  font-size: 0.9em;
  height: 90%;
}
.current_user_column {
  max-width: 30%;
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
  opacity: 0.5;
  background: #c8ebfb;
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
  border-radius: 10px;
  background: rgb(250, 250, 250);
  padding: 10px 0px;
  color: #222;
  font-size: 0.9em;
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
