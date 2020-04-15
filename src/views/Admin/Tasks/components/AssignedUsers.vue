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
        class="avatar_wrapper"
        :name="user.name"
        :size="size"
      >
        <div
          v-if="removeUser"
          class="remove_avatar_wrapper"
          @click="emitRemoveUser(user._id)"
        >
          <i class="bx bx-x"></i>
        </div>
      </Avatar>
    </div>

    <el-popover trigger="click">
      <ActionIcon v-if="addNew" slot="reference" />
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
    },
    addNew: {
      type: Boolean,
      default: false
    },
    removeUser: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 40
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
  },
  methods: {
    emitRemoveUser(id) {
      let filteredUsers = [...this.users].filter(x => {
        return x._id != id;
      });
      this.$emit("removeUsers", { update: filteredUsers });
    }
  }
};
</script>
<style lang="scss" scoped>
.users {
  &/deep/ .el-avatar {
    margin-right: 5px;
  }
  &.multi_users {
    display: flex;
  }
}
.users_wrapper {
  display: flex;
  align-items: center;
}
.avatar_wrapper:hover .remove_avatar_wrapper {
  opacity: 1;
}
.remove_avatar_wrapper {
  position: absolute;
  top: -2px;
  bottom: 35px;
  right: -2px;
  left: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background: rgb(235, 235, 235);
  border-radius: 50%;
  color: #333;
  transition: $default_transition opacity;
  opacity: 0;
  cursor: pointer;
}
</style>
