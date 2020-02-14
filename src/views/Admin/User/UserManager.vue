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
    <UserGroup
      v-if="getIsAdmin"
      addNew
      @createUserGroup="displayDialog = $event"
    />

    <UserGroup v-if="filteredGroupsWithUsers.length > 0">
      <el-row
        v-for="(count, i) in filteredGroupsWithUsers"
        :key="`${count}${i}`"
        type="flex"
      >
        <el-col v-for="(group, index) in count" :key="index">
          <div class="m-2 p-2">
            <div class="title_container">
              <el-button
                class="large_icon no_events borderless"
                icon="el-icon-user"
              ></el-button>
              {{ group.name }}
            </div>

            <User
              v-for="member in group.teamMembers"
              :data="{ ...member, groupID: group.value }"
              :key="member._id"
            />
          </div>
        </el-col>
      </el-row>
    </UserGroup>

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
import Draggable from "vuedraggable";
import UserGroup from "./components/UserGroup";
export default {
  name: "UserManager",
  activated() {
    this.getTeam()
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },
  data() {
    return {
      displayDialog: false,
      localUserGroup: [],
      loading: true
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["team", "groupIDs"]),
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
      let team = [...this.team];
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
    ...mapActions("Admin", ["getTeam"]),
    logChanges(e) {
      console.log(e);
    }
  },
  components: {
    User,
    UserGroup,
    UserManagerDialog,
    Draggable
  },
  watch: {
    localUserGroup(val) {
      console.log(val);
    }
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
.user_group_container {
  border: 2px solid whitesmoke;
}
</style>
