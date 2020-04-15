<template>
  <div class="user_info_container">
    <el-collapse
      v-if="getIsAdmin || localUserInformation._id == userInformation._id"
      class="collapse_container"
    >
      <el-collapse-item title="Quick Actions" name="1">
        <div class="quick_actions_container">
          <el-popover trigger="click">
            <el-button v-if="getIsAdmin" slot="reference">{{
              localUserInformation.groupID == 0
                ? "Assign to group"
                : "Reassign to group"
            }}</el-button>
            <el-select v-model="selectedGroup" @change="assignUserToGroup">
              <el-option
                v-for="{ label, value } in getUserGroups"
                :key="value"
                :label="label"
                :value="value"
              >
              </el-option>
            </el-select>
          </el-popover>

          <el-popover trigger="click">
            <el-button slot="reference">Update Personal Information</el-button>
            <Form
              class="full_width"
              submit-text="Update user"
              :config="updateUserForm"
              @val="updateUser"
            />
          </el-popover>
          <el-button v-if="getIsAdmin" plain type="danger" @click="removeUser"
            >Delete Account</el-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="info_container">
      <p>{{ date }}</p>
      <p>{{ localUserInformation.name }}</p>
      <p>{{ localUserInformation.email }}</p>

      <p class="member_name">{{ group }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
export default {
  name: "ProfileInformation",
  components: {
    Form: () => import("@/components/Form")
  },
  data() {
    return {
      selectedGroup: ""
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters([
      "getIsAdmin",
      "getPreviousDeviceInformation",
      "getActiveDialog"
    ]),
    ...mapGetters("Admin", ["getGroupName", "getUserGroups", "teamRef"]),

    localUserInformation() {
      return this.getActiveDialog()?.data;
    },

    updateUserForm() {
      return [
        {
          "component-type": "text",
          model: "name",
          placeholder: "Name",
          optional: true
        },
        {
          "component-type": "text",
          model: "email",
          placeholder: "Email address",
          optional: true
        },
        {
          "component-type": "select",
          placeholder: "User groups",
          options: this.getUserGroups,
          validType: "number",
          model: "userGroup",
          optional: true
        },
        {
          "component-type": "date-picker",
          placeholder: "Date Of Birth",
          "input-type": "date",
          model: "dateOfBirth",
          optional: true
        }
      ];
    },
    date() {
      return this.formatDate(this.localUserInformation.dateCreated);
    },
    group() {
      return this.getGroupName("user", this.localUserInformation.groupID)
        ?.label;
    },
    teamMemberIndex() {
      return this.teamInformation.findIndex(x => {
        return x._id == this.localUserInformation._id;
      });
    }
  },
  methods: {
    ...mapActions([
      "genEmail",
      "request",
      "closeDialog",
      "genPromptBox",
      "restoreDialog"
    ]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    ...mapMutations("Admin", ["UPDATE_ONE_TEAM_MEMBER", ""]),
    updateUser(e) {
      if (!this.hasEntries(e)) {
        this.UPDATE_NOTIFICATIONS({
          type: "error",
          message: "Error updating user, params are missing"
        });
      } else {
        e.dateOfBirth = this.initMoment(e?.dateOfBirth).toISOString();
        this.UPDATE_ONE_TEAM_MEMBER({
          index: this.teamMemberIndex,
          payload: e
        });
        this.closeDialog();

        this.request({
          method: "PUT",
          url: "users/update",
          data: { update: e, _id: this.localUserInformation._id }
        }).catch(() => {
          this.UPDATE_ONE_TEAM_MEMBER(this.teamRef);
        });
      }
    },
    assignUserToGroup() {
      this.UPDATE_ONE_TEAM_MEMBER({
        index: this.teamMemberIndex,
        payload: { groupID: this.selectedGroup }
      });
      this.closeDialog();

      this.request({
        method: "PUT",
        url: "users/update",
        data: {
          _id: this.localUserInformation._id,
          update: { groupID: this.selectedGroup }
        }
      }).catch(() => {
        this.UPDATE_ONE_TEAM_MEMBER(this.teamRef);
        this.loading = false;
      });
    },
    removeUser() {
      this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text: "Are you sure you want to delete this user ?",
        confirm: "Yes"
      }).then(() => {
        this.DELETE_TEAM_MEMBER(this.teamMemberIndex);
        this.request({
          method: "DELETE",
          url: "users/remove",
          data: { _id: this.localUserInformation._id }
        })
          .then(() => {
            this.closeDialog();
          })
          .catch(() => {
            this.ADD_TEAM_MEMBER(this.teamRef);
            this.restoreDialog();
          });
      });
    },

    requestgenEmail() {
      let emailContent = {
        to: "adenaikeyomi@gmail.com",
        subject: "even diff Contact",
        context: {
          test: "Hello from the render"
        }
      };
      this.genEmail(emailContent)
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.warn(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.user_info_container {
  line-height: 2em;
}
.quick_actions_container {
  display: flex;
  align-items: center;

  * {
    flex: 1;
    width: 100%;
    margin: 5px;
  }
}
.info_container {
  border: 2px solid whitesmoke;
  border-radius: 5px;
  line-height: 2.2em;
  margin-top: 20px;
  padding: 20px;
}

.collapse_container {
  border-top: none;
  padding: 20px;
}
</style>
