<template>
  <div class="manage_user_groups_container">
    <h3 class="txt_center">What would you like to do ?</h3>
    <div class="content_container">
      <div class="button_container">
        <div v-for="(management, index) in managementConfig" :key="index">
          <el-button
            :type="currentDisplay == makeUgly(management) ? 'primary' : 'plain'"
            class="user_group_btn grey"
            @click="currentDisplay = makeUgly(management)"
            >{{ management }}</el-button
          >
        </div>
      </div>
      <el-collapse-transition>
        <div v-if="currentDisplay.length > 0" class="group_mutation_container">
          <Form
            v-if="currentDisplay == 'create_group'"
            :submit-button="{ text: 'Create Group' }"
            :config="userGroupForm"
            @val="groupController"
          />

          <div
            v-else-if="currentDisplay == 'delete_group'"
            class="delete_group_container"
          >
            <div class="delete_groups">
              <div
                v-for="(group, index) in getUserGroups"
                :key="index"
                class="group"
                :class="[
                  {
                    active: inArray(group.value),
                    no_events: runningDelete == group.value
                  }
                ]"
                @click="toggleDelete(group.value)"
              >
                <p v-loading="runningDelete.indexOf(group.value) > -1">
                  {{ group.label }}
                </p>
              </div>
            </div>
            <el-button
              v-if="toDelete.length > 0"
              plain
              type="danger"
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
  components: {
    Form
  },
  data() {
    return {
      currentDisplay: "",
      toDelete: [],
      runningDelete: [],
      localUserGroupLength: 0
    };
  },
  activated() {
    this.localUserGroupLength = this.clientInformation.userGroups.length;
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters("Admin", ["getUserGroups"]),
    managementConfig() {
      return ["Create Group", "Delete Group"];
    },

    userGroupForm() {
      return [
        {
          "component-type": "text",
          clearable: true,
          placeholder: "Group name",
          model: "label"
        },
        {
          "component-type": "switch",
          placeholder: "Enable bi-directional requesting",
          model: "bidirectionalRequest",
          hint: "This will enable members of this user group to reject events."
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
      this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text:
          "Users that are assigned to this group will be moved to an unassigned category",
        confirm: "Yes"
      }).then(() => {
        this.runningDelete = this.toDelete;
        this.request({
          method: "DELETE",
          url: "clients/group",
          data: { groupType: "userGroups", value: this.toDelete }
        })
          .then(() => {
            this.closeDialog();
          })
          .catch(() => {
            this.closeDialog();
          });
      });
    },

    createUserGroup(content) {
      content.groupType = "userGroups";
      content.value = this.localUserGroupLength + 1;
      if (content?.bidirectionalRequest == true) {
        content.value = Object.assign(
          { bidirectionalRequest: true },
          content.value
        );
      }
      this.currentDisplay = "";
      this.request({
        method: "POST",
        url: "clients/group",
        data: content
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.button_container {
  display: flex;
  justify-content: center;
  & > * {
    margin: 20px;
  }
}
.group_mutation_container {
  padding: 20px;
}
.delete_group_container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 1;
  .group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 10px;
    margin: 10px;
    border: 1.3px solid #ebeef5;
    border-radius: 5px;
    color: #999;
    cursor: pointer;
    max-height: 200px;
    min-height: 150px;
    transition: 0.56s ease all;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.active {
      border-color: $error_colour;
      color: $error_colour;
      font-weight: bold;
    }
    &/deep/ {
      .el-loading-spinner .path {
        stroke: $error_colour;
      }
    }
  }
}
.delete_groups {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
</style>
