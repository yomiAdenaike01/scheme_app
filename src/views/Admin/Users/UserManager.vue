<template>
  <el-row
    type="flex"
    class="user_container p-4 h-100"
    v-loading="loading"
    :element-loading-text="
      `Getting
    team please wait....`
    "
  >
    <UserGroup addNew @createUserGroup="displayDialog = $event" />

    <UserGroup v-if="filteredGroupsWithUsers.length > 0">
      <div>
        <Title title="User Groups" subtitle="Manage and contact users here" />
        <el-row
          v-for="(count, i) in filteredGroupsWithUsers"
          :key="`${count}${i}`"
        >
          <el-col :span="8" v-for="(group, index) in count" :key="index">
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
    <el-card class=" m-3 quick_actions_wrapper quick_action">
      <div
        v-loading="id == quickActionLoading"
        class="quick_action_container"
        v-for="({ icon, title, subtitle, click, id }, index) in quickActions"
        :key="index"
        @click="click"
      >
        <div class="flex_center columns txt_center p-4">
          <div class="icons mb-3">
            <i
              v-if="isSuccess.length == 0"
              :class="icon"
              class="quick_action_icon "
            />

            <div v-if="isSuccess == id" class="check_container">
              <i class="bx bx-check"></i>
            </div>
          </div>
          <Title
            tag="h4"
            defaultClass="m-0"
            :title="title"
            :subtitle="subtitle"
          />
        </div>
      </div>
    </el-card>
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
      viewUser: false,
      isSuccess: "",
      isSuccessInterval: "",
      quickActionLoading: ""
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
          id: "create_announcement",

          click: () => {
            this.createAnnoucement();
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

    createAnnoucement() {
      this.genPromptBox({
        boxType: "prompt",
        title: "Create annoucement",
        text:
          "You are about to create a system annoucement, this will send an email to all users, please enter the content of the email below",
        type: "info"
      })
        .then(response => {
          this.quickActionLoading = "create_announcement";
          this.genEmail({
            subject: "Annoucement",
            to: "adenaikeyomi@gmail.com",
            context: {
              body: response.value
            }
          })
            .then(response => {
              this.isSuccess = "create_announcement";
            })
            .catch(err => {});
        })
        .catch(err => {
          return err;
        });
    },

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
    isSuccess(val) {
      console.log(val);
      this.isSuccessInterval = setTimeout(() => {
        this.isSuccess = "";
        this.quickActionLoading = "";
      }, 1000);
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
  background: rgb(250, 250, 250);
  padding: 10px 0px;
  color: #222;
  font-size: 0.9em;
}
.check_container {
  border-radius: 50%;
  background: $success_colour;
  color: white;
  font-size: 20px;
  padding: 10px 13px;
}
</style>
