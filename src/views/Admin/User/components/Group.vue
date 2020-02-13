<template>
  <div class="group_container shadow m-4" :class="{new_group:addNew}">
    <div class="columns">
      <div v-if="!addNew"></div>
      <slot></slot>
    </div>

    <div v-if="addNew" class="flex_center columns new_group_container h-100">
      <Icon class="large_icon grey mb-5" icon="el-icon-user" :bg="getDefaultColour" />
      <h2 class="large">Create User Group</h2>
      <small class="grey">Create a new user group and assign users</small>
      <el-button
        class="mt-4"
        icon="el-icon-plus"
        circle
        type="primary"
        @click="$emit('createUser',true)"
      ></el-button>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon";
import { mapGetters } from "vuex";
export default {
  name: "Group",
  props: {
    addNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },

  computed: {
    // Can display a list of users
    ...mapGetters(["getDefaultColour"])
  },
  components: {
    Icon
  }
};
</script>
<style lang="scss" scoped>
.group_container {
  width: 70%;
  &.new_group {
    width: 20%;
  }
}
</style>
