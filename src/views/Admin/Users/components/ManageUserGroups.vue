<template>
  <div class="manage_user_groups_container">
    <h3 class="txt_center">What would you like to do ?</h3>
    <div class="content_container">
      <div class="button_container flex_center w">
        <el-row type="flex" class="mt-4 mb-4">
          <el-col v-for="(management, index) in managementConfig" :key="index">
            <el-button
              plain
              class="m-3 user_group_btn grey"
              @click="currentDisplay = makeUgly(management.name)"
              >{{ management.name }}</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-collapse-transition>
        <Form
          v-if="currentDisplay == 'create_group'"
          :config="userGroupForm"
          @val="groupController"
        />

        <div v-if="currentDisplay == 'delete_group'">
          <div class="txt_center">
            <small>
              <span class="el-icon-warning-outline"></span> Warning: Deleting a
              user group may cause unforseen errors
            </small>
          </div>
          <el-row type="flex">
            <div
              class="group_container p-4 m-3 flex_center columns flex-1"
              v-for="(group, index) in getUserGroups"
              :key="index"
              @click="toggleDelete(group.value)"
              :class="[
                {
                  active: inArray(group.value),
                  no_events: runningDelete == group.value
                }
              ]"
            >
              <p class="mb-3" v-loading="inArray(group.value)">
                {{ group.label }}
              </p>
            </div>
          </el-row>
          <div class="flex flex--end align_end">
            <el-button
              plain
              round
              type="danger"
              v-if="toDelete.length > 0"
              @click="deleteGroup"
              >Confirm</el-button
            >
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import Form from "@/components/Form";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "ManageUserGroups",
  data() {
    return {
      currentDisplay: "",
      toDelete: [],
      runningDelete: ""
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters("Admin", ["getUserGroups"]),
    managementConfig() {
      return [
        {
          name: "Create Group"
        },

        {
          name: "Delete Group"
        }
      ];
    },

    userGroupForm() {
      return [
        {
          "component-type": "text",
          clearable: true,
          placeholder: "Group name",
          model: "label"
        }
      ];
    }
  },
  methods: {
    ...mapActions(["request", "genPromptBox", "closeDialogBox"]),
    inArray(item) {
      return this.toDelete.indexOf(item) > -1;
    },
    groupController(val) {
      switch (this.currentDisplay) {
        case "create_group": {
          this.createUserGroup(val);
          break;
        }
        case "edit_group": {
          this.updateGroup(val);
          break;
        }
        case "delete_group": {
          this.deleteGroup(val);
          break;
        }

        default: {
          break;
        }
      }
    },
    toggleDelete(groupValue) {
      let index = this.toDelete.indexOf(groupValue);
      if (index == -1) {
        this.toDelete.push(groupValue);
      } else {
        this.toDelete.splice(index, 1);
      }
    },

    deleteGroup() {
      // Are users assigned to this group
      this.runningDelete = this.toDelete;
      this.request({
        method: "DELETE",
        url: "clients/group",
        data: { groupType: "userGroups", value: this.toDelete }
      })
        .then(response => {
          this.closeDialog();
        })
        .catch(err => {
          this.closeDialog();
        });
    },

    updateGroup(content) {},
    createUserGroup(content) {
      content.groupType = "userGroups";
      content.value = this.clientInformation.userGroups.length + 1;
      this.currentDisplay = "";
      this.request({
        method: "POST",
        url: "clients/group",
        data: content
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    Form
  }
};
</script>

<style lang="scss" scoped>
.user_group_btn {
  font-size: 1.3em;
  &/deep/ {
    .el-button {
      width: 100px;
    }
  }
}
.group_container {
  border: 1.3px solid #ebeef5;
  transition: 0.56s ease all;
  border-radius: 5px;
  color: #999;
  cursor: pointer;
  min-height: 150px;
  max-height: 200px;
  &.active {
    font-weight: bold;
    border-color: $error_colour;
    color: $error_colour;
  }
  &/deep/ {
    .el-loading-spinner .path {
      stroke: $error_colour;
    }
  }
}
</style>
