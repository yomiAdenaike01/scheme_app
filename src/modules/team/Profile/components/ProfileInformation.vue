<template>
  <div class="user_info_container">
    <el-collapse
      v-if="getIsAdmin || localUserInformation._id == userInformation._id"
      class="collapse_container"
    >
      <el-collapse-item title="Quick Actions" name="1">
        <div class="quick_actions_container">
          <el-popover trigger="click">
            <s-button v-if="getIsAdmin" slot="reference" flat center>
              Reassign to group
            </s-button>

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
            <s-button slot="reference" flat center
              >Update Personal Information</s-button
            >
            <Form
              class="full_width"
              submit-text="Update user"
              :config="updateUserForm"
              @val="updateUser"
            />
          </el-popover>
          <s-button
            v-if="getIsAdmin"
            center
            colour-scheme="tertiary"
            icon="x"
            shadow
            @click="removeUser"
            >Delete Account</s-button
          >
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="info_container">
      <p>{{ date }}</p>
      <p>{{ localUserInformation.name }}</p>
      <p>{{ localUserInformation.email }}</p>

      <p class="member_name">{{ localUserInformation.user_group.label }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "ProfileInformation",
  components: {
    Form: () => import("@/components/Form"),
    SButton: () => import("@/components/SButton")
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectedGroup: ""
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState(["team", "teamRef"]),
    ...mapGetters(["getIsAdmin", "getUserGroups", "getActiveOverlay"]),

    localUserInformation() {
      return this.data;
    },

    selectedGroupData() {
      return this.clientInformation.user_groups.find(group => {
        return group._id == this.selectedGroup;
      });
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
          "component-type": "text",
          model: "phone_number",
          placeholder: "Phone number",
          optional: true
        },
        {
          "component-type": "select",
          placeholder: "User groups",
          options: this.getUserGroups,
          validType: "number",
          model: "user_group",
          optional: true
        },
        {
          "component-type": "date-picker",
          placeholder: "Date Of Birth",
          "input-type": "date",
          model: "date_of_birth",
          optional: true
        }
      ];
    },
    date() {
      return this.formatDate(this.localUserInformation.date_created);
    },
    id() {
      return this.localUserInformation._id;
    },

    teamMemberIndex() {
      return this.team.findIndex(x => {
        return x._id == this.localUserInformation._id;
      });
    }
  },
  methods: {
    ...mapActions([
      "genEmail",
      "request",
      "closeOverlay",
      "genPromptBox",
      "restoreOverlay"
    ]),
    ...mapMutations([
      "UPDATE_SYSTEM_NOTIFICATION",
      "UPDATE_ONE_TEAM_MEMBER",
      "DELETE_TEAM_MEMBER"
    ]),
    updateUser(userData) {
      if (!this.hasEntries(userData)) {
        this.UPDATE_SYSTEM_NOTIFICATION({
          message: "Error updating user, params are missing"
        });
      } else {
        userData.date_of_birth = this.initMoment(
          userData?.date_of_birth
        ).toISOString();
        this.UPDATE_ONE_TEAM_MEMBER({
          index: this.teamMemberIndex,
          payload: userData
        });

        this.request({
          method: "PUT",
          url: "users/update",
          data: { update: userData, _id: this.localUserInformation._id }
        }).catch(() => {
          this.UPDATE_ONE_TEAM_MEMBER(this.teamRef);
        });
        this.closeOverlay();
      }
    },
    assignUserToGroup() {
      this.UPDATE_ONE_TEAM_MEMBER({
        index: this.teamMemberIndex,
        payload: { user_group: this.selectedGroupData }
      });

      this.request({
        method: "PUT",
        url: "users/update",
        data: {
          _id: this.localUserInformation._id,
          update: { user_group: this.selectedGroup }
        }
      }).catch(() => {
        this.UPDATE_ONE_TEAM_MEMBER(this.teamRef);
      });
      this.closeOverlay();
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
            this.closeOverlay();
          })
          .catch(() => {
            this.ADD_TEAM_MEMBER(this.teamRef);
            this.restoreOverlay();
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
  justify-content: space-between;
}
.info_container {
  border: $border;
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
