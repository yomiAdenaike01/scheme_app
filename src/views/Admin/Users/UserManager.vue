<template>
  <el-row
    type="flex"
    class="user_container p-4 h-100"
    v-loading="loading"
    :element-loading-text="
      `Getting
    team please wait....`
    "
    :gutter="10"
  >
    <UserGroup addNew @createUserGroup="displayDialog = $event" />

    <UserGroup v-if="filteredGroupsWithUsers.length > 0">
      <div>
        <Title title="User Groups" subtitle="Manage and contact users here" />
        <el-row
          v-for="(count, i) in filteredGroupsWithUsers"
          :key="`${count}${i}`"
        >
          <el-col :span="10" v-for="(group, index) in count" :key="index">
            <div class="p-4 m-1 user_group_container">
              <div class=" icon_text_container flex_center mb-3">
                <i class="bx bx-user user_group_icon"></i>
                <span class="capitalize">{{ `${group.name}s` }}</span>
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
    <el-col class=" quick_actions_wrapper">
      <el-card class="quick_action h-90">
        <div
          class="quick_action_container"
          v-for="({ icon, title, subtitle, click }, index) in quickActions"
          :key="index"
          @click="click"
        >
          <div class="flex_center columns txt_center p-4">
            <i :class="icon" class="quick_action_icon mb-3" />

            <Title
              tag="h4"
              defaultClass="m-0"
              :title="title"
              :subtitle="subtitle"
            />
          </div>
        </div>
      </el-card>
    </el-col>
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
      loading: true,
      viewUser: false
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["teamInformation", "groupIDs"]),
    ...mapGetters(["getIsAdmin"]),

    quickActions() {
      return [
        {
          icon: "bx bx-volume-full",
          title: "Create announcement",
          click: () => {
            this.genPromptBox({
              boxType: "prompt",
              title: "Create annoucement",
              text:
                "You are about to create a system annoucement, this will send an email to all users, please enter the content of the email below",
              type: "info"
            })
              .then(response => {
                this.genEmail({
                  subject: "Annoucement",
                  to: "adenaikeyomi@gmail.com",
                  context: {
                    body: response.value
                  }
                });
              })
              .catch(err => {
                return err;
              });
          },
          subtitle:
            "Create a system wide notification that will notify all users this can be through email or scheme messenger"
        }
      ];
    },

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
    ...mapActions("Admin", ["getTeam"]),
    ...mapActions(["genPromptBox", "genEmail"]),
    logChanges(e) {
      console.log(e);
    }
  },
  components: {
    Title,
    User,
    UserGroup,
    UserManagerDialog
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
.user_group_icon {
  font-size: 1.2em;
  margin-right: 10px;
}
.quick_action {
  &/deep/ {
    .el-card__body {
      padding: 0;
    }
  }
}
.quick_actions_wrapper {
  width: 20%;
}
.quick_action_container {
  border-bottom: $border;
  cursor: pointer;
  &:hover {
    background: $hover_grey;
    transition: $default_transition background;
  }
}
.quick_action_icon {
  font-size: 1.5em;
}
.icon_text_container {
  border-radius: 10px;
  background: rgb(245, 245, 245);
  padding: 10px;
  color: #222;
  font-size: 0.9em;
}
</style>
