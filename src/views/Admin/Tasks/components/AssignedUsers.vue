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
    <ActionIcon
      class="new_user_icon"
      icon="plus"
      @click="$emit('assignUser')"
    />
  </div>
</template>

<script>
export default {
  name: "AssignedUsers",
  components: {
    ActionIcon: () => import("@/components/ActionIcon"),
    Avatar: () => import("@/components/Avatar")
  },
  props: {
    users: {
      type: Array,
      required: true
    }
  }
};
</script>
<style lang="scss" scoped>
.users {
  &/deep/ .avatar_container {
    border-top-left-radius: 20%;
    box-shadow: none;
    .el-avatar {
      font-size: 10px;
      border-top-left-radius: 20%;
    }
  }
}
.assigned_users {
  display: flex;
  align-items: center;
}
.new_user_icon {
  margin-left: 10px;
}
</style>
