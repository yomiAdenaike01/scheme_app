<template>
  <el-row
    type="flex"
    class="user_container p-4"
    v-loading="loading"
    :element-loading-text="
      `Getting
    team please wait....`
    "
  >
    <UserGroup v-if="getIsAdmin" addNew @createUserGroup="displayDialog = $event" />

    <UserGroup v-if="filteredGroupsWithUsers.length > 0">
      <div>
        <Title title="User Groups" subtitle="Manage and contact users here" />
        <el-row v-for="(count, i) in filteredGroupsWithUsers" :key="`${count}${i}`">
          <el-col :span="$mq != 'lg' ? 12 : 8" v-for="(group, index) in count" :key="index">
            <div class="p-4 m-1 user_group_container">
              <div class="icon_text_container flex flex--space-between align-center mb-3 pl-3 pr-3">
                <div class="flex_center">
                  <i class="bx bx-user user_group_icon"></i>
                  <span class="capitalize">{{ `${group.name}s` }}</span>
                </div>
                <i class="el-icon-more"></i>
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
      </div>
    </UserGroup>
    <!-- Quick actions -->
    <QuickActions v-if="getIsAdmin" />
    <!-- User manager dialog -->
    <UserManagerDialog :display="displayDialog" @toggle="displayDialog = $event" />
  </el-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import User from "./components/User";
import UserManagerDialog from "./components/UserManagerDialog";
import UserGroup from "./components/UserGroup";
import Title from "@/components/Title";
import QuickActions from "./components/QuickActions";
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

    filteredGroupsWithUsers() {
      let groups = this.groupsWithUsers;
      for (let i = 0, len = groups.length; i < len; i++) {
        let group = groups[i];

        if (group && group.hasOwnProperty("teamMembers")) {
          if (group.teamMembers.length <= 0) {
            groups.splice(i, 1);
          }
        }
      }
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
    QuickActions
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
