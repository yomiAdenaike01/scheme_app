<template>
  <div v-loading="loading" class="user_info_container">
    <el-collapse
      v-if="getIsAdmin || localUserInformation._id == userInformation._id"
      class="collapse_container"
    >
      <el-collapse-item title="Quick Actions" name="1">
        <div class="quick_actions_container">
          <el-button-group>
            <Popover trigger="click">
              <el-button v-if="getIsAdmin" slot="trigger">{{
                localUserInformation.groupID == 0
                  ? "Assign to group"
                  : "Reassign to group"
              }}</el-button>
              <el-select
                slot="content"
                v-model="selectedGroup"
                @change="assignUserToGroup"
              >
                <el-option
                  v-for="{ label, value } in getUserGroups"
                  :key="value"
                  :label="label"
                  :value="value"
                >
                </el-option>
              </el-select>
            </Popover>

            <Popover trigger="click">
              <el-button slot="trigger">Update Personal Information</el-button>
              <Form
                slot="content"
                class="full_width"
                submit-text="Update user"
                :config="updateUserForm"
                @val="updateUser"
              />
            </Popover>
            <el-button v-if="getIsAdmin" plain type="danger" @click="removeUser"
              >Delete Account</el-button
            >
          </el-button-group>
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
import Popover from "@/components/Popover";
import Form from "@/components/Form";
export default {
  name: "ProfileInformation",

  data() {
    return {
      selectedGroup: "",
      loading: false
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters("Admin", ["getGroupName", "getUserGroups"]),
    ...mapGetters([
      "getIsAdmin",
      "getPreviousDeviceInformation",
      "getActiveDialog"
    ]),
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
    removeUnwantedProperties() {
      let cleanedProperties = {};
      for (let property in this.localUserInformation) {
        cleanedProperties[property] = this.localUserInformation[property];
      }
      return cleanedProperties;
    }
  },
  methods: {
    ...mapActions(["genEmail", "request", "closeDialog", "genPromptBox"]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    updateUser(e) {
      if (!this.hasEntries(e)) {
        this.UPDATE_NOTIFICATIONS({
          type: "error",
          message: "Error updating user, params are missing"
        });
      } else {
        e.dateOfBirth = this.initMoment(e?.dateOfBirth).toISOString();
        this.request({
          method: "PUT",
          url: "users/update",
          data: { update: { ...e }, _id: this.localUserInformation._id }
        })
          .then(() => {
            this.reset();
          })
          .catch(() => {
            this.reset();
          });
      }
    },
    assignUserToGroup() {
      this.loading = true;
      this.request({
        method: "PUT",
        url: "users/update",
        data: {
          _id: this.localUserInformation._id,
          update: { groupID: this.selectedGroup }
        }
      })
        .then(() => {
          this.loading = false;
          this.reset();
        })
        .catch(() => {
          this.loading = false;
          this.reset();
        });
    },
    removeUser() {
      this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text: "Are you sure you want to delete this user ?",
        confirm: "Yes"
      }).then(() => {
        this.loading = true;
        this.request({
          method: "DELETE",
          url: "users/remove",
          data: { _id: this.localUserInformation._id }
        })
          .then(() => {
            this.loading = false;
            this.reset();
          })
          .catch(() => {
            this.loading = false;
            this.reset();
          });
      });
    },
    reset() {
      this.getTeam();
      this.closeDialog();
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
  },
  components: {
    Popover,
    Form
  }
};
</script>

<style lang="scss" scoped>
.user_info_container {
  line-height: 2em;
}
.info_container {
  border: 2px solid whitesmoke;
  border-radius: 5px;
  line-height: 2.2em;
  margin-top: 20px;
  padding: 20px;
}

.collapse_container {
  border: none;
  border-bottom: none;
  padding: 20px;
}
</style>
