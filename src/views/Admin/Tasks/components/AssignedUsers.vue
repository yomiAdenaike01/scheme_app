<template>
  <div class="assigned_users">
    <div
      v-if="users.length > 0"
      class="users"
      :class="{ multi_users: users.length > 1 }"
    >
      <Avatar
        v-for="(user, index) in users"
        :key="user._id ? user._id : index"
        :name="user.name ? user.name : 'no one'"
      />
    </div>
    <el-popover trigger="click">
      <ActionIcon slot="reference" />
      <Form
        :submit-button="{ text: 'Assign user' }"
        :config="assignUserConfig"
        @val="$emit('assignUser', $event)"
      />
    </el-popover>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AssignedUsers",
  components: {
    ActionIcon: () => import("@/components/ActionIcon"),
    Avatar: () => import("@/components/Avatar"),
    Form: () => import("@/components/Form")
  },
  props: {
    users: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  computed: {
    ...mapState("Admin", ["teamInformation"]),
    teamMembers() {
      let members = [];
      for (let i = 0, len = this.teamInformation?.length; i < len; i++) {
        let teamMember = this.teamInformation[i];
        if (this.users.indexOf(teamMember._id) == -1) {
          members.push({ label: teamMember.name, value: teamMember._id });
        }
      }
      return members;
    },
    assignUserConfig() {
      return [
        {
          "component-type": "select",
          options: this.teamMembers,
          model: "assignedTo",
          multiple: true
        }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
.users {
  &/deep/ .el-avatar {
    width: 35px;
    height: 35px;
    border-top-left-radius: 20%;
    margin-right: 5px;
  }
}
.assigned_users {
  display: flex;
  align-items: center;
}
</style>
